<template>
  <div v-if="isActive" class="extreme-dark-mode">
    <canvas ref="canvasRef" class="flashlight-canvas"></canvas>
    <div class="dark-mode-hint">
      <span class="hint-text">Press CTRL+Z to exit Extreme Dark Mode</span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useExtremeDarkMode } from '@/composables/useExtremeDarkMode'

const { isActive } = useExtremeDarkMode()
const canvasRef = ref(null)
const mouseX = ref(window.innerWidth / 2)
const mouseY = ref(window.innerHeight / 2)
let animationFrameId = null

const handleMouseMove = (e) => {
  mouseX.value = e.clientX
  mouseY.value = e.clientY
}

const drawFlashlight = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  const width = canvas.width
  const height = canvas.height

  // Clear canvas
  ctx.clearRect(0, 0, width, height)

  // Create gradient for flashlight effect
  const gradient = ctx.createRadialGradient(
    mouseX.value,
    mouseY.value,
    0,
    mouseX.value,
    mouseY.value,
    200
  )

  // Transparent center (light area)
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
  gradient.addColorStop(0.3, 'rgba(0, 0, 0, 0.3)')
  gradient.addColorStop(0.6, 'rgba(0, 0, 0, 0.8)')
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.98)')

  // Fill entire canvas with darkness and the light gradient
  ctx.fillStyle = 'rgba(0, 0, 0, 0.98)'
  ctx.fillRect(0, 0, width, height)

  // Create the light circle
  ctx.globalCompositeOperation = 'destination-out'
  ctx.beginPath()
  ctx.arc(mouseX.value, mouseY.value, 150, 0, Math.PI * 2)
  ctx.fillStyle = gradient
  ctx.fill()

  // Smaller bright center
  ctx.beginPath()
  ctx.arc(mouseX.value, mouseY.value, 80, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
  ctx.fill()

  ctx.globalCompositeOperation = 'source-over'

  animationFrameId = requestAnimationFrame(drawFlashlight)
}

const resizeCanvas = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

watch(isActive, (newValue) => {
  if (newValue) {
    setTimeout(() => {
      resizeCanvas()
      drawFlashlight()
    }, 10)
  } else {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }
  }
})

onMounted(() => {
  window.addEventListener('resize', resizeCanvas)
  document.addEventListener('mousemove', handleMouseMove)

  if (isActive.value) {
    resizeCanvas()
    drawFlashlight()
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas)
  document.removeEventListener('mousemove', handleMouseMove)
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<style lang="scss" scoped>
.extreme-dark-mode {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  pointer-events: none;
  animation: fadeIn 0.5s ease;
}

.flashlight-canvas {
  width: 100%;
  height: 100%;
}

.dark-mode-hint {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
  animation: pulse 2s ease infinite;
}

.hint-text {
  padding: 0.75rem 1.5rem;
  background: rgba(201, 162, 39, 0.2);
  border: 1px solid var(--terminal-accent);
  color: var(--terminal-accent);
  font-family: var(--font-mono);
  font-size: 0.875rem;
  border-radius: 4px;
  backdrop-filter: blur(10px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}
</style>
