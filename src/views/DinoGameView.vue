<template>
  <div class="dino-game-page">
    <div class="game-header">
      <button class="back-btn" @click="goBack" data-cursor-hover>
        <span>&larr;</span> Back
      </button>
      <div class="game-title">
        <h1>🦕 Easter Egg Unlocked!</h1>
        <p>You found the secret dinosaur game!</p>
      </div>
      <div class="high-score">
        HI: {{ String(highScore).padStart(5, '0') }}
      </div>
    </div>

    <div ref="gameContainer" class="game-container">
      <canvas 
        ref="gameCanvas" 
        :width="canvasWidth" 
        :height="canvasHeight"
        @click="handleCanvasClick"
      ></canvas>
      
      <div v-if="gameState === 'ready'" class="game-overlay">
        <div class="start-message">
          <h2>Press SPACE or Click to Start</h2>
          <p>Jump over the cacti to survive!</p>
        </div>
      </div>

      <div v-if="gameState === 'over'" class="game-overlay">
        <div class="game-over-message">
          <h2>GAME OVER</h2>
          <p class="final-score">Score: {{ score }}</p>
          <p v-if="score > highScore" class="new-record">🎉 New High Score! 🎉</p>
          <button class="restart-btn" @click="restart" data-cursor-hover>
            Press SPACE or Click to Restart
          </button>
        </div>
      </div>

      <div class="score-display">
        {{ String(score).padStart(5, '0') }}
      </div>
    </div>

    <div class="game-instructions">
      <p><strong>Controls:</strong> Press SPACEBAR or ARROW UP to jump | Click anywhere to jump</p>
      <p class="easter-egg-note">Congratulations on discovering this easter egg through the BSOD sequence!</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useEasterEggs } from '@/composables/useEasterEggs'

const router = useRouter()
const { discoverEgg, isDiscovered, EASTER_EGGS } = useEasterEggs()

const gameCanvas = ref(null)
const gameContainer = ref(null)
const canvasWidth = 800
const canvasHeight = 200

const gameState = ref('ready') // 'ready', 'playing', 'over'
const score = ref(0)
const highScore = ref(parseInt(localStorage.getItem('dino_high_score') || '0'))

let ctx = null
let animationId = null
let gameSpeed = 5
let gravity = 0.6

// Dino properties
const dino = ref({
  x: 50,
  y: 150,
  width: 40,
  height: 40,
  velocityY: 0,
  isJumping: false,
  jumpForce: -12
})

// Obstacles
const obstacles = ref([])
let obstacleSpawnTimer = 0
const obstacleSpawnInterval = 120 // frames

// Ground
const ground = {
  x: 0,
  y: 180,
  width: canvasWidth,
  height: 20
}

const goBack = () => {
  router.push('/contact')
}

const handleJump = () => {
  if (gameState.value === 'ready') {
    startGame()
  } else if (gameState.value === 'playing' && !dino.value.isJumping) {
    dino.value.velocityY = dino.value.jumpForce
    dino.value.isJumping = true
  } else if (gameState.value === 'over') {
    restart()
  }
}

const handleKeyPress = (e) => {
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    e.preventDefault()
    handleJump()
  }
}

const handleCanvasClick = () => {
  handleJump()
}

const startGame = () => {
  gameState.value = 'playing'
  score.value = 0
  obstacles.value = []
  obstacleSpawnTimer = 0
  gameSpeed = 5
  dino.value.y = 150
  dino.value.velocityY = 0
  dino.value.isJumping = false
  
  // Discover easter egg
  discoverEgg(EASTER_EGGS.FOUND_404)
  
  gameLoop()
}

const restart = () => {
  startGame()
}

const spawnObstacle = () => {
  const types = [
    { width: 20, height: 40 }, // Small cactus
    { width: 40, height: 40 }, // Large cactus
    { width: 60, height: 40 }  // Multiple cacti
  ]
  
  const type = types[Math.floor(Math.random() * types.length)]
  
  obstacles.value.push({
    x: canvasWidth,
    y: ground.y - type.height,
    width: type.width,
    height: type.height
  })
}

