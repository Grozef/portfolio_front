<template>
  <div class="eye-tracking-portrait" ref="portraitRef">
    <img :src="imageSrc" :alt="alt" class="portrait-image" />
    
    <!-- Eye overlay -->
    <div class="eye-container" :style="eyeContainerStyle">
      <div class="eye left-eye">
        <div class="pupil" :style="leftPupilStyle"></div>
      </div>
      <div class="eye right-eye">
        <div class="pupil" :style="rightPupilStyle"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useEasterEggs } from '@/composables/useEasterEggs'

const props = defineProps({
  imageSrc: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: 'Portrait'
  },
  eyePosition: {
    type: Object,
    default: () => ({ x: 50, y: 40 }) // Percentage position of eyes on image
  }
})

const { discoverEgg, EASTER_EGGS, isDiscovered } = useEasterEggs()

const portraitRef = ref(null)
const mouseX = ref(0)
const mouseY = ref(0)
const discovered = ref(false)

// Track mouse movement time to detect when user notices
let movementCount = 0
let movementTimer = null

const eyeContainerStyle = computed(() => ({
  top: `${props.eyePosition.y}%`,
  left: `${props.eyePosition.x}%`
}))

const calculatePupilPosition = (eyeX, eyeY) => {
  if (!portraitRef.value) return { x: 0, y: 0 }

  const rect = portraitRef.value.getBoundingClientRect()
  const eyeAbsX = rect.left + (rect.width * props.eyePosition.x) / 100
  const eyeAbsY = rect.top + (rect.height * props.eyePosition.y) / 100

  // Calculate angle and distance
  const deltaX = mouseX.value - eyeAbsX
  const deltaY = mouseY.value - eyeAbsY
  const angle = Math.atan2(deltaY, deltaX)
  const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), 50) / 50

  // Constrain pupil movement within eye
  const maxMove = 8 // Maximum pixels the pupil can move
  const moveX = Math.cos(angle) * distance * maxMove
  const moveY = Math.sin(angle) * distance * maxMove

  return { x: moveX, y: moveY }
}

const leftPupilStyle = computed(() => {
  const pos = calculatePupilPosition(
    props.eyePosition.x - 3, // Left eye offset
    props.eyePosition.y
  )
  return {
    transform: `translate(${pos.x}px, ${pos.y}px)`
  }
})

const rightPupilStyle = computed(() => {
  const pos = calculatePupilPosition(
    props.eyePosition.x + 3, // Right eye offset
    props.eyePosition.y
  )
  return {
    transform: `translate(${pos.x}px, ${pos.y}px)`
  }
})

const handleMouseMove = (e) => {
  mouseX.value = e.clientX
  mouseY.value = e.clientY

  // Track movement to detect discovery
  if (!discovered.value && !isDiscovered(EASTER_EGGS.EYE_TRACKING)) {
    movementCount++
    
    if (movementTimer) {
      clearTimeout(movementTimer)
    }
    
    // After 20 movements within 10 seconds, consider it discovered
    movementTimer = setTimeout(() => {
      movementCount = 0
    }, 10000)
    
    if (movementCount >= 20) {
      discovered.value = true
      discoverEgg(EASTER_EGGS.EYE_TRACKING, {
        discoveryMethod: 'mouse_movement_tracking'
      })
    }
  }
}

// Detect if user hovers over portrait for extended period
const handleMouseEnter = () => {
  if (!discovered.value && !isDiscovered(EASTER_EGGS.EYE_TRACKING)) {
    setTimeout(() => {
      if (portraitRef.value?.matches(':hover') && !discovered.value) {
        discovered.value = true
        discoverEgg(EASTER_EGGS.EYE_TRACKING, {
          discoveryMethod: 'extended_hover'
        })
      }
    }, 3000)
  }
}

onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove)
  if (portraitRef.value) {
    portraitRef.value.addEventListener('mouseenter', handleMouseEnter)
  }
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  if (movementTimer) {
    clearTimeout(movementTimer)
  }
})
</script>

<style lang="scss" scoped>
.eye-tracking-portrait {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.portrait-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.eye-container {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 20px;
  pointer-events: none;
}

.eye {
  position: relative;
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 50%;
  border: 2px solid #333;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pupil {
  width: 12px;
  height: 12px;
  background: #1a1a1a;
  border-radius: 50%;
  position: relative;
  transition: transform 0.15s ease-out;
  
  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    width: 4px;
    height: 4px;
    background: white;
    border-radius: 50%;
    opacity: 0.6;
  }
}

.left-eye {
  margin-right: 5px;
}

.right-eye {
  margin-left: 5px;
}

/* Subtle animation when page loads */
@keyframes eyeBlink {
  0%, 100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(0.1);
  }
}

.eye {
  animation: eyeBlink 3s ease-in-out infinite;
  animation-delay: 5s;
}
</style>
