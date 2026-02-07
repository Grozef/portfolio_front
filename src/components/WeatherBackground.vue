<template>
  <div class="weather-background">
    <div class="weather-overlay" :class="`weather-${weatherCondition}`"></div>
    <canvas ref="canvasRef" class="weather-canvas"></canvas>

    <div 
      v-if="weatherLoaded && weatherData" 
      class="weather-info" 
      :class="[`weather-info-${weatherCondition}`, { 'chaos-mode': isChaosActive }]"
      @click="handleWeatherClick"
      data-cursor-hover
    >
      <span class="weather-icon">{{ weatherIcon }}</span>
      <span class="weather-temp">{{ weatherCondition === 'eruption' ? '900' : weatherData.temp }}°C</span>
      <span class="weather-city">{{ weatherCondition === 'eruption' ? 'Eyjafjallajökull' : weatherData.city }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useEasterEggs } from '@/composables/useEasterEggs'

const { discoverEgg, EASTER_EGGS } = useEasterEggs()

const canvasRef = ref(null)
const weatherLoaded = ref(false)
const weatherData = ref(null)
const weatherIcon = ref('☀️')
const weatherCondition = ref('clear')

// --- Interaction Logic ---
const clickCount = ref(0)
const isChaosActive = ref(false) 
let clickTimer = null
let animationFrameId = null
let particles = []

const WEATHER_API_KEY = '9a971ce1dc8fe614aa09980420e4c0a6'
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather'

const STANDARD_TYPES = ['clear', 'sunny_intervals', 'clouds', 'rain', 'heavy_rain', 'snow']
const CHAOS_TYPES = ['thunder', 'eruption']

const WEATHER_METADATA = {
  clear: { icon: '☀️', effect: null },
  sunny_intervals: { icon: '⛅', effect: null },
  clouds: { icon: '☁️', effect: null },
  rain: { icon: '🌧️', effect: 'rain' },
  heavy_rain: { icon: '🌧️🌧️', effect: 'heavy_rain' },
  snow: { icon: '❄️', effect: 'snow' },
  thunder: { icon: '⛈️', effect: 'heavy_rain' },
  eruption: { icon: '🌋', effect: 'ash' }
}

class Particle {
  constructor(canvas, type = 'rain') {
    this.canvas = canvas
    this.type = type
    this.reset()
  }
  reset() {
    this.x = Math.random() * this.canvas.width
    this.y = Math.random() * this.canvas.height - this.canvas.height
    this.opacity = Math.random() * 0.5 + 0.5
    this.size = Math.random() * 2 + 1
    if (this.type === 'rain' || this.type === 'heavy_rain') {
      this.speed = this.type === 'heavy_rain' ? 15 : 8
      this.wind = this.type === 'heavy_rain' ? 3 : 1
    } else if (this.type === 'snow') {
      this.speed = Math.random() * 2 + 1
      this.size = Math.random() * 3 + 2
    } else if (this.type === 'ash') {
      this.speed = Math.random() * 1.5 + 0.5
      this.color = Math.random() > 0.5 ? '#444' : '#ff4500'
    }
  }
  update() {
    this.y += this.speed
    if (this.type === 'snow') this.x += Math.sin(this.y * 0.01) * 2
    if (this.type === 'ash') this.x += Math.cos(this.y * 0.02) * 3
    if (this.y > this.canvas.height) this.reset()
  }
  draw(ctx) {
    ctx.save()
    ctx.globalAlpha = this.opacity
    if (this.type === 'rain' || this.type === 'heavy_rain') {
      ctx.strokeStyle = '#4a9eff'; ctx.lineWidth = this.type === 'heavy_rain' ? 2 : 1
      ctx.beginPath(); ctx.moveTo(this.x, this.y); ctx.lineTo(this.x + 2, this.y + 10); ctx.stroke()
    } else if (this.type === 'snow' || this.type === 'ash') {
      ctx.fillStyle = this.type === 'snow' ? '#ffffff' : this.color
      ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill()
    }
    ctx.restore()
  }
}

/**
 * CLICK HANDLER
 */
const handleWeatherClick = () => {
  clickCount.value++
  clearTimeout(clickTimer)
  clickTimer = setTimeout(() => { clickCount.value = 0 }, 3000)

  if (clickCount.value === 15) {
    isChaosActive.value = true
    applyWeatherState('thunder')
    discoverEgg(EASTER_EGGS.WEATHER_BACKGROUND)
  } else if (clickCount.value === 25) {
    isChaosActive.value = false
    clickCount.value = 0
    applyWeatherState('clear')
  } else {
    toggleWeather()
  }
}

