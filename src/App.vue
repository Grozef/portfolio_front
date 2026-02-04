<template>
  <div id="app">
    <CustomCursor v-if="!isMobile" />
    <GrainOverlay />
    
    <!-- Extreme Dark Mode Overlay -->
    <ExtremeDarkMode />
    
    <!-- FIX: Dark Mode Toggle Button -->
    <DarkModeToggle />
    
    <!-- Master Easter Egg Modal -->
    <MasterEasterEgg 
      :show="showMasterEgg" 
      :discovered-eggs="discoveredEggs"
      :total-eggs="9"
      @close="showMasterEgg = false"
    />
    
    <router-view />
    
    <FooterComponent />
    
    <!-- Cookie Banner -->
    <CookieBanner />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { RouterView } from 'vue-router'
import CustomCursor from '@/components/CustomCursor.vue'
import GrainOverlay from '@/components/GrainOverlay.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import CookieBanner from '@/components/CookieBanner.vue'
import ExtremeDarkMode from '@/components/ExtremeDarkMode.vue'
import MasterEasterEgg from '@/components/MasterEasterEgg.vue'
import DarkModeToggle from '@/components/DarkModeToggle.vue' // FIX: Added import
import { useVimQuit } from '@/composables/useVimQuit'
import { useEasterEggs } from '@/composables/useEasterEggs'

const isMobile = ref(false)
const showMasterEgg = ref(false)

// Initialize Easter Eggs composables
const { allEggsDiscovered, discoveredEggs, masterEggTriggered } = useEasterEggs()

// Initialize Vim quit easter egg
useVimQuit()

// ASCII Art Console Welcome (Feature #2)
const displayASCIIWelcome = () => {
  const asciiArt = `
   ╔════════════════════════════════════════════════════════╗
   ║                                                        ║
   ║              Welcome to François's Portfolio          ║
   ║                                                        ║
   ║                    ___________________                 ║
   ║                   |  _____________  |                  ║
   ║                   | |             | |                  ║
   ║                   | |   > _       | |                  ║
   ║                   | |             | |                  ║
   ║                   | |_____________| |                  ║
   ║                   |_________________|                  ║
   ║                        |  |_| |  |                     ║
   ║                     ___|________|___                   ║
   ║                    |________________|                  ║
   ║                                                        ║
   ║              Type 'help' to get started                ║
   ║                                                        ║
   ║           Hint: 10 easter eggs are hidden              ║
   ║                  Can you find them all?                ║
   ║                                                        ║
   ╚════════════════════════════════════════════════════════╝
  `

  console.log('%c' + asciiArt, 'color: #c9a227; font-family: monospace; font-size: 12px; line-height: 1.2;')
  console.log('%cEaster Egg Discovered: ASCII Art Console Welcome', 'color: #27ca40; font-weight: bold; font-size: 14px;')
  console.log('%cPro tip: Check out /humans.txt for more info!', 'color: #4a9eff; font-size: 12px;')
  
  // Discover ASCII art easter egg
  const { discoverEgg, EASTER_EGGS } = useEasterEggs()
  discoverEgg(EASTER_EGGS.ASCII_ART)
}

// Watch for all eggs discovered
watch(allEggsDiscovered, (allDiscovered) => {
  if (allDiscovered && !masterEggTriggered.value) {
    setTimeout(() => {
      showMasterEgg.value = true
    }, 500)
  }
})

onMounted(() => {
  // Check if mobile
  isMobile.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
  
  // Display ASCII art welcome on page load
  setTimeout(displayASCIIWelcome, 500)
})
</script>

<style lang="scss">
@import '@/assets/main.scss';

/* FIX: Import global cursor fix */
@import '@/assets/global-cursor-fix.css';

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

:root {
  --terminal-bg: #0a0a0b;
  --terminal-bg-secondary: #111113;
  --terminal-text: #e8e6e3;
  --terminal-text-dim: #6b6b6b;
  --terminal-accent: #c9a227;
  --terminal-accent-secondary: #4a9eff;
  --terminal-border: #2a2a2a;
  --terminal-success: #27ca40;
  --terminal-error: #ff4444;
  --terminal-warning: #ffa500;
  --font-mono: 'JetBrains Mono', monospace;
  --font-display: 'Playfair Display', serif;
  --font-serif: 'Crimson Pro', serif;
}

*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-mono);
  background: var(--terminal-bg);
  color: var(--terminal-text);
  line-height: 1.6;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  cursor: pointer;
  font-family: inherit;
}

::selection {
  background: var(--terminal-accent);
  color: var(--terminal-bg);
}
</style>