<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const cursorX = ref(0)
const cursorY = ref(0)
const cursorDotX = ref(0)
const cursorDotY = ref(0)
const isHovering = ref(false)
const isClicking = ref(false)
const isVisible = ref(false)
const isMobile = ref(true)

let rafId = null

const updateCursor = (e) => {
  cursorX.value = e.clientX
  cursorY.value = e.clientY
}

const animateDot = () => {
  cursorDotX.value += (cursorX.value - cursorDotX.value) * 0.15
  cursorDotY.value += (cursorY.value - cursorDotY.value) * 0.15
  rafId = requestAnimationFrame(animateDot)
}

const handleMouseEnter = () => {
  isVisible.value = true
}

const handleMouseLeave = () => {
  isVisible.value = false
}

const handleMouseDown = () => {
  isClicking.value = true
}

const handleMouseUp = () => {
  isClicking.value = false
}

const checkHoverable = (e) => {
  const target = e.target
  const isHoverable = target.closest('a, button, [data-cursor-hover], input, textarea, select')
  isHovering.value = !!isHoverable
}

onMounted(() => {
  isMobile.value = window.matchMedia('(max-width: 768px)').matches ||
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0

  if (!isMobile.value) {
    document.addEventListener('mousemove', updateCursor)
    document.addEventListener('mousemove', checkHoverable)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    animateDot()
  }
})

onUnmounted(() => {
  if (!isMobile.value) {
    document.removeEventListener('mousemove', updateCursor)
    document.removeEventListener('mousemove', checkHoverable)
    document.removeEventListener('mouseenter', handleMouseEnter)
    document.removeEventListener('mouseleave', handleMouseLeave)
    document.removeEventListener('mousedown', handleMouseDown)
    document.removeEventListener('mouseup', handleMouseUp)
    if (rafId) cancelAnimationFrame(rafId)
  }
})
</script>

<template>
  <div v-if="!isMobile" class="custom-cursor" :class="{ visible: isVisible }">
    <div
      class="cursor-ring"
      :class="{ hovering: isHovering, clicking: isClicking }"
      :style="{ transform: `translate(${cursorDotX}px, ${cursorDotY}px)` }"
    ></div>
    <div
      class="cursor-dot"
      :class="{ hovering: isHovering, clicking: isClicking }"
      :style="{ transform: `translate(${cursorX}px, ${cursorY}px)` }"
    ></div>
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
</style>
