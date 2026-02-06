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
          <input
            ref="inputRef"
            v-model="currentInput"
            @keydown.enter="handleEnter"
            type="text"
            class="terminal-input"
            :type="inputType"
            autofocus
          />
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

const terminalBody = ref(null)
const inputRef = ref(null)
const terminalLines = ref([])
const currentInput = ref('')
const currentPrompt = ref('login: ')
const showInput = ref(false)
const inputType = ref('text')
const loginStep = ref(0) // 0 = username, 1 = password
const username = ref('')
const attemptCount = ref(0)

const messages = {
  failed_login: [
    "Nice try, mais on n'est plus en 2004. 🔒",
    "Accès refusé. Peut-être dans une autre vie ? 🚫",
    "admin/admin ? Vraiment ? C'est ton meilleur coup ? 😏",
    "Erreur 403: Trop prévisible. 🎭",
    "Permission denied. Essaye encore ! (ou pas) 🛡️"
  ]
}

const addLine = (text, className = '', prompt = '') => {
  terminalLines.value.push({ text, class: className, prompt })
  nextTick(() => {
    if (terminalBody.value) {
      terminalBody.value.scrollTop = terminalBody.value.scrollHeight
    }
  })
}

const typeWriter = async (text, delay = 30) => {
  for (let i = 0; i < text.length; i++) {
    await new Promise(resolve => setTimeout(resolve, delay))
    if (terminalLines.value.length > 0) {
      const lastLine = terminalLines.value[terminalLines.value.length - 1]
      lastLine.text = text.substring(0, i + 1)
    }
  }
}

const initializeTerminal = async () => {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  addLine('Initializing secure connection...')
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  addLine('SSH-2.0-OpenSSH_8.4p1 Debian-5+deb11u1', 'success')
  await new Promise(resolve => setTimeout(resolve, 500))
  
  addLine('')
  addLine('╔════════════════════════════════════════╗', 'accent')
  addLine('║   PORTFOLIO ADMINISTRATION SYSTEM      ║', 'accent')
  addLine('║        Unauthorized Access             ║', 'accent')
  addLine('║           Will Be Monitored            ║', 'accent')
  addLine('╚════════════════════════════════════════╝', 'accent')
  addLine('')
  
  addLine('Type "exit" or "quit" to leave this terminal', 'dim')
  
  await new Promise(resolve => setTimeout(resolve, 800))
  
  showInput.value = true
  nextTick(() => {
    inputRef.value?.focus()
  })
  
  // Discover easter egg
  discoverEgg(EASTER_EGGS.FAKE_ADMIN)
}

const handleEnter = async () => {
  const input = currentInput.value.trim()
  
  // Check for exit command at any stage
  if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
    addLine(input, '', currentPrompt.value)
    currentInput.value = ''
    showInput.value = false
    
    await new Promise(resolve => setTimeout(resolve, 500))
    addLine('Exiting fake admin terminal...', 'success')
    await new Promise(resolve => setTimeout(resolve, 1000))
    addLine('Goodbye!', 'success')
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push('/')
    return
  }
  
  if (loginStep.value === 0) {
    // Username step
    addLine(input, '', 'login: ')
    username.value = input
    currentInput.value = ''
    currentPrompt.value = 'password: '
    inputType.value = 'password'
    loginStep.value = 1
  } else {
    // Password step
    addLine('•'.repeat(input.length), '', 'password: ')
    currentInput.value = ''
    showInput.value = false
    
    await new Promise(resolve => setTimeout(resolve, 800))
    addLine('Authenticating...', 'dim')
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    attemptCount.value++
    
    // Check credentials
    if (username.value.toLowerCase() === 'admin' && input.toLowerCase() === 'admin') {
      const message = messages.failed_login[0]
      addLine(message, 'error')
    } else {
      const randomMessage = messages.failed_login[Math.floor(Math.random() * messages.failed_login.length)]
      addLine(randomMessage, 'error')
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    addLine('')
    addLine(`Login attempt #${attemptCount.value} failed.`, 'warning')
    
    if (attemptCount.value >= 3) {
      await new Promise(resolve => setTimeout(resolve, 800))
      addLine('')
      addLine('Trop de tentatives échouées. Retour à l\'accueil...', 'warning')
      await new Promise(resolve => setTimeout(resolve, 2000))
      router.push('/')
    } else {
      await new Promise(resolve => setTimeout(resolve, 1000))
      addLine('')
      addLine('Hint: Type "exit" to leave this terminal', 'dim')
      loginStep.value = 0
      username.value = ''
      currentPrompt.value = 'login: '
      inputType.value = 'text'
      showInput.value = true
      nextTick(() => {
        inputRef.value?.focus()
      })
    }
  }
}

onMounted(() => {
  initializeTerminal()
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
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
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
