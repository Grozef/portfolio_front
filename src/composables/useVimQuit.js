// Vim command easter egg: ESC + :q
import { onMounted, onUnmounted } from 'vue'
import { useEasterEggs } from './useEasterEggs'
import { useTerminalStore } from '@/stores/terminal'

export function useVimQuit() {
  const { discoverEgg, EASTER_EGGS } = useEasterEggs()
  const terminalStore = useTerminalStore()
  
  let escapePressed = false
  let commandBuffer = ''
  let resetTimeout = null

  const handleKeyDown = (event) => {
    // Check for Escape key
    if (event.key === 'Escape') {
      escapePressed = true
      commandBuffer = ''
      
      // Reset after 2 seconds if no command follows
      clearTimeout(resetTimeout)
      resetTimeout = setTimeout(() => {
        escapePressed = false
        commandBuffer = ''
      }, 2000)
      return
    }

    // If escape was pressed, capture the next characters
    if (escapePressed) {
      commandBuffer += event.key
      
      // Check for :q or :quit commands
      if (commandBuffer === ':q' || commandBuffer === ':qu' || commandBuffer === ':qui' || commandBuffer === ':quit') {
        if (event.key === 'Enter' || commandBuffer === ':q' && commandBuffer.length === 2) {
          triggerVimEasterEgg()
          escapePressed = false
          commandBuffer = ''
          clearTimeout(resetTimeout)
          event.preventDefault()
        }
      } else if (commandBuffer.length > 6) {
        // Reset if buffer gets too long without matching
        escapePressed = false
        commandBuffer = ''
      }
    }
  }

  const triggerVimEasterEgg = () => {
    discoverEgg(EASTER_EGGS.VIM_QUIT)
    
    const messages = [
      "Nice try, but you can't quit this portfolio that easily! ",
      "I see you're a Vim user! But :q won't work here... ",
      "vim: command not found. This is not your favorite editor!",
      "vim is not installed. Try 'nano' instead."
    ]
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)]
    
    terminalStore.addToHistory({
      type: 'output',
      format: 'ascii',
      content: `
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║                    VIM EASTER EGG FOUND!                   ║
║                                                            ║
║  ${randomMessage.padEnd(58)}║
║                                                            ║
║                         ESC :q                             ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
      `
    })
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown)
    if (resetTimeout) clearTimeout(resetTimeout)
  })

  return {
    triggerVimEasterEgg
  }
}
