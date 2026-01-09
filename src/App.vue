<script setup>
import { ref, onMounted, provide } from 'vue'
import { useTerminalStore } from '@/stores/terminal'
import GrainOverlay from '@/components/GrainOverlay.vue'
import CustomCursor from '@/components/CustomCursor.vue'

const terminalStore = useTerminalStore()
const isLoaded = ref(false)

provide('terminalStore', terminalStore)

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true
  }, 100)
})
</script>

<template>
  <div class="app" :class="{ loaded: isLoaded }">
    <GrainOverlay />
    <CustomCursor />
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style lang="scss">
.app {
  min-height: 100vh;
  opacity: 0;
  transition: opacity 0.6s ease;

  &.loaded {
    opacity: 1;
  }
}

.page-enter-active,
.page-leave-active {
  transition: all 0.4s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
