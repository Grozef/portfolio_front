<template>
  <Transition name="fade">
    <div v-if="active" class="demo-indicator">
      <span class="demo-text">Demo Mode Active</span>
      <button @click="$emit('stop')" class="demo-stop" data-cursor-hover>Stop Demo</button>
    </div>
  </Transition>
</template>

<script setup>
defineProps({ active: Boolean })
defineEmits(['stop'])
</script>

<style lang="scss" scoped>
.demo-indicator {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: var(--terminal-bg-secondary);
  border: 1px solid var(--terminal-accent);
  border-radius: 6px;
  animation: pulse 2s ease infinite;

  @media (max-width: 768px) { flex-direction: column; align-items: stretch; }
  @media (max-width: 480px) { padding: 0.625rem 0.875rem; }
}

.demo-text {
  color: var(--terminal-accent);
  font-family: var(--font-mono);
  font-size: 0.9rem;
  @media (max-width: 480px) { font-size: 0.85rem; }
}

.demo-stop {
  background: var(--terminal-accent);
  color: var(--terminal-bg);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  cursor: pointer;
  transition: opacity 0.2s ease;
  white-space: nowrap;

  @media (max-width: 768px) { width: 100%; }
  @media (max-width: 480px) { padding: 0.5rem 0.875rem; font-size: 0.8rem; }

  &:hover { opacity: 0.9; }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.8; }
}

.fade-enter-active,
.fade-leave-active { transition: all 0.3s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
