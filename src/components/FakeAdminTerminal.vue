<template>
  <div class="fake-admin-terminal">
    <div class="terminal-window">
      <div class="terminal-header">
        <span class="header-title">SSH: root@portfolio.local</span>
        <div class="header-buttons">
          <span class="btn minimize"></span>
          <span class="btn maximize"></span>
          <span class="btn close" @click="$router.push('/')"></span>
        </div>
      </div>

      <div class="terminal-body" ref="terminalBody">
        <div v-for="(line, index) in terminalLines" :key="index" class="terminal-line">
          <span v-if="line.prompt" class="prompt">{{ line.prompt }}</span>
          <span :class="line.class">{{ line.text }}</span>
        </div>

        <div v-if="showInput" class="terminal-input-line">
          <span class="prompt">{{ currentPrompt }}</span>
          <input ref="inputRef" v-model="currentInput" @keydown.enter="handleEnter" type="text" class="terminal-input"
            :type="inputType" autofocus />
          <span class="cursor">_</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useEasterEggs } from '@/composables/useEasterEggs'

const router = useRouter()
const { discoverEgg, EASTER_EGGS } = useEasterEggs()

// --- 1. DYNAMIC RECIPE IMPORT ---
// Vite's glob import to scan the directory for JSON files
// 'eager: true' loads them immediately instead of lazy-loading
const recipeFiles = import.meta.glob('@/data/recipes/**/*.json', { eager: true });

// --- 2. TERMINAL STATE ---
const terminalBody = ref(null)
const inputRef = ref(null)
const terminalLines = ref([])
const currentInput = ref('')
const currentPrompt = ref('login: ')
const showInput = ref(false)
const inputType = ref('text')

// --- 3. SHELL & LOGIN STATE ---
const isMaster = ref(false)
const currentDir = ref('/') // Options: '/', 'desserts', 'plats', 'entrees'
const loginStep = ref(0)    // 0 = username, 1 = password
const username = ref('')
const attemptCount = ref(0)

// Virtual filesystem for the cookbook
const cookbook = ref({
  desserts: {},
  plats: {},
  entrees: {}
})

// --- 4. DATA LOADING ---
const loadRecipes = () => {
  try {
    for (const path in recipeFiles) {
      // Parse path (e.g., /src/data/recipes/desserts/cookies.json)
      const parts = path.split('/')
      const category = parts[parts.length - 2] // Extract folder name
      const fileName = parts[parts.length - 1].replace('.json', '.txt') // Virtual .txt extension
      
      // Get the JSON content (default export)
      const content = recipeFiles[path].default || recipeFiles[path]
      
      if (cookbook.value[category]) {
        cookbook.value[category][fileName] = {
          text: content.display || "Content missing (key: 'display')",
          data: content.downloadData || {}
        }
      }
    }
  } catch (err) {
    console.error("Failed to load cookbook archives:", err)
  }
}

// --- 5. UTILITY FUNCTIONS ---
const addLine = (text, className = '', prompt = '') => {
  terminalLines.value.push({ text, class: className, prompt })
  nextTick(() => {
    if (terminalBody.value) {
      terminalBody.value.scrollTop = terminalBody.value.scrollHeight
    }
  })
}

const downloadJSON = (fileName, data) => {
  const jsonString = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName.replace('.txt', '.json')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  addLine(`[SYSTEM] File ${fileName.replace('.txt', '.json')} downloaded successfully.`, 'success')
}

