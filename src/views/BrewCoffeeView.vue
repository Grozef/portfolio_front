<template>
  <div class="teapot-container">
    <h1>418 - I'm a teapot</h1>
    <div class="teapot-icon">🫖</div>
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
    await axios.get('/api/v1/teapot-check')
  } catch (error) {
    if (error.response?.status === 418) {
      console.log(error.response?.status,"Backend confirmed: It's a teapot world.")
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
  height: 100vh;
  text-align: center;
  background: #1a1a1a;
  color: #c9a227;
}
.teapot-icon {
  font-size: 8rem;
  animation: tilt 2s infinite ease-in-out;
}

.back-home {
  margin-top: 2rem;
  padding: 12px 24px;
  color: #c9a227;
  text-decoration: none;
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;
  border: 1px solid rgba(201, 162, 39, 0.3);
  border-radius: 4px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.back-home .arrow {
  display: inline-block;
  transition: transform 0.3s ease;
  margin-right: 8px;
}

.back-home:hover {
  background: rgba(201, 162, 39, 0.1);
  border-color: #c9a227;
  color: #fff;
  box-shadow: 0 0 20px rgba(201, 162, 39, 0.2);
  transform: translateY(-2px);
}

.back-home:hover .arrow {
  transform: translateX(-5px); 
}

.back-home:active {
  transform: translateY(0);
  box-shadow: 0 0 10px rgba(201, 162, 39, 0.5);
}

@keyframes tilt {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(15deg); }
}
</style>