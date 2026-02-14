import { ref, watch, readonly } from 'vue'

const STORAGE_KEY = 'custom-cursor-enabled'

// Shared state across all consumers
const isCustomCursorEnabled = ref(loadPreference())

function loadPreference() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored !== null) return stored === 'true'
  // Default: enabled on non-touch devices
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  return !isTouch
}

function applyCursorClass(enabled) {
  if (enabled) {
    document.documentElement.classList.add('custom-cursor-active')
  } else {
    document.documentElement.classList.remove('custom-cursor-active')
  }
}

// Apply immediately on load
applyCursorClass(isCustomCursorEnabled.value)

watch(isCustomCursorEnabled, (val) => {
  localStorage.setItem(STORAGE_KEY, String(val))
  applyCursorClass(val)
})

export function useCursorPreference() {
  const toggle = () => {
    isCustomCursorEnabled.value = !isCustomCursorEnabled.value
  }

  return {
    isCustomCursorEnabled: readonly(isCustomCursorEnabled),
    toggleCursor: toggle
  }
}