// --- 6. COMMAND HANDLER ---
const handleEnter = async () => {
  const input = currentInput.value.trim()
  const args = input.split(' ')
  const command = args[0].toLowerCase()
  
  // A. Universal Exit Command
  if (command === 'exit' || command === 'quit') {
    addLine(input, '', currentPrompt.value)
    router.push('/')
    return
  }

  // B. MASTER CODE DETECTION
  if (input === 'EGG-MLC4O1EB-MASTER' && !isMaster.value) {
    addLine('********', '', currentPrompt.value)
    isMaster.value = true
    showInput.value = false
    currentInput.value = ''
    await new Promise(r => setTimeout(r, 600))
    addLine('(!) WARNING: KERNEL OVERRIDE DETECTED', 'warning')
    await new Promise(r => setTimeout(r, 800))
    addLine('MASTER ACCESS GRANTED. Welcome back, Chef !', 'success')
    addLine('Type "help" to see cookbook commands.', 'dim')
    currentPrompt.value = 'root@portfolio:~# '
    showInput.value = true
    return
  }

  // C. MASTER SHELL MODE (Recipes & Navigation)
  if (isMaster.value) {
    addLine(input, '', currentPrompt.value)
    currentInput.value = ''

    switch (command) {
      case 'ls':
        if (currentDir.value === '/') {
          addLine(' plats/  desserts/', 'accent')
        } else {
          const folder = currentDir.value.replace('/', '')
          const files = Object.keys(cookbook.value[folder] || {}).join('  ')
          addLine(files || '(Empty directory)', 'dim')
        }
        break

      case 'cd':
        const target = args[1]
        if (!target || target === '..' || target === '/' || target === '~') {
          currentDir.value = '/'
          currentPrompt.value = 'root@portfolio:~# '
        } else {
          const folder = target.replace('/', '')
          if (cookbook.value[folder]) {
            currentDir.value = `/${folder}`
            currentPrompt.value = `root@portfolio:~/${folder}# `
          } else {
            addLine(`cd: no such directory: ${target}`, 'error')
          }
        }
        break

      case 'cat':
        const file = args[1]
        const folder = currentDir.value.replace('/', '')
        if (folder && cookbook.value[folder][file]) {
          addLine(cookbook.value[folder][file].text)
        } else {
          addLine(`cat: ${file || 'null'}: No such file`, 'error')
        }
        break

      case 'download':
        const fDown = args[1]
        const dDown = currentDir.value.replace('/', '')
        if (dDown && cookbook.value[dDown][fDown]) {
          downloadJSON(fDown, cookbook.value[dDown][fDown].data)
        } else {
          addLine("Usage: download [filename.txt]", "warning")
        }
        break

      case 'help':
        addLine('Available commands: ls, cd, cat, download, clear, exit')
        break

      case 'clear':
        terminalLines.value = []
        break

      default:
        if (input) addLine(`bash: ${command}: command not found`, 'error')
    }
  } 
  
  // D. STANDARD LOGIN MODE
  else {
    if (loginStep.value === 0) {
      addLine(input, '', 'login: ')
      username.value = input
      currentInput.value = ''
      currentPrompt.value = 'password: '
      inputType.value = 'password'
      loginStep.value = 1
    } else {
      addLine('•'.repeat(input.length), '', 'password: ')
      currentInput.value = ''
      showInput.value = false
      
      await new Promise(r => setTimeout(r, 800))
      addLine('Authenticating...', 'dim')
      await new Promise(r => setTimeout(r, 1000))
      
      addLine('Permission denied (publickey).', 'error')
      attemptCount.value++
      
      if (attemptCount.value >= 3) {
        addLine('Too many failed attempts. Disconnecting...', 'warning')
        await new Promise(r => setTimeout(r, 1500))
        router.push('/')
      } else {
        loginStep.value = 0
        currentPrompt.value = 'login: '
        inputType.value = 'text'
        showInput.value = true
        nextTick(() => inputRef.value?.focus())
      }
    }
  }
}

// --- 7. INITIALIZATION ---
onMounted(() => {
  loadRecipes() // Load data from JSON files first
  
  setTimeout(() => {
    addLine('SSH-2.0-OpenSSH_8.4p1 Debian-5+deb11u1', 'success')
    addLine('Authorized access only. All activities are logged.', 'dim')
    showInput.value = true
    nextTick(() => inputRef.value?.focus())
  }, 500)
  
  discoverEgg(EASTER_EGGS.FAKE_ADMIN)
})
</script>

<style lang="scss" scoped>
* {
  cursor: default !important;
}

.fake-admin-terminal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  z-index: 10000;
}

.terminal-window {
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  background: #0a0a0a;
  border: 2px solid #33ff33;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 50px rgba(51, 255, 51, 0.3);
}

.terminal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: #1a1a1a;
  border-bottom: 1px solid #33ff33;
}

.header-title {
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  color: #33ff33;
  font-weight: bold;
}

.header-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  cursor: pointer;

  &.minimize {
    background: #ffbd2e;
  }

  &.maximize {
    background: #28c940;
  }

  &.close {
    background: #ff5f57;

    &:hover {
      filter: brightness(1.2);
    }
  }
}

.terminal-body {
  white-space: pre;
  font-family: 'Courier New', monospace;

  padding: 1.5rem;
  height: 500px;
  max-height: 70vh;
  overflow-y: auto;
  font-family: 'Courier New', monospace;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #33ff33;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #0a0a0a;
  }

  &::-webkit-scrollbar-thumb {
    background: #33ff33;
    border-radius: 4px;
  }
}

.terminal-line {
  margin-bottom: 0.25rem;

  .prompt {
    color: #00ff00;
    font-weight: bold;
    margin-right: 0.5rem;
  }

  &.success {
    color: #00ff00;
  }

  &.error {
    color: #ff4444;
  }

  &.warning {
    color: #ffaa00;
  }

  &.accent {
    color: #00ffff;
  }

  &.dim {
    color: #66ff66;
    opacity: 0.7;
  }
}

.terminal-input-line {
  display: flex;
  align-items: center;
  margin-top: 0.5rem;

  .prompt {
    color: #00ff00;
    font-weight: bold;
    margin-right: 0.5rem;
  }
}

.terminal-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #33ff33;
  font-family: 'Courier New', monospace;
  font-size: 0.95rem;

  &[type="password"] {
    letter-spacing: 0.2em;
  }
}

.cursor {
  color: #33ff33;
  animation: blink 1s step-end infinite;
}

@keyframes blink {

  0%,
  50% {
    opacity: 1;
  }

  51%,
  100% {
    opacity: 0;
  }
}

@media (max-width: 768px) {
  .fake-admin-terminal {
    padding: 1rem;
  }

  .terminal-body {
    font-size: 0.85rem;
    height: 400px;
  }
}
</style>
