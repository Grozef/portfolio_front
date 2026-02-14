<template>
  <div class="terminal__input-line" @click="focus">
    <span class="prompt">{{ prompt }} $</span>
    <input
      ref="inputField"
      :value="modelValue"
      type="text"
      class="terminal__input"
      :disabled="isProcessing"
      autocomplete="off"
      spellcheck="false"
      @input="$emit('update:modelValue', $event.target.value)"
      @keydown.enter="handleEnter"
      @keydown.up.prevent="$emit('history-up')"
      @keydown.down.prevent="$emit('history-down')"
      @keydown.l.ctrl.prevent="terminalStore.clearHistory()"
    />
    <span class="cursor" :class="{ 'cursor-blink': !isProcessing }">█</span>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTerminalStore } from '@/stores/terminal'

const props = defineProps({
  modelValue: String,
  prompt: String,
  isProcessing: Boolean
})

const emit = defineEmits(['update:modelValue', 'submit', 'history-up', 'history-down'])
const terminalStore = useTerminalStore()
const inputField = ref(null)

const focus = () => {
  inputField.value?.focus()
}

const handleEnter = () => {
  emit('submit', props.modelValue)
}

defineExpose({ focus })
</script>

<style lang="scss" scoped>
.terminal__input-line {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-top: 1px solid var(--terminal-border);
  background: var(--terminal-bg-secondary);
  cursor: text;
}

.prompt {
  color: var(--terminal-accent);
  margin-right: 0.5rem;
  white-space: nowrap;
  font-family: var(--font-mono);
}

.terminal__input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--terminal-text);
  font-family: var(--font-mono);
  font-size: 0.9rem;
  caret-color: transparent; // Custom cursor used instead

  &:disabled {
    opacity: 0.5;
  }
}

.cursor {
  color: var(--terminal-accent);
  margin-left: 2px;
  &.cursor-blink {
    animation: blink 1s step-end infinite;
  }
}

@keyframes blink {
  from, to { opacity: 1; }
  50% { opacity: 0; }
}
</style>