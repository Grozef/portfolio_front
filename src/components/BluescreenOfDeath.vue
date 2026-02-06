<template>
  <Teleport to="body">
    <Transition name="bsod">
      <div v-if="show" class="bsod-overlay" :class="{ 'can-close': canClose }" @click="handleClick">
        <div class="bsod-screen">
          <div class="bsod-content">
            <div class="bsod-header">
              <div class="sad-face">:(</div>
              <h1 class="bsod-title">Your portfolio ran into a problem</h1>
            </div>

            <div class="bsod-body">
              <p class="bsod-message">
                Just kidding! This is what you get for being too persistent. You clicked the "Contact me faster" button {{ clickCount }} times, which is a bit excessive. Please take a deep breath and try again later.
              </p>

              <div class="bsod-info">
                <div class="info-line">
                  <span class="info-label">Error Code:</span>
                  <span class="info-value">TOO_MANY_CLICKS</span>
                </div>
                <div class="info-line">
                  <span class="info-label">Cause:</span>
                  <span class="info-value">User clicked "Contact me faster" {{ clickCount }} times</span>
                </div>
                <div class="info-line">
                  <span class="info-label">Solution:</span>
                  <span class="info-value">Wait for the loading bar to complete</span>
                </div>
              </div>

              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: progress + '%' }"></div>
              </div>
              <p class="progress-text">{{ progress }}% complete</p>

              <div class="technical-info">
                <p class="tech-header">Technical Information:</p>
                <p class="tech-line">*** STOP: 0x000000FE (0xC0FFEE, 0xDEADBEEF, 0xBADF00D, 0x8BADF00D)</p>
                <p class="tech-line">EASTER_EGG_FOUND</p>
                <p class="tech-line">portfolio_frontend.vue</p>
              </div>
            </div>

            <div class="bsod-footer">
              <p v-if="!canClose">Please wait for the loading bar to complete...</p>
              <p v-else>Click anywhere to dismiss this easter egg</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  clickCount: {
    type: Number,
    default: 3
  }
})

const emit = defineEmits(['close'])

const progress = ref(0)
let progressInterval = null

const canClose = computed(() => progress.value >= 100)

const handleClick = () => {
  if (canClose.value) {
    emit('close')
  }
}

const handleEscape = (event) => {
  if (event.key === 'Escape' && props.show && canClose.value) {
    emit('close')
  }
}

const startProgress = () => {
  progress.value = 0
  progressInterval = setInterval(() => {
    if (progress.value < 100) {
      progress.value += 1
    } else {
      clearInterval(progressInterval)
    }
  }, 50)
}

watch(() => props.show, (newValue) => {
  if (newValue) {
    startProgress()
  } else {
    if (progressInterval) {
      clearInterval(progressInterval)
    }
  }
})

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  if (progressInterval) {
    clearInterval(progressInterval)
  }
})
</script>

<style lang="scss" scoped>
.bsod-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #0078d7;
  z-index: 10000;
  overflow: auto;
  cursor: not-allowed;
  
  &.can-close {
    cursor: pointer;
  }
}

.bsod-screen {
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  pointer-events: none;
  
  .can-close & {
    pointer-events: all;
  }
}

.bsod-content {
  max-width: 800px;
  width: 100%;
  color: white;
  font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
}

.bsod-header {
  margin-bottom: 2rem;
}

.sad-face {
  font-size: 8rem;
  font-weight: 300;
  line-height: 1;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 5rem;
  }
}

.bsod-title {
  font-size: 2.5rem;
  font-weight: 300;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
}

.bsod-body {
  margin-bottom: 2rem;
}

.bsod-message {
  font-size: 1.25rem;
  line-height: 1.6;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
}

.bsod-info {
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 4px;
  margin-bottom: 2rem;
}

.info-line {
  display: flex;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.25rem;
  }
}

.info-label {
  font-weight: 600;
  min-width: 100px;
  margin-right: 1rem;

  @media (max-width: 768px) {
    min-width: auto;
  }
}

.info-value {
  flex: 1;
  opacity: 0.9;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  margin-bottom: 0.5rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: white;
  transition: width 0.1s linear;
}

.progress-text {
  font-size: 0.875rem;
  opacity: 0.8;
  margin-bottom: 2rem;
}

.technical-info {
  background: rgba(0, 0, 0, 0.2);
  padding: 1rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  line-height: 1.8;
}

.tech-header {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.tech-line {
  margin: 0.25rem 0;
  opacity: 0.9;
}

.bsod-footer {
  text-align: center;
  font-size: 0.95rem;
  opacity: 0.8;
  animation: blink 1.5s ease infinite;
}

@keyframes blink {
  0%, 100% {
    opacity: 0.8;
  }
  50% {
    opacity: 0.3;
  }
}

.bsod-enter-active {
  animation: screenGlitch 0.3s ease;
}

.bsod-leave-active {
  animation: screenGlitch 0.2s ease reverse;
}

@keyframes screenGlitch {
  0% {
    transform: scale(1.1);
    opacity: 0;
    filter: blur(10px);
  }
  50% {
    transform: scale(0.98) skew(2deg);
  }
  100% {
    transform: scale(1);
    opacity: 1;
    filter: blur(0);
  }
}
</style>