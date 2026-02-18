<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useEasterEggs } from '@/composables/useEasterEggs'
import { useCursorPreference } from '@/composables/useCursorPreference'

const { discoverEgg, EASTER_EGGS } = useEasterEggs()
const { isCustomCursorEnabled } = useCursorPreference()

const cursorX = ref(0)
const cursorY = ref(0)
const cursorDotX = ref(0)
const cursorDotY = ref(0)
const isHovering = ref(false)
const isClicking = ref(false)
const isVisible = ref(false)
const isMobile = ref(true)
const isSleeping = ref(false)
const wasSleeping = ref(false)

const isKeyboardUser = ref(false)

const handleTabKey = (e) => {
  if (e.key === 'Tab') {
    isKeyboardUser.value = true
    document.body.style.cursor = 'auto'
  }
}

const handleMouseActivity = () => {
  if (isKeyboardUser.value) {
    isKeyboardUser.value = false
    document.body.style.cursor = 'none'
  }
}

const lastCursorX = ref(0)
const lastCursorY = ref(0)
let rafId = null
let inactivityTimeout = null
const INACTIVITY_DELAY = 30000

const updateCursor = (e) => {
  // Firefox fallback: make visible on first movement
  if (!isVisible.value) isVisible.value = true
  
  cursorX.value = e.clientX
  cursorY.value = e.clientY
  
  lastCursorX.value = e.clientX
  lastCursorY.value = e.clientY
  
  resetInactivityTimer()
  wakeCursor()
}

const animateDot = () => {
  cursorDotX.value += (cursorX.value - cursorDotX.value) * 0.15
  cursorDotY.value += (cursorY.value - cursorDotY.value) * 0.15
  rafId = requestAnimationFrame(animateDot)
}

const handleMouseEnter = () => { isVisible.value = true }
const handleMouseLeave = () => { isVisible.value = false }
const handleMouseDown = () => { isClicking.value = true; wakeCursor() }
const handleMouseUp = () => { isClicking.value = false }

const checkHoverable = (e) => {
  const target = e.target
  if (!target) return
  const isHoverable = target.closest('a, button, [data-cursor-hover], input, textarea, select')
  isHovering.value = !!isHoverable
}

const startSleeping = () => {
  if (!isSleeping.value) {
    isSleeping.value = true
    wasSleeping.value = true
  }
}

const wakeCursor = () => {
  if (isSleeping.value && wasSleeping.value) {
    discoverEgg(EASTER_EGGS.SLEEPING_CURSOR)
    wasSleeping.value = false
  }
  isSleeping.value = false
}

const resetInactivityTimer = () => {
  if (inactivityTimeout) clearTimeout(inactivityTimeout)
  inactivityTimeout = setTimeout(startSleeping, INACTIVITY_DELAY)
}

onMounted(() => {
  // Detect mobile/touch
  isMobile.value = window.matchMedia('(max-width: 768px)').matches ||
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0

  if (!isMobile.value) {
    window.addEventListener('mousemove', updateCursor)
    window.addEventListener('mousemove', checkHoverable)
    window.addEventListener('mouseover', checkHoverable) // Extra check for Firefox
    window.addEventListener('mouseenter', handleMouseEnter)
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mousemove', handleMouseActivity)

    document.addEventListener('keydown', handleTabKey)

    resetInactivityTimer()
    animateDot()
  }
})

onUnmounted(() => {
  if (!isMobile.value) {
    window.removeEventListener('mousemove', updateCursor)
    window.removeEventListener('mousemove', checkHoverable)
    window.removeEventListener('mouseover', checkHoverable)
    window.removeEventListener('mouseenter', handleMouseEnter)
    window.removeEventListener('mouseleave', handleMouseLeave)
    window.removeEventListener('mousedown', handleMouseDown)
    window.removeEventListener('mouseup', handleMouseUp)
    window.removeEventListener('mousemove', handleMouseActivity)

    document.removeEventListener('keydown', handleTabKey)

    if (rafId) cancelAnimationFrame(rafId)
    if (inactivityTimeout) clearTimeout(inactivityTimeout)
  }
})
</script>

<template>
  <div v-if="!isMobile && isCustomCursorEnabled && !isKeyboardUser" class="custom-cursor" :class="{ visible: isVisible }">
    <div v-if="!isSleeping"
      class="cursor-ring"
      :class="{ hovering: isHovering, clicking: isClicking }"
      :style="{ transform: `translate(${cursorDotX}px, ${cursorDotY}px)` }"
    ></div>
    <div v-if="!isSleeping"
      class="cursor-dot"
      :class="{ hovering: isHovering, clicking: isClicking }"
      :style="{ transform: `translate(${cursorX}px, ${cursorY}px)` }"
    ></div>
    
    <div v-if="isSleeping"
      class="sleeping-cursor"
      :style="{ 
        left: lastCursorX + 'px',
        top: lastCursorY + 'px'
      }"
    >
      <div class="sleep-text">Zzz</div>
      <div class="zzz zzz-1">z</div>
      <div class="zzz zzz-2">z</div>
      <div class="zzz zzz-3">z</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.custom-cursor {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 10000;
  opacity: 0;
  transition: opacity 0.3s ease;

  &.visible {
    opacity: 1;
  }
}

.cursor-ring {
  position: absolute;
  width: 40px;
  height: 40px;
  border: 1px solid var(--terminal-accent);
  border-radius: 50%;
  margin: -20px 0 0 -20px;
  transition: 
    width 0.2s ease,
    height 0.2s ease,
    margin 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease;

  &.hovering {
    width: 60px;
    height: 60px;
    margin: -30px 0 0 -30px;
    border-color: var(--terminal-accent-secondary);
    background: rgba(167, 139, 250, 0.1);
  }

  &.clicking {
    width: 30px;
    height: 30px;
    margin: -15px 0 0 -15px;
  }
}

.cursor-dot {
  position: absolute;
  width: 6px;
  height: 6px;
  background: var(--terminal-accent);
  border-radius: 50%;
  margin: -3px 0 0 -3px;
  transition: 
    width 0.1s ease,
    height 0.1s ease,
    margin 0.1s ease,
    background-color 0.2s ease;

  &.hovering {
    background: var(--terminal-accent-secondary);
  }

  &.clicking {
    width: 10px;
    height: 10px;
    margin: -5px 0 0 -5px;
  }
}

.sleeping-cursor {
  position: absolute;
  transform: translate(-20px, -20px);
  animation: sleepFloat 3s ease-in-out infinite;
}

.sleep-text {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--terminal-accent);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  font-family: var(--font-mono);
}

.zzz {
  position: absolute;
  font-size: 1rem;
  color: var(--terminal-accent);
  opacity: 0;
  animation: zzz-float 2s ease-in-out infinite;
  font-family: var(--font-mono);
}

.zzz-1 {
  font-size: 0.875rem;
  animation-delay: 0s;
}

.zzz-2 {
  font-size: 0.75rem;
  animation-delay: 0.3s;
}

.zzz-3 {
  font-size: 0.625rem;
  animation-delay: 0.6s;
}

@keyframes sleepFloat {
  0%, 100% {
    transform: translate(-20px, -20px) translateY(0);
  }
  50% {
    transform: translate(-20px, -20px) translateY(-5px);
  }
}

@keyframes zzz-float {
  0% {
    opacity: 0;
    transform: translate(10px, 0);
  }
  50% {
    opacity: 1;
    transform: translate(15px, -20px);
  }
  100% {
    opacity: 0;
    transform: translate(20px, -40px);
  }
}
</style>