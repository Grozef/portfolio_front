<template>
  <div class="dino-game-page">
    <div class="game-header">
      <button class="back-btn" @click="goBack" data-cursor-hover>
        <span>&larr;</span> Back
      </button>
      <div class="game-title">
        <h1> Easter Egg Unlocked!</h1>
        <p>You found the secret 'we don't know what the fudge this thing is XD ' game!</p>
      </div>
      <div class="high-score">
        HI: {{ String(highScore).padStart(5, '0') }}
      </div>
    </div>

    <div ref="gameContainer" class="game-container">
      <canvas 
        ref="gameCanvas"
        @click="handleCanvasClick"
        @touchstart.prevent="handleJump"
      ></canvas>
      
      <div v-if="gameState === 'ready'" class="game-overlay">
        <div class="start-message">
          <h2>Press SPACE, Click or Tap to Start</h2>
          <p>Jump over the cacti to survive!</p>
        </div>
      </div>

      <div v-if="gameState === 'over'" class="game-overlay">
        <div class="game-over-message">
          <h2>GAME OVER</h2>
          <p class="final-score">Score: {{ score }}</p>
          <p v-if="score > highScore" class="new-record"> New High Score! </p>
          <button class="restart-btn" @click="restart" data-cursor-hover>
            Press SPACE, Click or Tap to Restart
          </button>
        </div>
      </div>

      <div class="score-display">
        {{ String(score).padStart(5, '0') }}
      </div>
    </div>

    <div class="game-instructions">
      <p><strong>Controls:</strong> Press SPACEBAR or ARROW UP to jump | Click/Tap anywhere to jump</p>
      <p class="easter-egg-note">Congratulations on discovering this easter egg !</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEasterEggs } from '@/composables/useEasterEggs'

const router = useRouter()
const { discoverEgg, isDiscovered, EASTER_EGGS } = useEasterEggs()

const gameCanvas = ref(null)
const gameContainer = ref(null)

const BASE_WIDTH = 800
const BASE_HEIGHT = 200
let canvasWidth = BASE_WIDTH
let canvasHeight = BASE_HEIGHT
let scale = 1

const gameState = ref('ready')
const score = ref(0)
const highScore = ref(parseInt(localStorage.getItem('dino_high_score') || '0'))

let ctx = null
let animationId = null
let gameSpeed = 5
let gravity = 0.6

const dino = ref({
  x: 50,
  y: 126,
  width: 62,
  height: 54,
  velocityY: 0,
  isJumping: false,
  jumpForce: -12,
  runFrame: 0
})

const obstacles = ref([])
let obstacleSpawnTimer = 0
const obstacleSpawnInterval = 120

const ground = {
  x: 0,
  y: 180,
  width: BASE_WIDTH,
  height: 20
}

const goBack = () => {
  router.push('/contact')
}

const resizeCanvas = () => {
  if (!gameCanvas.value || !gameContainer.value) return
  
  const container = gameContainer.value
  const containerWidth = container.clientWidth
  const containerHeight = container.clientHeight
  
  const scaleX = containerWidth / BASE_WIDTH
  const scaleY = containerHeight / BASE_HEIGHT
  scale = Math.min(scaleX, scaleY, 1)
  
  canvasWidth = BASE_WIDTH
  canvasHeight = BASE_HEIGHT
  
  gameCanvas.value.width = canvasWidth
  gameCanvas.value.height = canvasHeight
  gameCanvas.value.style.width = `${canvasWidth * scale}px`
  gameCanvas.value.style.height = `${canvasHeight * scale}px`
  
  if (gameState.value === 'ready') {
    draw()
  }
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
  dino.value.y = 126
  dino.value.velocityY = 0
  dino.value.isJumping = false
  dino.value.runFrame = 0
  
  discoverEgg(EASTER_EGGS.FOUND_404)
  
  gameLoop()
}

const restart = () => {
  startGame()
}

