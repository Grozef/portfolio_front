<template>
  <Transition name="konami-fade">
    <div v-if="show" class="konami-animation">
      <div class="konami-overlay"></div>
      
      <!-- Matrix rain effect -->
      <canvas ref="canvas" class="konami-canvas"></canvas>
      
      <!-- Success message -->
      <div class="konami-message">
        <div class="konami-title">KONAMI CODE ACTIVATED!</div>
        <div class="konami-subtitle">You found the secret!</div>
        <div class="konami-ascii">
          ⬆⬆⬇⬇⬅➡⬅➡🅱🅰
        </div>
      </div>
      
      <!-- Particles -->
      <div class="konami-particles">
        <div 
          v-for="i in 50" 
          :key="i" 
          class="particle"
          :style="getParticleStyle(i)"
        ></div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  show: Boolean
})

const canvas = ref(null)
let animationFrame = null

// Matrix effect
const startMatrixEffect = () => {
  if (!canvas.value) return
  
  const ctx = canvas.value.getContext('2d')
  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight
  
  const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ'
  const fontSize = 14
  const columns = canvas.value.width / fontSize
  const drops = Array(Math.floor(columns)).fill(1)
  
  const draw = () => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
    ctx.fillRect(0, 0, canvas.value.width, canvas.value.height)
    
    ctx.fillStyle = '#0f0'
    ctx.font = fontSize + 'px monospace'
    
    for (let i = 0; i < drops.length; i++) {
      const text = chars[Math.floor(Math.random() * chars.length)]
      ctx.fillText(text, i * fontSize, drops[i] * fontSize)
      
      if (drops[i] * fontSize > canvas.value.height && Math.random() > 0.975) {
        drops[i] = 0
      }
      drops[i]++
    }
    
    animationFrame = requestAnimationFrame(draw)
  }
  
  draw()
}

const stopMatrixEffect = () => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
    animationFrame = null
  }
}

const getParticleStyle = (index) => {
  const angle = (index / 50) * Math.PI * 2
  const distance = 100 + Math.random() * 200
  const delay = Math.random() * 0.5
  
  return {
    '--x': Math.cos(angle) * distance + 'px',
    '--y': Math.sin(angle) * distance + 'px',
    '--delay': delay + 's',
    '--duration': (1 + Math.random()) + 's'
  }
}

watch(() => props.show, (newVal) => {
  if (newVal) {
    startMatrixEffect()
  } else {
    stopMatrixEffect()
  }
})

onMounted(() => {
  if (props.show) {
    startMatrixEffect()
  }
})
</script>

<style scoped lang="scss">
.konami-animation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  pointer-events: none;
  overflow: hidden;
}

.konami-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(0,255,0,0.1) 0%, rgba(0,0,0,0.8) 100%);
  animation: pulse 2s ease-in-out infinite;
}

.konami-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.5;
}

.konami-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  animation: slideIn 0.5s ease-out;
}

.konami-title {
  font-size: 3rem;
  font-weight: bold;
  color: #0f0;
  text-shadow: 
    0 0 10px #0f0,
    0 0 20px #0f0,
    0 0 30px #0f0,
    0 0 40px #0f0;
  margin-bottom: 1rem;
  animation: glow 1.5s ease-in-out infinite alternate;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
}

.konami-subtitle {
  font-size: 1.5rem;
  color: #00ff00;
  margin-bottom: 1rem;
  animation: fadeInUp 0.7s ease-out 0.3s both;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
}

.konami-ascii {
  font-size: 2rem;
  color: #0f0;
  letter-spacing: 0.5rem;
  animation: fadeInUp 0.7s ease-out 0.5s both;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
}

.konami-particles {
  position: absolute;
  top: 50%;
  left: 50%;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #0f0;
  border-radius: 50%;
  box-shadow: 0 0 10px #0f0;
  animation: particle-burst var(--duration) ease-out var(--delay) both;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

@keyframes glow {
  from {
    text-shadow: 
      0 0 10px #0f0,
      0 0 20px #0f0,
      0 0 30px #0f0,
      0 0 40px #0f0;
  }
  to {
    text-shadow: 
      0 0 20px #0f0,
      0 0 30px #0f0,
      0 0 40px #0f0,
      0 0 50px #0f0,
      0 0 60px #0f0;
  }
}

@keyframes slideIn {
  from {
    transform: translate(-50%, -60%);
    opacity: 0;
  }
  to {
    transform: translate(-50%, -50%);
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes particle-burst {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(var(--x), var(--y)) scale(0);
    opacity: 0;
  }
}

.konami-fade-enter-active,
.konami-fade-leave-active {
  transition: opacity 0.5s ease;
}

.konami-fade-enter-from,
.konami-fade-leave-to {
  opacity: 0;
}
</style>