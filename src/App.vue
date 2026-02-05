<template>
  <div id="app">
    <CustomCursor v-if="!isMobile" />
    <GrainOverlay />
    <!-- Extreme Dark Mode Overlay -->
    <ExtremeDarkMode />
    
    <!-- Dark Mode Toggle Button -->
    <DarkModeToggle />
    
    <!-- Konami Code Animation -->
    <KonamiAnimationGradius 
      :show="showKonami" 
      @close="showKonami = false" 
    />
    
    <!-- Master Easter Egg Modal -->
    <MasterEasterEgg 
      :show="showMasterEgg" 
      :discovered-eggs="discoveredEggs"
      :total-eggs="totalEggs"
      @close="showMasterEgg = false"
    />
    
    <router-view />

    <SwordCursor />

    <GrandCompletionAnimation
      :show="showGrandCompletion"
      :totalEggs="totalEggs"
      :discoveryStartTime="discoveryStartTime"
      @close="showGrandCompletion = false"
    />
    
    <FooterComponent />
    
    <!-- Cookie Banner -->
    <CookieBanner />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import CustomCursor from '@/components/CustomCursor.vue'
import GrainOverlay from '@/components/GrainOverlay.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import CookieBanner from '@/components/CookieBanner.vue'
import ExtremeDarkMode from '@/components/ExtremeDarkMode.vue'
import WeatherBackground from '@/components/WeatherBackground.vue'
import MasterEasterEgg from '@/components/MasterEasterEgg.vue'
import DarkModeToggle from '@/components/DarkModeToggle.vue'
import KonamiAnimationGradius from '@/components/KonamiAnimationGradius.vue'
import { useVimQuit } from '@/composables/useVimQuit'
import { useKonamiCode } from '@/composables/useKonamiCode'
import { useEasterEggs } from '@/composables/useEasterEggs'
import { useAdBlockDetector } from '@/composables/useAdBlockDetector'
import SwordCursor from '@/components/SwordCursor.vue'
import GrandCompletionAnimation from '@/components/GrandCompletionAnimation.vue'

const route = useRoute()
const isMobile = ref(false)
const showMasterEgg = ref(false)
const showKonami = ref(false)
const asciiArtTriggered = ref(false)
const showGrandCompletion = ref(false)
const discoveryStartTime = ref(Date.now())

// Total eggs count (19 regular eggs, excluding master egg)
const totalEggs = 19

// Initialize Easter Eggs composables
const { allEggsDiscovered, discoveredEggs, masterEggTriggered, discoverEgg, EASTER_EGGS } = useEasterEggs()

// Initialize Vim quit easter egg
useVimQuit()

// Initialize Konami code easter egg
useKonamiCode(() => {
  showKonami.value = true
  discoverEgg(EASTER_EGGS.KONAMI_CODE)
  console.log('%c🎮 KONAMI CODE ACTIVATED!', 'color: #c9a227; font-size: 20px; font-weight: bold;')
  setTimeout(() => { showKonami.value = false }, 5000)
})

// Initialize AdBlock detector easter egg
useAdBlockDetector()

// ASCII Art Console Welcome - triggers on homepage visit
const displayASCIIWelcome = () => {
  if (asciiArtTriggered.value) return
  
  const asciiArt = `
   ╔════════════════════════════════════════════════════════╗
   ║                                                        ║
   ║              Welcome to François's Portfolio           ║
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
   ║           Hint: ${totalEggs} easter eggs are hidden    ║
   ║                  Can you find them all?                ║
   ║                                                        ║
   ╚════════════════════════════════════════════════════════╝
  `

  console.log('%c' + asciiArt, 'color: #c9a227; font-family: monospace; font-size: 12px; line-height: 1.2;')
  console.log('%cEaster Egg Discovered: ASCII Art Console Welcome', 'color: #27ca40; font-weight: bold; font-size: 14px;')
  console.log('%cPro tip: Check out /humans.txt for more info!', 'color: #4a9eff; font-size: 12px;')
  console.log('%cTry the Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A', 'color: #ffa500; font-size: 12px;')
  
  // Discover ASCII art easter egg
  discoverEgg(EASTER_EGGS.ASCII_ART)
  asciiArtTriggered.value = true
  
  // Save to session storage to prevent re-triggering
  sessionStorage.setItem('ascii_art_shown', 'true')
}

// Watch for route changes to trigger ASCII art on homepage
watch(() => route.path, (newPath) => {
  if (newPath === '/' || newPath === '/home') {
    const alreadyShown = sessionStorage.getItem('ascii_art_shown')
    if (!alreadyShown) {
      setTimeout(displayASCIIWelcome, 500)
    }
  }
}, { immediate: true })

// Watch for all eggs discovered - Single watch block (FIXED)
watch(allEggsDiscovered, (allDiscovered) => {
  if (allDiscovered && !masterEggTriggered.value) {
    setTimeout(() => {
      showGrandCompletion.value = true
      showMasterEgg.value = true
    }, 500)
  }
})

onMounted(() => {
  // Check if mobile
  isMobile.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
  
  // Trigger ASCII art on initial homepage load
  if (route.path === '/' || route.path === '/home') {
    const alreadyShown = sessionStorage.getItem('ascii_art_shown')
    if (!alreadyShown) {
      setTimeout(displayASCIIWelcome, 500)
    }
  }
})
</script>

<style lang="scss">
@use '@/assets/main.scss';

/* Import global cursor fix */
@use '@/assets/global-cursor-fix.css';

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