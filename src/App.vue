<template>
  <div id="app">
    <CustomCursor v-if="!isMobile" />
    <GrainOverlay />
    <ExtremeDarkMode />

    <DarkModeToggle />

    <KonamiAnimationGradius :show="showKonami" @close="showKonami = false" />

    <MasterEasterEgg :show="showMasterEgg" :discovered-eggs="discoveredEggs" :total-eggs="totalEggs"
      @close="showMasterEgg = false" />

    <router-view />

    <SwordCursor />

    <GrandCompletionAnimation :show="showGrandCompletion" :totalEggs="totalEggs"
      :discoveryStartTime="discoveryStartTime" @close="showGrandCompletion = false" />

    <FooterComponent />
    <!-- <button @click="triggerTestFinal"
      style="position: fixed; top: 10px; left: 10px; z-index: 999999; padding: 10px; background: red; color: white; border: none; border-radius: 4px; font-weight: bold;">
       TEST FULL COMPLETION
    </button> -->

    <CookieBanner />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import CustomCursor from '@/components/CustomCursor.vue'
import GrainOverlay from '@/components/GrainOverlay.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import CookieBanner from '@/components/CookieBanner.vue'
import ExtremeDarkMode from '@/components/ExtremeDarkMode.vue'
import MasterEasterEgg from '@/components/MasterEasterEgg.vue'
import DarkModeToggle from '@/components/DarkModeToggle.vue'
import KonamiAnimationGradius from '@/components/KonamiAnimationGradius.vue'
import { useVimQuit } from '@/composables/useVimQuit'
import { useKonamiCode } from '@/composables/useKonamiCode'
import { useEasterEggs } from '@/composables/useEasterEggs'
import { useAdBlockDetector } from '@/composables/useAdBlockDetector'
import { useSwordCursor } from '@/composables/useSwordCursor'
import SwordCursor from '@/components/SwordCursor.vue'
import GrandCompletionAnimation from '@/components/GrandCompletionAnimation.vue'

const route = useRoute()
const isMobile = ref(false)
const showMasterEgg = ref(false)
const showKonami = ref(false)
const showGrandCompletion = ref(false)
const discoveryStartTime = ref(Date.now())

const totalEggs = 20

const { allEggsDiscovered, discoveredEggs, masterEggTriggered, discoverEgg, EASTER_EGGS } = useEasterEggs()

// Testing function to trigger the final grand completion and master egg immediately
// const triggerTestFinal = () => {
//   discoveryStartTime.value = Date.now() - 1000 * 60 * 15 
//   showGrandCompletion.value = true
//   setTimeout(() => {
//     showMasterEgg.value = true
//   }, 300)
// }

useVimQuit()

useKonamiCode(() => {
  showKonami.value = true
  discoverEgg(EASTER_EGGS.KONAMI_CODE)
  console.log('%cKONAMI CODE ACTIVATED!', 'color: #c9a227; font-size: 20px; font-weight: bold;')
  setTimeout(() => { showKonami.value = false }, 5000)
})

useAdBlockDetector()

const { checkRouteAndDeactivate } = useSwordCursor()
watch(() => route.path, (newPath) => {
  checkRouteAndDeactivate(newPath)
})

const asciiArtShown = ref(false)

const displayASCIIWelcome = () => {
  if (asciiArtShown.value) return

  const asciiArt = `
 ╔════════════════════════════════════════════════════════╗
 ║                                                        ║
 ║              Welcome to François's Portfolio           ║
 ║                                                        ║
 ║                   ___________________                  ║
 ║                   |  _____________  |                  ║
 ║                   | |             | |                  ║
 ║                   | |   > _       | |                  ║
 ║                   | |             | |                  ║
 ║                   | |_____________| |                  ║
 ║                   |_________________|                  ║
 ║                        |  |_| | |                      ║
 ║                     ___|________|___                   ║
 ║                    |________________|                  ║
 ║                                                        ║
 ║              Type 'help' to get started                ║
 ║                                                        ║
 ║           Hint: ${totalEggs} easter eggs are hidden              ║
 ║                  Can you find them all?                ║
 ║                                                        ║
 ╚════════════════════════════════════════════════════════╝
  `

  console.log('%c' + asciiArt, 'color: #c9a227; font-family: monospace; font-size: 12px; line-height: 1.2;')
  console.log('%cEaster Egg Discovered: ASCII Art Console Welcome', 'color: #27ca40; font-weight: bold; font-size: 14px;')
  console.log('%cDo you know what the コナミコマンド  is ?', 'color: #ffa500; font-size: 12px;')

  discoverEgg(EASTER_EGGS.ASCII_ART)

  asciiArtShown.value = true
}

watch(() => route.path, (newPath) => {
  if (newPath === '/' || newPath === '/home') {
    nextTick(() => {
      setTimeout(() => {
        displayASCIIWelcome()
      }, 300)
    })
  }
}, { immediate: true })

watch(allEggsDiscovered, (allDiscovered) => {
  if (allDiscovered && !masterEggTriggered.value) {
    console.log('%cALL EASTER EGGS DISCOVERED!', 'color: #c9a227; font-weight: bold; font-size: 18px;')
    console.log('%cTriggering Master Egg...', 'color: #4a9eff; font-size: 14px;')
    setTimeout(() => {
      showGrandCompletion.value = true
      showMasterEgg.value = true
      discoverEgg(EASTER_EGGS.MASTER_EGG)
    }, 500)
  }
}, { immediate: true })

onMounted(() => {
  isMobile.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )

  if (route.path === '/' || route.path === '/home') {
    nextTick(() => {
      setTimeout(() => {
        displayASCIIWelcome()
      }, 300)
    })
  }
})
</script>

<style lang="scss">
@use '@/assets/main.scss';
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

*,
*::before,
*::after {
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