const toggleWeather = () => {
  const pool = isChaosActive.value ? [...STANDARD_TYPES, ...CHAOS_TYPES] : STANDARD_TYPES
  const currentIndex = pool.indexOf(weatherCondition.value)
  const nextType = pool[(currentIndex + 1) % pool.length]
  applyWeatherState(nextType)
}

const applyWeatherState = (type) => {
  weatherCondition.value = type
  weatherIcon.value = WEATHER_METADATA[type].icon
  stopAnimation()
  if (WEATHER_METADATA[type].effect) initWeatherEffects(WEATHER_METADATA[type].effect)
  else clearCanvas()
}

const initWeatherEffects = (type) => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  particles = []
  const count = type === 'heavy_rain' ? 250 : 150
  for (let i = 0; i < count; i++) particles.push(new Particle(canvas, type))
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (weatherCondition.value === 'thunder' && Math.random() > 0.985) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'; ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
    particles.forEach(p => { p.update(); p.draw(ctx) })
    animationFrameId = requestAnimationFrame(animate)
  }
  animate()
}

const clearCanvas = () => { if (canvasRef.value) canvasRef.value.getContext('2d').clearRect(0, 0, canvasRef.value.width, canvasRef.value.height) }
const stopAnimation = () => { if (animationFrameId) cancelAnimationFrame(animationFrameId) }

/**
 * NEW: Granular Weather Mapping
 */
const initWeather = async () => {
  try {
    const res = await fetch(`${WEATHER_API_URL}?lat=48.85&lon=2.35&appid=${WEATHER_API_KEY}&units=metric`)
    const data = await res.json()
    const mainCondition = data.weather[0].main.toLowerCase()
    const description = data.weather[0].description.toLowerCase()
    const weatherId = data.weather[0].id // Precise condition codes

    let type = 'clear'

    // 1. Check for Chaos (Thunderstorm or Ash/Volcanic)
    if (mainCondition.includes('thunderstorm')) {
      type = 'thunder'
      isChaosActive.value = true // Allow cycling if it's already a storm
    } else if (weatherId === 762 || mainCondition.includes('ash')) {
      type = 'eruption'
      isChaosActive.value = true
    } 
    // 2. Check for Heavy Rain
    else if (weatherId >= 502 && weatherId <= 504) {
      type = 'heavy_rain'
    } 
    // 3. Standard checks
    else if (mainCondition.includes('rain') || mainCondition.includes('drizzle')) {
      type = 'rain'
    } else if (mainCondition.includes('snow')) {
      type = 'snow'
    } else if (description.includes('few clouds')) {
      type = 'sunny_intervals'
    } else if (mainCondition.includes('cloud')) {
      type = 'clouds'
    }

    weatherData.value = { temp: Math.round(data.main.temp), city: data.name }
    weatherLoaded.value = true
    applyWeatherState(type)

  } catch (e) { 
    weatherLoaded.value = true; 
    applyWeatherState('clear') 
  }
}

onMounted(() => {
  if (canvasRef.value) { canvasRef.value.width = window.innerWidth; canvasRef.value.height = window.innerHeight }
  initWeather()
})
onUnmounted(() => stopAnimation())
</script>

<style lang="scss" scoped>
.weather-background { position: fixed; inset: 0; pointer-events: none; z-index: 1000; }
.weather-overlay, .weather-canvas { position: absolute; inset: 0; pointer-events: none; z-index: -1; }

.weather-overlay {
  transition: background 1.5s ease;
  &.weather-clear { background: rgba(74, 158, 255, 0.05); }
  &.weather-sunny_intervals { background: rgba(255, 220, 100, 0.08); }
  &.weather-clouds { background: rgba(100, 110, 125, 0.15); }
  &.weather-rain { background: rgba(30, 40, 60, 0.35); }
  &.weather-heavy_rain { background: rgba(15, 20, 35, 0.6); }
  &.weather-snow { background: rgba(200, 210, 225, 0.2); }
  &.weather-thunder { background: rgba(10, 10, 25, 0.85); }
  &.weather-eruption { background: linear-gradient(0deg, rgba(255, 50, 0, 0.4) 0%, rgba(10, 5, 0, 0.9) 100%); }
}

.weather-info {
  position: fixed; top: 6rem; right: 2rem;
  display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1.25rem;
  background: rgba(17, 17, 19, 0.85); border: 1px solid var(--terminal-border); border-radius: 8px;
  backdrop-filter: blur(10px); color: var(--terminal-text); font-family: var(--font-mono);
  pointer-events: auto; cursor: pointer; z-index: 1001; transition: all 0.3s ease;

  &:hover { transform: scale(1.05); border-color: var(--terminal-accent); }
  &.chaos-mode { border-color: #ff4500; }
}

.weather-icon { font-size: 1.5rem; }
.weather-temp { font-weight: 600; color: var(--terminal-accent); }
.weather-city { color: var(--terminal-text-dim); }
</style>