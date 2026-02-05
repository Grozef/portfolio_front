<template>
  <Teleport to="body">
    <Transition name="completion">
      <div v-if="show" class="completion-overlay" @click="handleClose">
        <canvas ref="confettiCanvas" class="confetti-canvas"></canvas>
        
        <div class="completion-content">
          <div class="trophy-icon">🏆</div>
          
          <h1 class="completion-title">
            FÉLICITATIONS !
          </h1>
          
          <p class="completion-subtitle">
            Tu as trouvé tous les {{ totalEggs }} easter eggs !
          </p>
          
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-label">Temps écoulé</span>
              <span class="stat-value">{{ timeTaken }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Easter Eggs</span>
              <span class="stat-value">{{ totalEggs }}/{{ totalEggs }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Taux de réussite</span>
              <span class="stat-value">100%</span>
            </div>
          </div>
          
          <div class="achievement-badge">
            <div class="badge-glow"></div>
            <div class="badge-content">
              <span class="badge-icon">🥚</span>
              <span class="badge-text">MASTER EGG HUNTER</span>
            </div>
          </div>
          
          <div class="secret-message">
            <p>Tu as débloqué un secret spécial :</p>
            <code class="secret-code">{{ secretCode }}</code>
            <p class="secret-hint">Garde ce code précieusement...</p>
          </div>
          
          <button @click="handleClose" class="close-button" data-cursor-hover>
            Continuer l'aventure
          </button>
          
          <p class="click-hint">Clique n'importe où pour fermer</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  totalEggs: {
    type: Number,
    default: 19
  },
  discoveryStartTime: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['close'])

const confettiCanvas = ref(null)
let confettiAnimationId = null
const confettiParticles = []

// Generate secret code
const secretCode = computed(() => {
  const timestamp = Date.now()
  return `EGG-${timestamp.toString(36).toUpperCase()}-MASTER`
})

// Calculate time taken
const timeTaken = computed(() => {
  if (!props.discoveryStartTime) return 'Unknown'
  
  const elapsed = Date.now() - props.discoveryStartTime
  const hours = Math.floor(elapsed / 3600000)
  const minutes = Math.floor((elapsed % 3600000) / 60000)
  const seconds = Math.floor((elapsed % 60000) / 1000)
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  } else {
    return `${seconds}s`
  }
})

// Confetti particle class
class Confetti {
  constructor(canvas) {
    this.canvas = canvas
    this.reset()
  }

  reset() {
    this.x = Math.random() * this.canvas.width
    this.y = -20
    this.size = Math.random() * 8 + 4
    this.speedY = Math.random() * 3 + 2
    this.speedX = (Math.random() - 0.5) * 2
    this.rotation = Math.random() * 360
    this.rotationSpeed = (Math.random() - 0.5) * 10
    this.color = this.getRandomColor()
    this.shape = Math.random() > 0.5 ? 'circle' : 'square'
  }

  getRandomColor() {
    const colors = ['#c9a227', '#4a9eff', '#27ca40', '#ff4444', '#a78bfa', '#ffa500']
    return colors[Math.floor(Math.random() * colors.length)]
  }

  update() {
    this.y += this.speedY
    this.x += this.speedX
    this.rotation += this.rotationSpeed

    if (this.y > this.canvas.height + 20) {
      this.reset()
    }
  }

  draw(ctx) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate((this.rotation * Math.PI) / 180)
    ctx.fillStyle = this.color

    if (this.shape === 'circle') {
      ctx.beginPath()
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2)
      ctx.fill()
    } else {
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size)
    }

    ctx.restore()
  }
}

// Initialize confetti
const initConfetti = () => {
  const canvas = confettiCanvas.value
  if (!canvas) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  // Create confetti particles
  for (let i = 0; i < 150; i++) {
    confettiParticles.push(new Confetti(canvas))
  }

  animateConfetti()
}

// Animate confetti
const animateConfetti = () => {
  const canvas = confettiCanvas.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  confettiParticles.forEach(particle => {
    particle.update()
    particle.draw(ctx)
  })

  confettiAnimationId = requestAnimationFrame(animateConfetti)
}

// Play celebration sound
const playCelebrationSound = () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  
  const notes = [523, 659, 784, 1047] // C, E, G, C
  notes.forEach((frequency, index) => {
    setTimeout(() => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.frequency.value = frequency
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.start()
      oscillator.stop(audioContext.currentTime + 0.5)
    }, index * 150)
  })
}