const spawnObstacle = () => {
  const types = [
    { width: 17, height: 35, type: 'small' },
    { width: 25, height: 50, type: 'large' },
    { width: 50, height: 35, type: 'double' }
  ]
  
  const type = types[Math.floor(Math.random() * types.length)]
  
  obstacles.value.push({
    x: canvasWidth,
    y: ground.y - type.height,
    width: type.width,
    height: type.height,
    type: type.type
  })
}

const updateGame = () => {
  if (gameState.value !== 'playing') return

  dino.value.velocityY += gravity
  dino.value.y += dino.value.velocityY

  if (dino.value.y >= 126) {
    dino.value.y = 126
    dino.value.velocityY = 0
    dino.value.isJumping = false
  }

  dino.value.runFrame++

  obstacles.value.forEach(obstacle => {
    obstacle.x -= gameSpeed
  })

  obstacles.value = obstacles.value.filter(obstacle => obstacle.x + obstacle.width > 0)

  obstacleSpawnTimer++
  if (obstacleSpawnTimer >= obstacleSpawnInterval) {
    spawnObstacle()
    obstacleSpawnTimer = 0
  }

  for (let obstacle of obstacles.value) {
    if (checkCollision(dino.value, obstacle)) {
      gameOver()
      return
    }
  }

  score.value++
  
  if (score.value === 1000 && !isDiscovered(EASTER_EGGS.DINO_GAME)) {
    discoverEgg(EASTER_EGGS.DINO_GAME)
  }
  
  if (score.value % 500 === 0) {
    gameSpeed += 0.5
  }
}

