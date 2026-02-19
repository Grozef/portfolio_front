<template>
  <Transition name="fade">
    <div v-if="visible" class="terminal-info">
      <div class="info-card">
        <button @click="dismiss" class="info-close" aria-label="Close info">✕</button>
        <h3>Why a Terminal Interface?</h3>
        <p>
         Because i like it and it was fun to code.
        </p>
        <p class="info-hint">
          <strong>Pro tip:</strong> Type "help" to see all available commands!
        </p>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const STORAGE_KEY = 'hide_terminal_info'
const visible = ref(false)

const dismiss = () => {
  visible.value = false
  try { localStorage.setItem(STORAGE_KEY, 'true') } catch (e) { /* noop */ }
}

onMounted(() => {
  try {
    visible.value = !localStorage.getItem(STORAGE_KEY)
  } catch (e) {
    visible.value = true
  }
})
</script>

<style lang="scss" scoped>
.terminal-info {
  animation: fadeIn 0.3s ease;
}

.info-card {
  position: relative;
  background: linear-gradient(
    135deg,
    rgba(201, 162, 39, 0.1) 0%,
    rgba(74, 158, 255, 0.1) 100%
  );
  border: 1px solid var(--terminal-border);
  padding: 1.5rem;
  border-radius: 8px;
  font-family: var(--font-sans);

  @media (max-width: 768px) { padding: 1.25rem; }
  @media (max-width: 480px) { padding: 1rem; border-radius: 6px; }

  h3 {
    color: var(--terminal-accent);
    margin-bottom: 0.75rem;
    font-size: 1.1rem;
    @media (max-width: 480px) { font-size: 1rem; }
  }

  p {
    color: var(--terminal-text);
    line-height: 1.6;
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
    @media (max-width: 480px) { font-size: 0.875rem; }
  }

  .info-hint {
    color: var(--terminal-text-dim);
    font-size: 0.9rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--terminal-border);
    @media (max-width: 480px) { font-size: 0.825rem; margin-top: 0.75rem; padding-top: 0.75rem; }

    strong { color: var(--terminal-accent); }
  }
}

.info-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: 1px solid var(--terminal-border);
  color: var(--terminal-text-dim);
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  transition: all 0.2s ease;

  @media (max-width: 480px) { top: 0.75rem; right: 0.75rem; font-size: 1.1rem; }

  &:hover {
    border-color: var(--terminal-accent);
    color: var(--terminal-accent);
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to   { opacity: 1; transform: translateY(0); }
}

.fade-enter-active,
.fade-leave-active { transition: all 0.3s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