const updateGame = () => {
  if (gameState.value !== 'playing') return

  // Update dino
  dino.value.velocityY += gravity
  dino.value.y += dino.value.velocityY

  // Ground collision
  if (dino.value.y >= 150) {
    dino.value.y = 150
    dino.value.velocityY = 0
    dino.value.isJumping = false
  }

  // Update obstacles
  obstacles.value.forEach(obstacle => {
    obstacle.x -= gameSpeed
  })

  // Remove off-screen obstacles
  obstacles.value = obstacles.value.filter(obstacle => obstacle.x + obstacle.width > 0)

  // Spawn new obstacles
  obstacleSpawnTimer++
  if (obstacleSpawnTimer >= obstacleSpawnInterval) {
    spawnObstacle()
    obstacleSpawnTimer = 0
  }

  // Check collisions
  for (let obstacle of obstacles.value) {
    if (checkCollision(dino.value, obstacle)) {
      gameOver()
      return
    }
  }

  // Update score
  score.value++
  
  // Unlock DINO_GAME easter egg at 1000 points
  if (score.value === 1000 && !isDiscovered(EASTER_EGGS.DINO_GAME)) {
    discoverEgg(EASTER_EGGS.DINO_GAME)
  }
  
  // Increase difficulty
  if (score.value % 500 === 0) {
    gameSpeed += 0.5
  }
}

const checkCollision = (dino, obstacle) => {
  // Reduce hitbox for better gameplay
  const dinoHitbox = {
    x: dino.x + 5,
    y: dino.y + 5,
    width: dino.width - 10,
    height: dino.height - 10
  }

  return (
    dinoHitbox.x < obstacle.x + obstacle.width &&
    dinoHitbox.x + dinoHitbox.width > obstacle.x &&
    dinoHitbox.y < obstacle.y + obstacle.height &&
    dinoHitbox.y + dinoHitbox.height > obstacle.y
  )
}

const gameOver = () => {
  gameState.value = 'over'
  
  if (score.value > highScore.value) {
    highScore.value = score.value
    localStorage.setItem('dino_high_score', score.value.toString())
  }
  
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
}

const drawDino = () => {
  if (!ctx) return
  
  // Draw dino as a simple rectangle with legs
  ctx.fillStyle = '#535353'
  
  // Body
  ctx.fillRect(dino.value.x, dino.value.y, dino.value.width, dino.value.height - 10)
  
  // Head
  ctx.fillRect(dino.value.x + 25, dino.value.y - 10, 15, 15)
  
  // Eye
  ctx.fillStyle = '#fff'
  ctx.fillRect(dino.value.x + 32, dino.value.y - 5, 3, 3)
  
  // Legs (animated)
  ctx.fillStyle = '#535353'
  const legAnimation = Math.floor(score.value / 10) % 2
  if (!dino.value.isJumping) {
    if (legAnimation === 0) {
      ctx.fillRect(dino.value.x + 5, dino.value.y + 30, 8, 10)
      ctx.fillRect(dino.value.x + 25, dino.value.y + 30, 8, 10)
    } else {
      ctx.fillRect(dino.value.x + 10, dino.value.y + 30, 8, 10)
      ctx.fillRect(dino.value.x + 20, dino.value.y + 30, 8, 10)
    }
  } else {
    ctx.fillRect(dino.value.x + 10, dino.value.y + 30, 8, 10)
    ctx.fillRect(dino.value.x + 20, dino.value.y + 30, 8, 10)
  }
}

const drawObstacles = () => {
  if (!ctx) return
  
  ctx.fillStyle = '#535353'
  obstacles.value.forEach(obstacle => {
    // Draw cactus-like obstacles
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
    
    // Add some details to make it look like a cactus
    if (obstacle.width > 20) {
      ctx.fillRect(obstacle.x + 5, obstacle.y + 10, 4, 8)
      ctx.fillRect(obstacle.x + obstacle.width - 9, obstacle.y + 10, 4, 8)
    }
  })
}

