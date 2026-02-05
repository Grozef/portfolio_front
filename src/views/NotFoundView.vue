<template>
  <div class="not-found-page">
    <div class="content-wrapper">
      <div class="error-header">
        <h1 class="error-code">404</h1>
        <p class="error-message">Page not found</p>
        <p class="error-subtitle">But you found a secret game instead!</p>
      </div>

      <div class="game-container">
        <div class="game-header">
          <div class="score-display">
            <span class="label">Score:</span>
            <span class="value">{{ score }}</span>
          </div>
          <div class="high-score-display">
            <span class="label">Best:</span>
            <span class="value">{{ highScore }}</span>
          </div>
        </div>

        <canvas
          ref="gameCanvas"
          class="game-canvas"
          :class="{ 'game-over': isGameOver }"
          @click="startGame"
        ></canvas>

        <div class="game-controls">
          <div v-if="!isPlaying && !isGameOver" class="start-message">
            <p>Click or press SPACE to start</p>
            <div class="control-hints">
              <div class="hint">
                <span class="key">↑ ↓ ← →</span>
                <span class="desc">Arrow keys to move</span>
              </div>
              <div class="hint">
                <span class="key">WASD</span>
                <span class="desc">Alternative controls</span>
              </div>
            </div>
          </div>

          <div v-if="isGameOver" class="game-over-message">
            <h3>Game Over!</h3>
            <p class="final-score">Final Score: {{ score }}</p>
            <button class="restart-btn" @click="startGame" data-cursor-hover>
              Play Again
            </button>
          </div>
        </div>

        <router-link to="/" class="home-btn" data-cursor-hover>
          <span class="btn-icon">←</span>
          <span>Return Home</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useEasterEggs } from '@/composables/useEasterEggs'

const { discoverEgg, EASTER_EGGS } = useEasterEggs()

const gameCanvas = ref(null)
const score = ref(0)
const highScore = ref(parseInt(localStorage.getItem('snake_high_score') || '0'))
const isPlaying = ref(false)
const isGameOver = ref(false)

// Game state
const gridSize = 20
const tileCount = 20
let snake = []
let food = { x: 15, y: 15 }
let dx = 0
let dy = 0
let gameLoop = null

// FIX: Initialize game properly
const initGame = () => {
  // FIX: Start with a 3-segment snake in the middle
  snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ]
  food = generateFood()
  // FIX: Start moving to the right
  dx = 1
  dy = 0
  score.value = 0
  isGameOver.value = false
}

const generateFood = () => {
  let newFood
  let isOnSnake

  do {
    newFood = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    }
    isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)
  } while (isOnSnake)

  return newFood
}

const startGame = () => {
  if (!isPlaying.value || isGameOver.value) {
    initGame()
    isPlaying.value = true
    if (gameLoop) clearInterval(gameLoop)
    gameLoop = setInterval(update, 100)
  }
}

const update = () => {
  if (!isPlaying.value) return

  // Move snake
  const head = { x: snake[0].x + dx, y: snake[0].y + dy }

  // Check collision with walls
  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    gameOver()
    return
  }

  // FIX: Check collision with self (skip the last segment as it will move)
  for (let i = 0; i < snake.length - 1; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      gameOver()
      return
    }
  }

  snake.unshift(head)

  // Check if food is eaten
  if (head.x === food.x && head.y === food.y) {
    score.value += 10
    food = generateFood()
    
    // Update high score
    if (score.value > highScore.value) {
      highScore.value = score.value
      localStorage.setItem('snake_high_score', highScore.value.toString())
    }
  } else {
    snake.pop()
  }

  draw()
}

const draw = () => {
  const canvas = gameCanvas.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')

  // Clear canvas
  ctx.fillStyle = '#0a0a0b'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Draw grid
  ctx.strokeStyle = '#1a1a1c'
  ctx.lineWidth = 1
  for (let i = 0; i <= tileCount; i++) {
    ctx.beginPath()
    ctx.moveTo(i * gridSize, 0)
    ctx.lineTo(i * gridSize, canvas.height)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, i * gridSize)
    ctx.lineTo(canvas.width, i * gridSize)
    ctx.stroke()
  }

  // Draw food
  ctx.fillStyle = '#c9a227'
  ctx.fillRect(food.x * gridSize + 2, food.y * gridSize + 2, gridSize - 4, gridSize - 4)

  // Draw snake
  snake.forEach((segment, index) => {
    if (index === 0) {
      // Head
      ctx.fillStyle = '#4a9eff'
    } else {
      // Body
      ctx.fillStyle = '#27ca40'
    }
    ctx.fillRect(segment.x * gridSize + 1, segment.y * gridSize + 1, gridSize - 2, gridSize - 2)
  })
}

