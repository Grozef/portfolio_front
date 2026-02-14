<template>
  <div class="terminal__header">
    <div class="terminal__controls">
      <span class="control control--close"></span>
      <span class="control control--minimize"></span>
      <span class="control control--maximize"></span>
    </div>
    <span class="terminal__title">portfolio@terminal ~ </span>
    <div class="terminal__status">
      <span class="status-dot" :class="{ active: !isProcessing }"></span>
      <span class="status-text">{{ isProcessing ? 'Processing...' : 'Ready' }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isProcessing: Boolean
})
</script>

<style lang="scss" scoped>
.terminal__header {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background: var(--terminal-bg-secondary);
  border-bottom: 1px solid var(--terminal-border);
  gap: 1rem;
}

.terminal__controls {
  display: flex;
  gap: 8px;
}

.control {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  &--close { background: #ff5f56; }
  &--minimize { background: #ffbd2e; }
  &--maximize { background: #27ca40; }
}

.terminal__title {
  flex: 1;
  font-size: 0.8rem;
  color: var(--terminal-text-dim);
  text-align: center;
  font-family: var(--font-mono);
}

.terminal__status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--terminal-text-dim);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--terminal-warning);
  &.active { background: var(--terminal-success); }
}
</style>