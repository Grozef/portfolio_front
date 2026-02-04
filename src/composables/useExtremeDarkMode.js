// Extreme dark mode: flashlight cursor in darkness
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useEasterEggs } from './useEasterEggs'

const STORAGE_KEY = 'extreme_dark_mode'

export function useExtremeDarkMode() {
  const { discoverEgg, EASTER_EGGS } = useEasterEggs()
  const isActive = ref(localStorage.getItem(STORAGE_KEY) === 'true')

  const toggle = () => {
    isActive.value = !isActive.value
    
    if (isActive.value) {
      discoverEgg(EASTER_EGGS.EXTREME_DARK_MODE)
    }
  }

  const handleKeyDown = (event) => {
    // CTRL+Z to toggle
    if (event.ctrlKey && event.key === 'z') {
      event.preventDefault()
      toggle()
    }
  }

  // Save preference to localStorage
  watch(isActive, (newValue) => {
    localStorage.setItem(STORAGE_KEY, newValue.toString())
  })

  onMounted(() => {
    document.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown)
  })

  return {
    isActive,
    toggle
  }
}