const gameOver = () => {
  isPlaying.value = false
  isGameOver.value = true
  if (gameLoop) clearInterval(gameLoop)
}

const handleKeyDown = (event) => {
  if (!isPlaying.value && !isGameOver.value && event.key === ' ') {
    event.preventDefault()
    startGame()
    return
  }

  if (!isPlaying.value) return

  const key = event.key.toLowerCase()

  // FIX: Prevent reverse direction AND moving into yourself
  if ((key === 'arrowup' || key === 'w') && dy !== 1) {
    dx = 0
    dy = -1
  } else if ((key === 'arrowdown' || key === 's') && dy !== -1) {
    dx = 0
    dy = 1
  } else if ((key === 'arrowleft' || key === 'a') && dx !== 1) {
    dx = -1
    dy = 0
  } else if ((key === 'arrowright' || key === 'd') && dx !== -1) {
    dx = 1
    dy = 0
  }
}

onMounted(() => {
  const canvas = gameCanvas.value
  if (canvas) {
    canvas.width = gridSize * tileCount
    canvas.height = gridSize * tileCount
    // FIX: Initialize game state and draw
    initGame()
    draw()
  }

  // Discover easter egg on page load
  discoverEgg(EASTER_EGGS.FOUND_404)

  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  if (gameLoop) clearInterval(gameLoop)
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

<style lang="scss" scoped>
.not-found-page {
  min-height: 100vh;
  background: var(--terminal-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.content-wrapper {
  max-width: 600px;
  width: 100%;
}

.error-header {
  text-align: center;
  margin-bottom: 2rem;
}

.error-code {
  font-family: var(--font-display);
  font-size: 8rem;
  font-weight: 700;
  color: var(--terminal-accent);
  line-height: 1;
  margin: 0;
  text-shadow: 0 0 30px rgba(201, 162, 39, 0.3);

  @media (max-width: 768px) {
    font-size: 5rem;
  }
}

.error-message {
  font-family: var(--font-mono);
  font-size: 1.5rem;
  color: var(--terminal-text);
  margin: 1rem 0 0.5rem;
}

.error-subtitle {
  font-family: var(--font-serif);
  font-size: 1rem;
  color: var(--terminal-text-dim);
  margin: 0;
}

.game-container {
  background: var(--terminal-bg-secondary);
  border: 2px solid var(--terminal-border);
  border-radius: 12px;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
}

.game-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding: 0 1rem;
}

.score-display,
.high-score-display {
  font-family: var(--font-mono);
  font-size: 0.875rem;

  .label {
    color: var(--terminal-text-dim);
    margin-right: 0.5rem;
  }

  .value {
    color: var(--terminal-accent);
    font-weight: 600;
    font-size: 1.25rem;
  }
}

.game-canvas {
  display: block;
  margin: 0 auto;
  border: 2px solid var(--terminal-border);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--terminal-accent);
  }

  &.game-over {
    opacity: 0.5;
  }

  @media (max-width: 500px) {
    width: 100%;
    height: auto;
  }
}

.game-controls {
  margin-top: 1.5rem;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.start-message {
  text-align: center;

  p {
    font-family: var(--font-mono);
    font-size: 1rem;
    color: var(--terminal-text);
    margin-bottom: 1.5rem;
  }
}

.control-hints {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-family: var(--font-mono);
  font-size: 0.875rem;

  .key {
    padding: 0.25rem 0.75rem;
    background: var(--terminal-bg);
    border: 1px solid var(--terminal-border);
    border-radius: 4px;
    color: var(--terminal-accent);
    font-weight: 600;
  }

  .desc {
    color: var(--terminal-text-dim);
  }
}

.game-over-message {
  text-align: center;

  h3 {
    font-family: var(--font-display);
    font-size: 2rem;
    color: var(--terminal-text);
    margin-bottom: 0.5rem;
  }

  .final-score {
    font-family: var(--font-mono);
    font-size: 1.25rem;
    color: var(--terminal-accent);
    margin-bottom: 1.5rem;
  }
}

.restart-btn {
  font-family: var(--font-mono);
  font-size: 1rem;
  padding: 0.75rem 2rem;
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

.home-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--terminal-text-dim);
  padding: 0.75rem;
  border: 1px solid var(--terminal-border);
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    color: var(--terminal-accent);
    border-color: var(--terminal-accent);
  }
}
</style>