const handleClose = () => {
  emit('close')
}

const handleResize = () => {
  if (confettiCanvas.value) {
    confettiCanvas.value.width = window.innerWidth
    confettiCanvas.value.height = window.innerHeight
  }
}

watch(() => props.show, (newValue) => {
  if (newValue) {
    initConfetti()
    playCelebrationSound()
  } else {
    if (confettiAnimationId) {
      cancelAnimationFrame(confettiAnimationId)
    }
    confettiParticles.length = 0
  }
})

onMounted(() => {
  window.addEventListener('resize', handleResize)
  if (props.show) {
    initConfetti()
    playCelebrationSound()
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (confettiAnimationId) {
    cancelAnimationFrame(confettiAnimationId)
  }
})
</script>

<style lang="scss" scoped>
.completion-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.95);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: auto;
  padding: 2rem;
}

.confetti-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.completion-content {
  position: relative;
  max-width: 700px;
  width: 100%;
  text-align: center;
  cursor: default;
  animation: contentFadeIn 0.8s ease;
}

.trophy-icon {
  font-size: 6rem;
  margin-bottom: 1rem;
  animation: trophyFloat 3s ease-in-out infinite;
  
  @media (max-width: 768px) {
    font-size: 4rem;
  }
}

.completion-title {
  font-family: var(--font-display);
  font-size: 4rem;
  font-weight: 700;
  color: var(--terminal-accent);
  margin-bottom: 1rem;
  text-shadow: 0 0 20px rgba(201, 162, 39, 0.5);
  animation: titlePulse 2s ease-in-out infinite;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
}

.completion-subtitle {
  font-family: var(--font-mono);
  font-size: 1.5rem;
  color: var(--terminal-text);
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

.stat-item {
  padding: 1.5rem;
  background: var(--terminal-bg-secondary);
  border: 2px solid var(--terminal-border);
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--terminal-accent);
    transform: translateY(-5px);
  }
}

.stat-label {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--terminal-text-dim);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  display: block;
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 700;
  color: var(--terminal-accent);
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
}

.achievement-badge {
  position: relative;
  margin: 3rem auto;
  width: fit-content;
}

.badge-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(201, 162, 39, 0.3) 0%, transparent 70%);
  animation: glowPulse 2s ease-in-out infinite;
}

.badge-content {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 3rem;
  background: linear-gradient(135deg, var(--terminal-accent) 0%, #8b7520 100%);
  border-radius: 50px;
  box-shadow: 0 10px 40px rgba(201, 162, 39, 0.4);
}

.badge-icon {
  font-size: 2rem;
}

.badge-text {
  font-family: var(--font-mono);
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--terminal-bg);
  letter-spacing: 0.1em;
}

.secret-message {
  margin: 3rem 0;
  padding: 2rem;
  background: var(--terminal-bg-secondary);
  border: 2px solid var(--terminal-accent);
  border-radius: 12px;
  
  p {
    font-family: var(--font-mono);
    font-size: 0.95rem;
    color: var(--terminal-text);
    margin-bottom: 1rem;
  }
}

.secret-code {
  display: block;
  padding: 1rem 2rem;
  background: var(--terminal-bg);
  border: 1px solid var(--terminal-border);
  border-radius: 8px;
  font-family: var(--font-mono);
  font-size: 1.25rem;
  color: var(--terminal-accent);
  letter-spacing: 0.1em;
  margin: 1rem 0;
  user-select: all;
}

.secret-hint {
  font-size: 0.875rem !important;
  color: var(--terminal-text-dim) !important;
  font-style: italic;
}

.close-button {
  padding: 1rem 3rem;
  font-family: var(--font-mono);
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--terminal-bg);
  background: var(--terminal-accent);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
  
  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 10px 30px rgba(201, 162, 39, 0.5);
  }
}

.click-hint {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--terminal-text-dim);
  opacity: 0.7;
  animation: fadeInOut 2s ease-in-out infinite;
}

@keyframes contentFadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes trophyFloat {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(10deg);
  }
}

@keyframes titlePulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes glowPulse {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

@keyframes fadeInOut {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

.completion-enter-active {
  animation: overlayEnter 0.5s ease;
}

.completion-leave-active {
  animation: overlayLeave 0.5s ease;
}

@keyframes overlayEnter {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes overlayLeave {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
