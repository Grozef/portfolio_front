import { ref } from 'vue'

const swordCursorActive = ref(false)
const allowedRoute = ref(null)

export function useSwordCursor() {
  const activateSwordCursor = (routePath = null) => {
    console.log('🗡️ Activating sword cursor')
    swordCursorActive.value = true
    allowedRoute.value = routePath
    document.body.classList.add('sword-cursor-active')
    console.log('✓ Sword active:', swordCursorActive.value)
  }

  const deactivateSwordCursor = () => {
    swordCursorActive.value = false
    allowedRoute.value = null
    document.body.classList.remove('sword-cursor-active')
  }

  const toggleSwordCursor = (routePath = null) => {
    if (swordCursorActive.value) {
      deactivateSwordCursor()
    } else {
      activateSwordCursor(routePath)
    }
  }

  const checkRouteAndDeactivate = (currentRoute) => {
    if (swordCursorActive.value && allowedRoute.value && currentRoute !== allowedRoute.value) {
      deactivateSwordCursor()
    }
  }

  return {
    swordCursorActive,
    allowedRoute,
    activateSwordCursor,
    deactivateSwordCursor,
    toggleSwordCursor,
    checkRouteAndDeactivate
  }
}