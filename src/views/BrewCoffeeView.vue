<template>
  <div class="teapot-container">
    <h1>418 - I'm a teapot</h1>
    
    <div class="teapot-wrapper">
      <div class="steam-container">
        <svg class="steam-svg" viewBox="0 0 40 60" fill="none">
          <path class="steam-path s1" d="M20 50 Q10 35 20 25 T20 0" stroke="currentColor" stroke-width="2" />
          <path class="steam-path s2" d="M30 55 Q20 40 30 30 T30 5" stroke="currentColor" stroke-width="2" opacity="0.6" />
        </svg>
      </div>

      <svg class="teapot-svg" viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M60 50C48 50 42 62 42 78C42 105 58 118 80 118C102 118 118 105 118 78C118 62 112 50 100 50H60Z" 
          stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"
        />
        
        <path d="M52 50C52 38 65 32 80 32C95 32 108 38 108 50" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" />
        <path d="M76 26C76 22 84 22 84 26L80 32L76 26Z" fill="currentColor" />

        <path 
          d="M42 85C22 85 12 70 16 40C17 34 23 32 28 38L33 44C26 52 26 78 42 82" 
          stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
        />

        <path 
          d="M118 65C140 65 152 80 152 95C152 112 140 120 118 110" 
          stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
        />

        <path d="M68 118L70 125H90L92 118" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
      </svg>
    </div>

    <p>You tried to brew coffee, but I am legally a teapot.</p>

    <router-link to="/" class="back-home">
      <span class="arrow">←</span> Return to safety
    </router-link>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import axios from 'axios'
import { useEasterEggs } from '@/composables/useEasterEggs'

const { discoverEgg, EASTER_EGGS } = useEasterEggs()

onMounted(async () => {
  try {
    // Handshake with backend to trigger easter egg logic
    await axios.get('/api/v1/teapot-check')
  } catch (error) {
    if (error.response?.status === 418) {
      discoverEgg(EASTER_EGGS.TEA_POT)
    }
  }
})
</script>

<style scoped>
.teapot-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  background: #121212;
  color: #c9a227;
  font-family: 'Georgia', serif;
  padding: 2rem;
}

h1 {
  font-size: 3.2rem;
  font-weight: 300;
  margin-bottom: 0.5rem;
  letter-spacing: -1px;
}

p {
  font-size: 1.15rem;
  margin-top: 1rem;
  opacity: 0.8;
}

.teapot-wrapper {
  position: relative;
  margin: 4rem 0;
  display: flex;
  justify-content: center;
}

.teapot-svg {
  width: 320px;
  height: 320px;
  color: #c9a227;
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.8));
  animation: float-sway 6s ease-in-out infinite;
}

/* Steam positioned at the spout tip (left side) */
.steam-container {
  position: absolute;
  top: 30px; 
  left: 40px;
  width: 40px;
  pointer-events: none;
}

.steam-path {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: steam-flow 3s linear infinite;
}

.s2 { animation-delay: 1.5s; }

.back-home {
  margin-top: 2rem;
  padding: 14px 42px;
  color: #c9a227;
  text-decoration: none;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 3px;
  border: 1px solid rgba(201, 162, 39, 0.4);
  transition: all 0.3s ease;
}

.back-home:hover {
  background: rgba(201, 162, 39, 0.1);
  box-shadow: 0 0 25px rgba(201, 162, 39, 0.3);
  transform: translateY(-3px);
}

.back-home .arrow {
  display: inline-block;
  transition: transform 0.3s ease;
  margin-right: 12px;
}

.back-home:hover .arrow {
  transform: translateX(-6px);
}

@keyframes float-sway {
  0%, 100% { transform: translateY(0) rotate(-1deg); }
  50% { transform: translateY(-15px) rotate(1deg); }
}

@keyframes steam-flow {
  0% { stroke-dashoffset: 100; opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { stroke-dashoffset: 0; opacity: 0; }
}
</style>