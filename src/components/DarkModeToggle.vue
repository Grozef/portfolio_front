<template>
  <button
    class="dark-mode-toggle"
    :class="{ active: isActive }"
    @click="toggleDarkMode"
    :aria-label="isActive ? 'Disable Extreme Dark Mode' : 'Enable Extreme Dark Mode'"
    :title="isActive ? 'Extreme Dark Mode: ON (CTRL+Z to toggle)' : 'Extreme Dark Mode: OFF (CTRL+Z to toggle)'"
    data-cursor-hover
  >
    <svg 
      class="toggle-icon" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- FIX: Flashlight icon -->
      <path 
        v-if="!isActive"
        d="M9 2L7.17 4H4.5C3.67 4 3 4.67 3 5.5V9C3 9.83 3.67 10.5 4.5 10.5H7.17L9 12.5L11 10.5L9 8.5L7 10.5H5V5.5H7L9 7.5L11 5.5L9 2ZM13.5 5.5C13.5 5.5 12 7 12 9C12 11 13.5 12.5 13.5 12.5L18.5 17.5C19.5 18.5 21 18.5 22 17.5C23 16.5 23 15 22 14L17 9C17 9 15.5 7.5 15.5 5.5C15.5 3.5 17 2 17 2L13.5 5.5Z" 
        :fill="isActive ? 'var(--terminal-accent)' : 'currentColor'"
      />
      <path 
        v-else
        d="M9 2L7.17 4H4.5C3.67 4 3 4.67 3 5.5V9C3 9.83 3.67 10.5 4.5 10.5H7.17L9 12.5L11 10.5L9 8.5L7 10.5H5V5.5H7L9 7.5L11 5.5L9 2ZM13.5 5.5C13.5 5.5 12 7 12 9C12 11 13.5 12.5 13.5 12.5L18.5 17.5C19.5 18.5 21 18.5 22 17.5C23 16.5 23 15 22 14L17 9C17 9 15.5 7.5 15.5 5.5C15.5 3.5 17 2 17 2L13.5 5.5Z" 
        fill="var(--terminal-accent)"
      />
      <!-- Light beam effect when active -->
      <g v-if="isActive" class="light-beam">
        <path 
          d="M13 9L16 12L20 16" 
          stroke="var(--terminal-accent)" 
          stroke-width="2" 
          stroke-linecap="round"
          opacity="0.3"
        />
        <circle cx="20" cy="16" r="3" fill="var(--terminal-accent)" opacity="0.2" />
      </g>
    </svg>
    <span class="toggle-label">{{ isActive ? 'ON' : 'OFF' }}</span>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useExtremeDarkMode } from '@/composables/useExtremeDarkMode'

const { isActive, toggle } = useExtremeDarkMode()

const toggleDarkMode = () => {
  toggle()
}
</script>

<style lang="scss" scoped>
.dark-mode-toggle {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 9998;
  
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  padding: 0.75rem 1rem;
  background: var(--terminal-bg-secondary);
  border: 1px solid var(--terminal-border);
  border-radius: 8px;
  
  color: var(--terminal-text);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  
  &:hover {
    border-color: var(--terminal-accent);
    background: var(--terminal-bg);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &.active {
    border-color: var(--terminal-accent);
    background: rgba(201, 162, 39, 0.1);
    
    .toggle-label {
      color: var(--terminal-accent);
    }
  }
  
  @media (max-width: 768px) {
    bottom: 1rem;
    right: 1rem;
    padding: 0.6rem 0.8rem;
    
    .toggle-label {
      display: none;
    }
  }
}

.toggle-icon {
  width: 20px;
  height: 20px;
  color: var(--terminal-text);
  transition: all 0.3s ease;
  
  .active & {
    color: var(--terminal-accent);
  }
}

.light-beam {
  animation: pulse 2s ease-in-out infinite;
}

.toggle-label {
  letter-spacing: 0.05em;
  text-transform: uppercase;
  transition: color 0.3s ease;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
}

/* Tooltip enhancement */
.dark-mode-toggle::before {
  content: attr(title);
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 0.5rem;
  padding: 0.5rem 0.75rem;
  
  background: var(--terminal-bg);
  border: 1px solid var(--terminal-border);
  border-radius: 4px;
  
  color: var(--terminal-text);
  font-size: 0.7rem;
  white-space: nowrap;
  
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  
  @media (max-width: 768px) {
    display: none;
  }
}

.dark-mode-toggle:hover::before {
  opacity: 1;
}
</style>