<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="master-egg-overlay" @click="close">
        <canvas ref="confettiCanvas" class="confetti-canvas"></canvas>
        <div class="master-egg-content" @click.stop>
          <div class="achievement-badge">
            <div class="badge-icon">🏆</div>
            <h2 class="achievement-title">ACHIEVEMENT UNLOCKED!</h2>
            <h3 class="achievement-name">Master Easter Egg Hunter</h3>
            <p class="achievement-desc">
              You've discovered all {{ totalEggs }} easter eggs hidden throughout this portfolio!
            </p>
            <div class="egg-list">
              <div class="egg-item" v-for="egg in discoveredEggs" :key="egg">
                <span class="egg-icon">🥚</span>
                <span class="egg-name">{{ formatEggName(egg) }}</span>
              </div>
            </div>
            <div class="secret-content">
              <h4 class="secret-title">🎁 Your Reward</h4>
              <p class="secret-text">
                Congratulations! You've proven yourself to be a true explorer. 
                As a reward, you've unlocked the secret developer mode. 
                Check the console for special access codes! 🚀
              </p>
            </div>
            <button class="close-btn" @click="close" data-cursor-hover>
              Awesome!
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  discoveredEggs: {
    type: Array,
    default: () => []
  },
  totalEggs: {
    type: Number,
    default: 9
  }
})

const emit = defineEmits(['close'])

const confettiCanvas = ref(null)
let animationFrameId = null
const confettiPieces = ref([])

class ConfettiPiece {
  constructor(canvas) {
    this.canvas = canvas
    this.x = Math.random() * canvas.width
    this.y = -10
    this.size = Math.random() * 8 + 5
    this.speed = Math.random() * 3 + 2
    this.rotation = Math.random() * 360
    this.rotationSpeed = Math.random() * 10 - 5
    this.color = this.randomColor()
    this.swing = Math.random() * 2 - 1
  }

  randomColor() {
    const colors = [
      '#c9a227', // terminal-accent
      '#4a9eff', // terminal-accent-secondary
      '#27ca40', // success
      '#ff6b6b', // error
      '#a78bfa'  // purple
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  update() {
    this.y += this.speed
    this.x += this.swing
    this.rotation += this.rotationSpeed

    if (this.y > this.canvas.height + 10) {
      this.y = -10
      this.x = Math.random() * this.canvas.width
    }
  }

  draw(ctx) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate((this.rotation * Math.PI) / 180)
    ctx.fillStyle = this.color
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size)
    ctx.restore()
  }
}

const initConfetti = () => {
  const canvas = confettiCanvas.value
  if (!canvas) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  confettiPieces.value = []
  for (let i = 0; i < 150; i++) {
    confettiPieces.value.push(new ConfettiPiece(canvas))
  }

  animateConfetti()
}

const animateConfetti = () => {
  const canvas = confettiCanvas.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  confettiPieces.value.forEach(piece => {
    piece.update()
    piece.draw(ctx)
  })

  animationFrameId = requestAnimationFrame(animateConfetti)
}

const formatEggName = (eggId) => {
  return eggId.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

const close = () => {
  emit('close')
}

const handleResize = () => {
  if (confettiCanvas.value && props.show) {
    confettiCanvas.value.width = window.innerWidth
    confettiCanvas.value.height = window.innerHeight
  }
}

watch(() => props.show, (newVal) => {
  if (newVal) {
    setTimeout(initConfetti, 100)
    // Log secret code to console
    console.log('%c🎉 MASTER EASTER EGG UNLOCKED! 🎉', 'font-size: 20px; color: #c9a227; font-weight: bold;')
    console.log('%cSecret Developer Code: DEV_MODE_2024', 'font-size: 14px; color: #4a9eff;')
    console.log('%cYou have proven yourself worthy, master explorer!', 'font-size: 12px; color: #27ca40;')
  } else {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }
  }
})

onMounted(() => {
  window.addEventListener('resize', handleResize)
  if (props.show) {
    initConfetti()
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<style lang="scss" scoped>

* {
  cursor: default !important;
}

.master-egg-overlay {
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
}

.confetti-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.master-egg-content {
  position: relative;
  z-index: 10001;
  cursor: default;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.achievement-badge {
  background: var(--terminal-bg-secondary);
  border: 2px solid var(--terminal-accent);
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 0 0 50px rgba(201, 162, 39, 0.3);
  animation: badgeAppear 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.badge-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
  animation: iconBounce 1s ease infinite;
}

.achievement-title {
  font-family: var(--font-mono);
  font-size: 1rem;
  letter-spacing: 0.2em;
  color: var(--terminal-accent);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
}

.achievement-name {
  font-family: var(--font-display);
  font-size: 2rem;
  color: var(--terminal-text);
  margin-bottom: 1rem;
}

.achievement-desc {
  font-family: var(--font-serif);
  font-size: 1.125rem;
  color: var(--terminal-text-dim);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.egg-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--terminal-bg);
  border-radius: 8px;
}

.egg-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--terminal-text);
  padding: 0.5rem;
  background: var(--terminal-bg-secondary);
  border: 1px solid var(--terminal-border);
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--terminal-accent);
    transform: translateY(-2px);
  }
}

.egg-icon {
  font-size: 1.2rem;
}

.egg-name {
  font-size: 0.75rem;
}

.secret-content {
  background: rgba(201, 162, 39, 0.1);
  border: 1px solid var(--terminal-accent);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.secret-title {
  font-family: var(--font-mono);
  font-size: 1rem;
  color: var(--terminal-accent);
  margin-bottom: 0.75rem;
}

.secret-text {
  font-family: var(--font-serif);
  font-size: 0.875rem;
  color: var(--terminal-text);
  line-height: 1.6;
  margin: 0;
}

.close-btn {
  font-family: var(--font-mono);
  font-size: 1rem;
  padding: 1rem 2rem;
  background: var(--terminal-accent);
  color: var(--terminal-bg);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: var(--terminal-text);
    transform: scale(1.05);
  }
}

@keyframes badgeAppear {
  0% {
    transform: scale(0.5) rotate(-10deg);
    opacity: 0;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes iconBounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .achievement-badge {
    padding: 2rem 1.5rem;
  }

  .badge-icon {
    font-size: 3rem;
  }

  .achievement-name {
    font-size: 1.5rem;
  }

  .achievement-desc {
    font-size: 1rem;
  }

  .egg-list {
    grid-template-columns: 1fr;
  }
}
</style>
