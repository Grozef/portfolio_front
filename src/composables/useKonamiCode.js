import { ref, onMounted, onUnmounted } from 'vue'

export function useKonamiCode(onSuccess) {
  const konamiCode = [
    'ArrowUp',
    'ArrowUp', 
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'b',
    'a'
  ]
  
  const userInput = ref([])
  const isActivated = ref(false)
  const sequenceComplete = ref(false)
  
  const checkCode = () => {
    // Keep only last 10 keys
    if (userInput.value.length > konamiCode.length) {
      userInput.value.shift()
    }
    
    // Check if sequence matches
    if (userInput.value.length === konamiCode.length) {
      const matches = konamiCode.every((code, index) => 
        code === userInput.value[index]
      )
      
      if (matches) {
        sequenceComplete.value = true
        return true
      }
    }
    
    return false
  }
  
  const handleKeyDown = (e) => {
    // Ignore if already activated
    if (isActivated.value) return
    
    const key = e.key
    
    // Check if Enter is pressed after complete sequence
    if (key === 'Enter' && sequenceComplete.value) {
      e.preventDefault()
      isActivated.value = true
      if (onSuccess) {
        onSuccess()
      }
      // Reset after animation
      setTimeout(() => {
        userInput.value = []
        isActivated.value = false
        sequenceComplete.value = false
      }, 5000)
      return
    }
    
    // Add key to sequence
    userInput.value.push(key)
    checkCode()
  }
  
  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
  })
  
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })
  
  return {
    isActivated
  }
}