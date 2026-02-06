<template>
  <Transition name="slide-down">
    <div v-if="showMessage" class="adblock-message">
      <div class="message-content">
        <!-- <span class="icon"></span> -->
        <p class="message-text">
          Merci de ne pas utiliser AdBlock ! Bon, je n'ai pas de pubs de toute façon...  
        </p>
        <button @click="dismissMessage" class="dismiss-btn" data-cursor-hover>
          <span>Got it!</span>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useEasterEggs } from '@/composables/useEasterEggs'

const { discoverEgg, EASTER_EGGS, isDiscovered } = useEasterEggs()

const showMessage = ref(false)
const noAdBlockDetected = ref(false)

// Detect if AdBlock is NOT present
const detectNoAdBlock = async () => {
  // If already discovered, don't show again
  if (isDiscovered(EASTER_EGGS.ADBLOCK_DETECTOR)) {
    return
  }

  // Method 1: Create a bait element that AdBlock would block
  const bait = document.createElement('div')
  bait.className = 'ad ads advertisement pub-banner adsbox ad-placement'
  bait.style.cssText = 'position: absolute !important; top: -999px !important; left: -999px !important; width: 1px !important; height: 1px !important;'
  bait.innerHTML = '&nbsp;'
  document.body.appendChild(bait)

  // Check if element is NOT blocked (meaning no adblock)
  setTimeout(() => {
    const isNotBlocked = bait.offsetHeight > 0 && 
                        bait.offsetWidth > 0 && 
                        window.getComputedStyle(bait).display !== 'none' &&
                        window.getComputedStyle(bait).visibility !== 'hidden'
    
    if (isNotBlocked) {
      noAdBlockDetected.value = true
      showMessage.value = true
    }
    
    try {
      document.body.removeChild(bait)
    } catch (e) {
      // Bait was already removed by adblock
    }
  }, 100)
}

const dismissMessage = () => {
  showMessage.value = false
  
  // Discover easter egg when user dismisses the message
  if (noAdBlockDetected.value && !isDiscovered(EASTER_EGGS.ADBLOCK_DETECTOR)) {
    discoverEgg(EASTER_EGGS.ADBLOCK_DETECTOR)
  }
}

onMounted(() => {
  // Delay detection to avoid false positives
  setTimeout(() => {
    detectNoAdBlock()
  }, 2000)
})
</script>

<style lang="scss" scoped>
.adblock-message {
  position: fixed;
  top: 5rem;
  left: 50%;
  transform: translateX(-50%);
  max-width: 600px;
  width: calc(100% - 2rem);
  z-index: 1000;
  animation: slideDown 0.5s ease;
}

.message-content {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.25rem;
  background: var(--terminal-bg-secondary);
  border: 2px solid var(--terminal-accent);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.message-text {
  font-family: var(--font-mono);
  font-size: 0.95rem;
  color: var(--terminal-text);
  line-height: 1.6;
  margin: 0;
  flex: 1;
}

.dismiss-btn {
  padding: 0.5rem 1rem;
  background: var(--terminal-accent);
  border: none;
  border-radius: 4px;
  color: var(--terminal-bg);
  font-family: var(--font-mono);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    background: var(--terminal-accent-secondary);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(34, 211, 238, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.5s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

@media (max-width: 768px) {
  .message-content {
    flex-direction: column;
    text-align: center;
    padding: 1rem;
  }

  .icon {
    font-size: 1.5rem;
  }

  .message-text {
    font-size: 0.85rem;
  }

  .dismiss-btn {
    width: 100%;
  }
}
</style>