const drawGround = () => {
  if (!ctx) return
  
  ctx.strokeStyle = '#535353'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(0, ground.y)
  ctx.lineTo(canvasWidth, ground.y)
  ctx.stroke()
  
  // Animated ground pattern
  const pattern = Math.floor(score.value / 5) % 40
  for (let i = -pattern; i < canvasWidth; i += 40) {
    ctx.fillStyle = '#535353'
    ctx.fillRect(i, ground.y + 2, 10, 2)
  }
}

const draw = () => {
  if (!ctx) return
  
  // Clear canvas
  ctx.fillStyle = '#f7f7f7'
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)
  
  // Draw game elements
  drawGround()
  drawDino()
  drawObstacles()
}

const gameLoop = () => {
  updateGame()
  draw()
  
  if (gameState.value === 'playing') {
    animationId = requestAnimationFrame(gameLoop)
  }
}

onMounted(() => {
  if (gameCanvas.value) {
    ctx = gameCanvas.value.getContext('2d')
    draw() // Initial draw
  }
  
  document.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyPress)
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<style lang="scss" scoped>
.dino-game-page {
  min-height: 100vh;
  background: var(--terminal-bg);
  display: flex;
  flex-direction: column;
  padding: 2rem;

  @media (max-width: 900px) {
    padding: 1rem;
  }
}

.game-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
}

.back-btn {
  background: transparent;
  border: 1px solid var(--terminal-border);
  color: var(--terminal-text);
  padding: 0.75rem 1.5rem;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    border-color: var(--terminal-accent);
    color: var(--terminal-accent);
  }
}

.game-title {
  flex: 1;
  text-align: center;

  h1 {
    font-family: var(--font-display);
    font-size: 2rem;
    color: var(--terminal-accent);
    margin-bottom: 0.5rem;

    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }

  p {
    font-family: var(--font-mono);
    color: var(--terminal-text-dim);
    font-size: 0.9rem;
  }
}

.high-score {
  font-family: var(--font-mono);
  font-size: 1.2rem;
  color: var(--terminal-text);
  font-weight: 600;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
}

.game-container {
  position: relative;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  background: #f7f7f7;
  border: 2px solid var(--terminal-border);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

canvas {
  display: block;
  cursor: pointer;
  width: 100%;
  height: auto;
}

.game-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.start-message,
.game-over-message {
  text-align: center;
  color: white;
  padding: 2rem;

  h2 {
    font-family: var(--font-display);
    font-size: 2.5rem;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  p {
    font-family: var(--font-mono);
    font-size: 1.2rem;
    margin-bottom: 0.5rem;

    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }

  .final-score {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--terminal-accent);

    @media (max-width: 768px) {
      font-size: 1.2rem;
    }
  }

  .new-record {
    color: #ffd700;
    font-size: 1.3rem;
    animation: pulse 1s ease infinite;

    @media (max-width: 768px) {
      font-size: 1.1rem;
    }
  }
}

.restart-btn {
  margin-top: 1.5rem;
  background: var(--terminal-accent);
  border: none;
  color: var(--terminal-bg);
  padding: 1rem 2rem;
  font-family: var(--font-mono);
  font-size: 1rem;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.9;
    transform: scale(1.05);
  }
}

.score-display {
  position: absolute;
  top: 20px;
  right: 20px;
  font-family: var(--font-mono);
  font-size: 1.5rem;
  color: #535353;
  font-weight: 600;
  z-index: 5;
}

.game-instructions {
  max-width: 800px;
  margin: 2rem auto 0;
  text-align: center;

  p {
    font-family: var(--font-mono);
    color: var(--terminal-text-dim);
    font-size: 0.9rem;
    margin-bottom: 0.5rem;

    strong {
      color: var(--terminal-text);
    }
  }

  .easter-egg-note {
    color: var(--terminal-accent);
    font-size: 0.85rem;
    margin-top: 1rem;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
</style>