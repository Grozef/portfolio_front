<template>
  <div class="sword-trigger-wrapper">
    <button 
      @click="handleTrigger" 
      class="sword-trigger"
      :class="{ active: swordCursorActive }"
      data-cursor-hover
      aria-label="Toggle sword cursor"
    >
      <span class="trigger-icon">⚔️</span>
    </button>
    <p v-if="showHint" class="trigger-hint">
      {{ swordCursorActive ? 'Sword cursor activated!' : 'Click to activate sword cursor' }}
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSwordCursor } from '@/composables/useSwordCursor'
import { useEasterEggs } from '@/composables/useEasterEggs'

const { swordCursorActive, toggleSwordCursor } = useSwordCursor()
const { discoverEgg, EASTER_EGGS } = useEasterEggs()

const showHint = ref(false)

const handleTrigger = () => {
  toggleSwordCursor()
  
  // Discover easter egg on first activation
  if (swordCursorActive.value) {
    discoverEgg(EASTER_EGGS.SWORD_CURSOR)
    showHint.value = true
    
    setTimeout(() => {
      showHint.value = false
    }, 3000)
  }
}
</script>

<style lang="scss" scoped>
.sword-trigger-wrapper {
  position: relative;
  display: inline-block;
  margin: 0.5rem 0;
}

.sword-trigger {
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid var(--terminal-border);
  border-radius: 4px;
  color: var(--terminal-text-dim);
  font-family: var(--font-mono);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    border-color: var(--terminal-accent);
    color: var(--terminal-accent);
    transform: translateY(-2px);
  }

  &.active {
    border-color: var(--terminal-accent);
    background: rgba(201, 162, 39, 0.1);
    color: var(--terminal-accent);
  }
}

.trigger-icon {
  font-size: 1.25rem;
  display: inline-block;
  animation: swordFloat 2s ease-in-out infinite;
}

.trigger-hint {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  white-space: nowrap;
  padding: 0.5rem 1rem;
  background: var(--terminal-bg-secondary);
  border: 1px solid var(--terminal-accent);
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--terminal-accent);
  animation: fadeInUp 0.3s ease;
  z-index: 10;
}

@keyframes swordFloat {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-3px) rotate(5deg);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