const checkCollision = (dino, obstacle) => {
  const dinoHitbox = {
    x: dino.x + 8,
    y: dino.y + 8,
    width: dino.width - 16,
    height: dino.height - 12
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
  
  const d = dino.value
  const isDead = gameState.value === 'over'
  const legCycle = Math.floor(d.runFrame / 6) % 2
  
  ctx.save()
  ctx.fillStyle = '#535353'
  
  // Corps principal (rectangulaire)
  ctx.fillRect(d.x + 16, d.y + 24, 26, 18)
  
  // Ventre arrondi
  ctx.fillRect(d.x + 14, d.y + 28, 2, 10)
  ctx.fillRect(d.x + 16, d.y + 26, 2, 2)
  
  // Tête rectangulaire T-Rex
  ctx.fillRect(d.x + 38, d.y + 6, 20, 16)
  
  // Cou qui relie tête et corps
  ctx.fillRect(d.x + 34, d.y + 18, 8, 10)
  
  // Museau/bouche
  ctx.fillRect(d.x + 58, d.y + 14, 4, 6)
  
  // Œil
  if (isDead) {
    ctx.fillStyle = '#fff'
    ctx.fillRect(d.x + 48, d.y + 10, 4, 4)
    ctx.fillStyle = '#535353'
    // Croix pour mort
    ctx.fillRect(d.x + 48, d.y + 11, 4, 1)
    ctx.fillRect(d.x + 49, d.y + 10, 1, 4)
  } else {
    ctx.fillStyle = '#fff'
    ctx.fillRect(d.x + 48, d.y + 10, 4, 4)
    ctx.fillStyle = '#535353'
    ctx.fillRect(d.x + 49, d.y + 11, 2, 2)
  }
  
  // Petits bras T-Rex (très courts!)
  ctx.fillStyle = '#535353'
  ctx.fillRect(d.x + 30, d.y + 26, 4, 6)
  ctx.fillRect(d.x + 30, d.y + 32, 3, 2)
  
  // Queue horizontale longue
  ctx.fillRect(d.x, d.y + 26, 16, 8)
  ctx.fillRect(d.x - 4, d.y + 28, 4, 4)
  
  // Jambes puissantes avec animation
  if (!d.isJumping && !isDead) {
    if (legCycle === 0) {
      // Jambe gauche levée
      ctx.fillRect(d.x + 20, d.y + 42, 6, 8)
      ctx.fillRect(d.x + 20, d.y + 49, 8, 3)
      
      // Jambe droite au sol
      ctx.fillRect(d.x + 32, d.y + 42, 6, 10)
      ctx.fillRect(d.x + 32, d.y + 51, 8, 3)
    } else {
      // Jambe gauche au sol
      ctx.fillRect(d.x + 20, d.y + 42, 6, 10)
      ctx.fillRect(d.x + 20, d.y + 51, 8, 3)
      
      // Jambe droite levée
      ctx.fillRect(d.x + 32, d.y + 42, 6, 8)
      ctx.fillRect(d.x + 32, d.y + 49, 8, 3)
    }
  } else {
    // Jambes statiques
    ctx.fillRect(d.x + 20, d.y + 42, 6, 10)
    ctx.fillRect(d.x + 20, d.y + 51, 8, 3)
    ctx.fillRect(d.x + 32, d.y + 42, 6, 10)
    ctx.fillRect(d.x + 32, d.y + 51, 8, 3)
  }
  
  ctx.restore()
}

const drawObstacles = () => {
  if (!ctx) return
  
  ctx.fillStyle = '#535353'
  obstacles.value.forEach(obstacle => {
    if (obstacle.type === 'small') {
      // Small cactus
      ctx.fillRect(obstacle.x + 5, obstacle.y, 7, obstacle.height)
      ctx.fillRect(obstacle.x, obstacle.y + 10, 4, 12)
      ctx.fillRect(obstacle.x + 13, obstacle.y + 15, 4, 10)
    } else if (obstacle.type === 'large') {
      // Large cactus
      ctx.fillRect(obstacle.x + 8, obstacle.y, 9, obstacle.height)
      ctx.fillRect(obstacle.x, obstacle.y + 15, 6, 18)
      ctx.fillRect(obstacle.x + 19, obstacle.y + 20, 6, 15)
    } else if (obstacle.type === 'double') {
      // Double small cactus
      ctx.fillRect(obstacle.x + 5, obstacle.y, 7, obstacle.height)
      ctx.fillRect(obstacle.x, obstacle.y + 10, 4, 12)
      ctx.fillRect(obstacle.x + 13, obstacle.y + 15, 4, 10)
      
      ctx.fillRect(obstacle.x + 30, obstacle.y, 7, obstacle.height)
      ctx.fillRect(obstacle.x + 25, obstacle.y + 10, 4, 12)
      ctx.fillRect(obstacle.x + 38, obstacle.y + 15, 4, 10)
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
  
  const pattern = Math.floor(score.value / 5) % 40
  for (let i = -pattern; i < canvasWidth; i += 40) {
    ctx.fillStyle = '#535353'
    ctx.fillRect(i, ground.y + 2, 10, 2)
  }
}

const drawClouds = () => {
  if (!ctx) return
  
  const cloudX = (score.value * 0.5) % (canvasWidth + 100)
  
  ctx.fillStyle = '#c4c4c4'
  ctx.beginPath()
  ctx.arc(canvasWidth - cloudX, 40, 15, 0, Math.PI * 2)
  ctx.arc(canvasWidth - cloudX + 20, 40, 20, 0, Math.PI * 2)
  ctx.arc(canvasWidth - cloudX + 40, 40, 15, 0, Math.PI * 2)
  ctx.fill()
  
  const cloudX2 = (score.value * 0.3) % (canvasWidth + 100)
  ctx.beginPath()
  ctx.arc(canvasWidth - cloudX2 - 200, 70, 12, 0, Math.PI * 2)
  ctx.arc(canvasWidth - cloudX2 - 185, 70, 15, 0, Math.PI * 2)
  ctx.arc(canvasWidth - cloudX2 - 170, 70, 12, 0, Math.PI * 2)
  ctx.fill()
}

const draw = () => {
  if (!ctx) return
  
  ctx.fillStyle = '#f7f7f7'
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)
  
  drawClouds()
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
    resizeCanvas()
    draw()
  }
  
  window.addEventListener('resize', resizeCanvas)
  document.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas)
  document.removeEventListener('keydown', handleKeyPress)
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<style src="@/assets/styles/pagesScss/dino.scss" lang="scss" scoped>

</style>