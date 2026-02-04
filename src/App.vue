<template>
  <div id="app">
    <CustomCursor v-if="!isMobile" />
    <GrainOverlay />
    
    <router-view />
    
    <FooterComponent />
    
    <!-- Cookie Banner -->
    <CookieBanner />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import CustomCursor from '@/components/CustomCursor.vue'
import GrainOverlay from '@/components/GrainOverlay.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import CookieBanner from '@/components/CookieBanner.vue'

const isMobile = ref(false)

onMounted(() => {
  isMobile.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
})
</script>

<style lang="scss">
@import '@/assets/main.scss';

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}
</style>