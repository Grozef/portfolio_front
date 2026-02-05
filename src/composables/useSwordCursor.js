import { ref } from 'vue'

const swordCursorActive = ref(false)

export function useSwordCursor() {
  const activateSwordCursor = () => {
    swordCursorActive.value = true
    document.body.classList.add('sword-cursor-active')
  }

  const deactivateSwordCursor = () => {
    swordCursorActive.value = false
    document.body.classList.remove('sword-cursor-active')
  }

  const toggleSwordCursor = () => {
    if (swordCursorActive.value) {
      deactivateSwordCursor()
    } else {
      activateSwordCursor()
    }
  }

  return {
    swordCursorActive,
    activateSwordCursor,
    deactivateSwordCursor,
    toggleSwordCursor
  }
}
