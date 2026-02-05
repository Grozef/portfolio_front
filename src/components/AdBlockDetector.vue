<template>
  <Transition name="slide-down">
    <div v-if="adBlockDetected" class="adblock-message">
      <div class="message-content">
        <span class="icon">🛡️</span>
        <p class="message-text">
          Merci de ne pas bloquer mes pubs... Ah attends, je n'en ai pas. Tu peux rester ! 😄
        </p>
        <button @click="dismissMessage" class="dismiss-btn" data-cursor-hover>
          <span>×</span>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useEasterEggs } from '@/composables/useEasterEggs'

const { discoverEgg, EASTER_EGGS, isDiscovered } = useEasterEggs()

const adBlockDetected = ref(false)
const discovered = ref(false)

// Detect AdBlock by attempting to load a fake ad element
const detectAdBlock = async () => {
  // Method 1: Try to fetch a known ad URL
  try {
    const adUrl = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
    const response = await fetch(adUrl, {
      method: 'HEAD',
      mode: 'no-cors'
    })
    
    // If we get here without error, no adblock (but no-cors makes this tricky)
  } catch (error) {
    // Fetch failed, likely adblock
    adBlockDetected.value = true
  }

  // Method 2: Create a bait element
  const bait = document.createElement('div')
  bait.className = 'ad ads advertisement pub-banner'
  bait.style.cssText = 'position: absolute; top: -999px; left: -999px; width: 1px; height: 1px;'
  document.body.appendChild(bait)

  // Check if element is blocked
  setTimeout(() => {
    const isBlocked = bait.offsetHeight === 0 || 
                     bait.offsetWidth === 0 || 
                     window.getComputedStyle(bait).display === 'none'
    
    if (isBlocked) {
      adBlockDetected.value = true
    }
    
    document.body.removeChild(bait)
    
    // Discover easter egg if adblock detected
    if (adBlockDetected.value && !discovered.value && !isDiscovered(EASTER_EGGS.ADBLOCK_DETECTOR)) {
      discovered.value = true
      setTimeout(() => {
        discoverEgg(EASTER_EGGS.ADBLOCK_DETECTOR)
      }, 1000)
    }
  }, 100)
}

const dismissMessage = () => {
  adBlockDetected.value = false
}

onMounted(() => {
  detectAdBlock()
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
  padding: 1.25rem 3rem 1.25rem 1.25rem;
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
}

.dismiss-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 2rem;
  height: 2rem;
  padding: 0;
  background: transparent;
  border: 1px solid var(--terminal-border);
  border-radius: 4px;
  color: var(--terminal-text-dim);
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--terminal-accent);
    color: var(--terminal-accent);
    transform: rotate(90deg);
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

@media (max-width: 768px) {
  .message-content {
    padding: 1rem 2.5rem 1rem 1rem;
    gap: 0.75rem;
  }

  .icon {
    font-size: 1.5rem;
  }

  .message-text {
    font-size: 0.85rem;
  }
}
</style>
