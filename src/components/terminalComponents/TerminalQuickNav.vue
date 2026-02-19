<template>
  <Transition name="slide-down">
    <div v-if="visible" class="quick-nav">
      <div class="quick-nav__content">
        <p class="quick-nav__hint">
          <span class="quick-nav__icon"></span>
          Not comfortable with terminal commands?
          <button @click="router.push('/projects')" class="quick-nav__btn" data-cursor-hover>
            Switch to GUI Mode →
          </button>
        </p>
        <button @click="dismiss" class="quick-nav__close" aria-label="Close banner">✕</button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const STORAGE_KEY = 'hide_quick_nav'
const router = useRouter()
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
.quick-nav {
  background: linear-gradient(135deg, var(--terminal-accent) 0%, var(--terminal-accent-secondary) 100%);
  color: var(--terminal-bg);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  @media (max-width: 480px) { border-radius: 6px; }

  &__content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    gap: 1rem;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
      padding: 1rem;
    }
    @media (max-width: 480px) { padding: 0.875rem; }
  }

  &__hint {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-family: var(--font-sans);
    font-size: 0.95rem;
    flex: 1;

    @media (max-width: 768px) {
      font-size: 0.9rem;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
      width: 100%;
    }
    @media (max-width: 480px) { font-size: 0.85rem; }
  }

  &__icon {
    font-size: 1.25rem;
    @media (max-width: 480px) { font-size: 1.1rem; }
  }

  &__btn {
    background: var(--terminal-bg);
    color: var(--terminal-accent);
    border: none;
    padding: 0.5rem 1.25rem;
    border-radius: 6px;
    font-family: var(--font-mono);
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;

    @media (max-width: 768px) { width: 100%; text-align: center; }
    @media (max-width: 480px) { padding: 0.5rem 1rem; font-size: 0.85rem; }

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
  }

  &__close {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: var(--terminal-bg);
    font-size: 1.25rem;
    cursor: pointer;
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    transition: all 0.2s ease;

    @media (max-width: 768px) {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
    }
    @media (max-width: 480px) { font-size: 1.1rem; padding: 0.25rem 0.5rem; }

    &:hover { background: rgba(255, 255, 255, 0.3); }
  }
}

.slide-down-enter-active,
.slide-down-leave-active { transition: all 0.3s ease; }
.slide-down-enter-from,
.slide-down-leave-to { opacity: 0; transform: translateY(-20px); }
</style>
