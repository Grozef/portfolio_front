import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTerminalStore = defineStore('terminal', () => {
  const history = ref([])
  const currentInput = ref('')
  const isProcessing = ref(false)
  const commandHistory = ref([])
  const historyIndex = ref(-1)

  const availableCommands = {
    help: {
      description: 'Show available commands',
      usage: 'help [command]'
    },
    about: {
      description: 'Display information about me',
      usage: 'about'
    },
    projects: {
      description: 'List all projects from GitHub',
      usage: 'projects [--pinned]'
    },
    open: {
      description: 'Open a project modal',
      usage: 'open <project-name>'
    },
    skills: {
      description: 'Display technical skills',
      usage: 'skills [category]'
    },
    contact: {
      description: 'Show contact information',
      usage: 'contact'
    },
    clear: {
      description: 'Clear terminal history',
      usage: 'clear'
    },
    theme: {
      description: 'Toggle terminal theme',
      usage: 'theme [dark|light]'
    },
    whoami: {
      description: 'Display current user',
      usage: 'whoami'
    },
    date: {
      description: 'Show current date and time',
      usage: 'date'
    },
    echo: {
      description: 'Print text to terminal',
      usage: 'echo <text>'
    },
    social: {
      description: 'Show social links',
      usage: 'social'
    },
    experience: {
      description: 'Show work experience',
      usage: 'experience'
    },
    gui: {
      description: 'Switch to GUI mode',
      usage: 'gui'
    }
  }

  const addToHistory = (entry) => {
    history.value.push({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...entry
    })
  }

  const addCommand = (command) => {
    if (command.trim()) {
      commandHistory.value.unshift(command)
      if (commandHistory.value.length > 50) {
        commandHistory.value.pop()
      }
    }
    historyIndex.value = -1
  }

  const getPreviousCommand = () => {
    if (historyIndex.value < commandHistory.value.length - 1) {
      historyIndex.value++
      return commandHistory.value[historyIndex.value]
    }
    return currentInput.value
  }

  const getNextCommand = () => {
    if (historyIndex.value > 0) {
      historyIndex.value--
      return commandHistory.value[historyIndex.value]
    }
    if (historyIndex.value === 0) {
      historyIndex.value = -1
      return ''
    }
    return currentInput.value
  }

  const clearHistory = () => {
    history.value = []
  }

  // Keep only the first n entries — used for replace-mode display
  const truncateTo = (n) => {
    history.value.splice(n)
  }

  const processCommand = async (command, executeCallback) => {
    const trimmed = command.trim()
    if (!trimmed) return

    addCommand(trimmed)
    addToHistory({ type: 'input', content: trimmed })
    isProcessing.value = true

    try {
      await executeCallback(trimmed)
    } catch (error) {
      addToHistory({
        type: 'error',
        content: `Error: ${error.message}`
      })
    } finally {
      isProcessing.value = false
    }
  }

  const formattedHistory = computed(() => {
    return history.value
  })

  return {
    history,
    currentInput,
    isProcessing,
    commandHistory,
    availableCommands,
    addToHistory,
    addCommand,
    getPreviousCommand,
    getNextCommand,
    clearHistory,
    truncateTo,
    processCommand,
    formattedHistory
  }
})