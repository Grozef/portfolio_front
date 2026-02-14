<template>
  <div class="terminal" @click="focusInput">
    <TerminalHeader :is-processing="terminalStore.isProcessing" />

    <div ref="outputContainer" class="terminal__output">
      <TerminalOutput :history="terminalStore.formattedHistory" :prompt="prompt" />
    </div>

    <TerminalInput
      ref="terminalInput"
      v-model="localInput"
      :prompt="prompt"
      :is-processing="terminalStore.isProcessing"
      @submit="handleCommand"
      @history-up="localInput = terminalStore.getPreviousCommand()"
      @history-down="localInput = terminalStore.getNextCommand()"
    />

    <KonamiAnimation :show="showKonamiAnimation" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useTerminalStore } from '@/stores/terminal'
import { useGitHubStore } from '@/stores/github'
import { useEasterEggs } from '@/composables/useEasterEggs'
import { useKonamiCode } from '@/composables/useKonamiCode'

import TerminalHeader from './TerminalHeader.vue'
import TerminalOutput from './TerminalOutput.vue'
import TerminalInput from './TerminalInput.vue'
import KonamiAnimation from './KonamiAnimationGradius.vue'

const terminalStore = useTerminalStore()
const githubStore = useGitHubStore()
const router = useRouter()
const { discoverEgg, EASTER_EGGS, resetEggs } = useEasterEggs()

const outputContainer = ref(null)
const terminalInput = ref(null)
const localInput = ref('')
const showKonamiAnimation = ref(false)
const isMobile = ref(false)

// Logic to focus input
const focusInput = () => {
  terminalInput.value?.focus()
}

// Scroll management
const scrollToBottom = () => {
  nextTick(() => {
    if (outputContainer.value) {
      outputContainer.value.scrollTop = outputContainer.value.scrollHeight
    }
  })
}

watch(() => terminalStore.history.length, scrollToBottom)

// Responsive check
const checkMobile = () => {
  isMobile.value = window.innerWidth < 600
}

const prompt = computed(() => {
  const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
  return isMobile.value ? '$' : `visitor@portfolio [${time}]`
})

// Command execution logic
const handleCommand = async (commandText) => {
  if (!commandText.trim()) return

  await terminalStore.processCommand(commandText, async (input) => {
    const parts = input.trim().split(/\s+/)
    const command = parts[0].toLowerCase()
    const args = parts.slice(1)

    switch (command) {
      case 'help':
        outputHelp()
        break
      case 'clear':
        terminalStore.clearHistory()
        break
      case 'about':
        outputAbout()
        break
      case 'projects':
        await outputProjects(args.includes('--pinned'))
        break
      case 'skills':
        outputSkills(args[0])
        break
      case 'contact':
        outputContact()
        break
      case 'whoami':
        // Calling your existing logic for browser/system info
        terminalStore.addToHistory({ type: 'output', format: 'whoami', content: getSystemInfo() })
        discoverEgg(EASTER_EGGS.ENHANCED_WHOAMI)
        break
      case 'gui':
        terminalStore.addToHistory({ type: 'output', content: 'Redirecting to GUI...' })
        setTimeout(() => router.push('/projects'), 500)
        break
      case 'resetegg()':
        await resetEggs()
        terminalStore.addToHistory({ type: 'success', content: '✓ Easter eggs reset!' })
        break
      default:
        terminalStore.addToHistory({
          type: 'error',
          content: `Command not found: ${command}. Type 'help' for assistance.`
        })
    }
  })
}

// Helper: Data output functions (Simplified for brevity, keep your logic here)
const outputAbout = () => {
  terminalStore.addToHistory({
    type: 'output',
    format: 'about',
    content: {
      name: 'Full Stack Developer',
      title: 'Cook and philosopher',
      bio: 'Developer with 3+ years experience...',
      location: 'Lyon, France',
      status: 'Open to opportunities'
    }
  })
}

// System info parser (extracted from your original code)
const getSystemInfo = () => {
  return {
    browser: navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Other',
    platform: navigator.platform,
    online: navigator.onLine ? 'Online' : 'Offline',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  }
}

// Konami Logic
useKonamiCode(() => {
  discoverEgg(EASTER_EGGS.KONAMI_CODE)
  showKonamiAnimation.value = true
  setTimeout(() => { showKonamiAnimation.value = false }, 5000)
})

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  focusInput()
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style lang="scss" scoped>
.terminal {
  background: var(--terminal-bg);
  border: 1px solid var(--terminal-border);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 80vh;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);

  &__output {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    font-size: 0.9rem;
    line-height: 1.6;
    scrollbar-width: thin;
    scrollbar-color: var(--terminal-border) transparent;
  }
}
</style>