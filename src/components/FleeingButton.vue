<template>
  <div class="fleeing-button-wrapper">
    <button
      ref="buttonRef"
      class="fleeing-button"
      :style="buttonStyle"
      @mouseenter="handleHover"
      @touchstart="handleTouch"
      @click="handleClick"
      data-cursor-hover
    >
      {{ buttonText }}
    </button>
    <p v-if="attemptCount > 5" class="hint-text">
      {{ getHintText() }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useEasterEggs } from '@/composables/useEasterEggs'

const { discoverEgg, EASTER_EGGS } = useEasterEggs()

const buttonRef = ref(null)
const buttonX = ref(0)
const buttonY = ref(0)
const attemptCount = ref(0)
const isMobile = ref(false)

const buttonText = computed(() => {
  if (attemptCount.value === 0) return "Don't Click"
  if (attemptCount.value < 3) return "I said don't!"
  if (attemptCount.value < 5) return "Stop chasing me!"
  if (attemptCount.value < 10) return "You're persistent..."
  if (attemptCount.value < 15) return "Almost there..."
  return "Okay, you win!"
})

const buttonStyle = computed(() => {
  return {
    transform: `translate(${buttonX.value}px, ${buttonY.value}px)`,
    transition: 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  }
})

const getRandomPosition = (currentX, currentY) => {
  const button = buttonRef.value
  if (!button) return { x: 0, y: 0 }

  const container = button.parentElement
  const containerRect = container.getBoundingClientRect()
  const buttonRect = button.getBoundingClientRect()

  const maxX = containerRect.width - buttonRect.width - 40
  const maxY = 200 // Keep it in a reasonable vertical range

  let newX, newY
  let attempts = 0
  const minDistance = 150

  do {
    newX = Math.random() * maxX - maxX / 2
    newY = Math.random() * maxY - maxY / 2
    attempts++
  } while (
    attempts < 10 &&
    Math.abs(newX - currentX) < minDistance &&
    Math.abs(newY - currentY) < minDistance
  )

  return { x: newX, y: newY }
}

const handleHover = (event) => {
  if (isMobile.value) return
  
  attemptCount.value++
  const { x, y } = getRandomPosition(buttonX.value, buttonY.value)
  buttonX.value = x
  buttonY.value = y

  if (attemptCount.value === 1) {
    discoverEgg(EASTER_EGGS.FLEEING_BUTTON)
  }
}

const handleTouch = (event) => {
  event.preventDefault()
  attemptCount.value++
  
  if (attemptCount.value === 1) {
    discoverEgg(EASTER_EGGS.FLEEING_BUTTON)
  }
}

const handleClick = () => {
  // If they somehow click it (after many attempts), show a message
  if (attemptCount.value >= 15) {
    alert("Congratulations! You've earned my respect. 🎉")
    attemptCount.value = 0
    buttonX.value = 0
    buttonY.value = 0
  }
}

const getHintText = () => {
  const hints = [
    "Tip: Maybe try clicking faster?",
    "Hint: It's not about speed...",
    "Pro tip: Patience is a virtue",
    "Fun fact: This button has feelings too",
    "Easter egg: Keep trying, you're doing great!"
  ]
  const index = Math.min(Math.floor(attemptCount.value / 3), hints.length - 1)
  return hints[index]
}

onMounted(() => {
  isMobile.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
})
</script>

<style lang="scss" scoped>
.fleeing-button-wrapper {
  position: relative;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
}

.fleeing-button {
  position: relative;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  padding: 0.75rem 1.5rem;
  background: transparent;
  color: var(--terminal-text);
  border: 1px solid var(--terminal-border);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    border-color: var(--terminal-accent);
    color: var(--terminal-accent);
  }

  @media (max-width: 768px) {
    font-size: 0.75rem;
    padding: 0.6rem 1.2rem;
  }
}

.hint-text {
  position: absolute;
  bottom: 0;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--terminal-text-dim);
  font-style: italic;
  margin-top: 1rem;
  opacity: 0.7;
}
</style>
