<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref(null)
let animationId = null

const generateNoise = (ctx, width, height) => {
  const imageData = ctx.createImageData(width, height)
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    const value = Math.random() * 255
    data[i] = value
    data[i + 1] = value
    data[i + 2] = value
    data[i + 3] = 15
  }

  ctx.putImageData(imageData, 0, 0)
}

const animate = () => {
  if (!canvas.value) return
  
  const ctx = canvas.value.getContext('2d')
  generateNoise(ctx, canvas.value.width, canvas.value.height)
  animationId = requestAnimationFrame(animate)
}

onMounted(() => {
  if (canvas.value) {
    canvas.value.width = 256
    canvas.value.height = 256
    animate()
  }
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<template>
  <canvas ref="canvas" class="grain-overlay" aria-hidden="true"></canvas>
</template>

<style lang="scss" scoped>
.grain-overlay {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.4;
  mix-blend-mode: overlay;
}
</style>
