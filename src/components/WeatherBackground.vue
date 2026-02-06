<template>
  <div class="weather-background">
    <div class="weather-overlay" :class="`weather-${weatherCondition}`"></div>
    <canvas ref="canvasRef" class="weather-canvas"></canvas>

    <div 
      v-if="weatherLoaded && weatherData" 
      class="weather-info" 
      :class="`weather-info-${weatherCondition}`"
      @click="handleWeatherClick"
      data-cursor-hover
    >
      <span class="weather-icon">{{ weatherIcon }}</span>
      <span class="weather-temp">{{ weatherData.temp }}°C</span>
      <span class="weather-city">{{ weatherData.city }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useEasterEggs } from '@/composables/useEasterEggs'

const { discoverEgg, EASTER_EGGS, isDiscovered } = useEasterEggs()

const canvasRef = ref(null)
const weatherLoaded = ref(false)
const weatherData = ref(null)
const weatherIcon = ref('☀️')
const weatherCondition = ref('clear')

// --- Interaction State ---
const clickCount = ref(0)
let clickTimer = null

let animationFrameId = null
let particles = []

// API Configuration
const WEATHER_API_KEY = '9a971ce1dc8fe614aa09980420e4c0a6'
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather'

// Weather States Configuration
const WEATHER_TYPES = ['clear', 'rain', 'snow', 'clouds']
const WEATHER_METADATA = {
  clear: { icon: '☀️', effect: null },
  rain: { icon: '🌧️', effect: 'rain' },
  snow: { icon: '❄️', effect: 'snow' },
  clouds: { icon: '☁️', effect: null },
  thunder: { icon: '⛈️', effect: 'rain' }
}

const FALLBACK_LOCATION = {
  lat: 48.8566,
  lon: 2.3522,
  city: 'Paris'
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
    this.speed = this.type === 'rain' ? Math.random() * 5 + 7 : Math.random() * 2 + 1
    this.size = this.type === 'rain' ? Math.random() * 2 + 1 : Math.random() * 3 + 2
    this.opacity = Math.random() * 0.5 + 0.5
    this.wind = this.type === 'rain' ? Math.random() * 4 - 2 : 0
  }

  update() {
    if (this.type === 'rain') {
      this.y += this.speed
      this.x += this.wind
    } else if (this.type === 'snow') {
      this.y += this.speed
      this.x += Math.sin(this.y * 0.01) * 2
    }
    if (this.y > this.canvas.height) this.reset()
  }

  draw(ctx) {
    ctx.save()
    ctx.globalAlpha = this.opacity
    if (this.type === 'rain') {
      ctx.strokeStyle = '#4a9eff'
      ctx.lineWidth = this.size
      ctx.beginPath()
      ctx.moveTo(this.x, this.y)
      ctx.lineTo(this.x + this.wind, this.y + 12)
      ctx.stroke()
    } else if (this.type === 'snow') {
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()
  }
}

/**
 * CLICK HANDLER
 * Cycles through weather and detects secret 10-click trigger for Thunder
 */
const handleWeatherClick = () => {
  clickCount.value++
  
  // Reset clicks if user stops for 2 seconds
  clearTimeout(clickTimer)
  clickTimer = setTimeout(() => { clickCount.value = 0 }, 2000)

  // 10 clicks = Secret Thunderstorm
  if (clickCount.value >= 10 && weatherCondition.value !== 'thunder') {
    applyWeatherState('thunder')
    console.log("⚡ Storm unleashed!")
  } else {
    toggleWeather()
  }
}

const toggleWeather = () => {
  const currentIndex = WEATHER_TYPES.indexOf(weatherCondition.value)
  const nextIndex = (currentIndex + 1) % WEATHER_TYPES.length
  applyWeatherState(WEATHER_TYPES[nextIndex])
}

const applyWeatherState = (type) => {
  weatherCondition.value = type
  weatherIcon.value = WEATHER_METADATA[type].icon
  
  stopAnimation()
  if (WEATHER_METADATA[type].effect) {
    initWeatherEffects(WEATHER_METADATA[type].effect)
  } else {
    clearCanvas()
  }
}

const clearCanvas = () => {
  const canvas = canvasRef.value
  if (canvas) {
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }
}

const stopAnimation = () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
}

/**
 * ANIMATION LOGIC
 * Includes lightning flash logic for thunder mode
 */
const initWeatherEffects = (forcedType = null) => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  particles = []
  
  const type = forcedType || (weatherCondition.value === 'rain' ? 'rain' : 'snow')
  const count = type === 'rain' ? 200 : 100
  
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(canvas, type))
  }
  
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Lightning flashes (1.5% chance per frame)
    if (weatherCondition.value === 'thunder') {
      if (Math.random() > 0.985) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
    }

    particles.forEach(p => { p.update(); p.draw(ctx) })
    animationFrameId = requestAnimationFrame(animate)
  }
  animate()
}

/* --- LEGACY INITIALIZATION (Reference) ---
const initWeatherEffectsOld = (condition) => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  particles = []
  let particleType = 'rain'
  let particleCount = 100
  if (condition.includes('rain')) {
    particleType = 'rain'
    particleCount = 150
  } else if (condition.includes('snow')) {
    particleType = 'snow'
    particleCount = 100
  } else { return }
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(canvas, particleType))
  }
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    particles.forEach(particle => {
      particle.update()
      particle.draw(ctx)
    })
    animationFrameId = requestAnimationFrame(animate)
  }
  animate()
}
------------------------------------------ */

const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('No Geo'))
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => reject(err),
      { timeout: 10000 }
    )
  })
}

const fetchWeather = async (lat, lon, city = null) => {
  try {
    const res = await fetch(`${WEATHER_API_URL}?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`)
    if (!res.ok) throw new Error('API Error')
    const data = await res.json()
    const condition = data.weather[0].main.toLowerCase()
    
    if (condition.includes('rain')) weatherCondition.value = 'rain'
    else if (condition.includes('snow')) weatherCondition.value = 'snow'
    else if (condition.includes('cloud')) weatherCondition.value = 'clouds'
    else weatherCondition.value = 'clear'

    weatherIcon.value = WEATHER_METADATA[weatherCondition.value].icon
    return { temp: Math.round(data.main.temp), city: city || data.name, condition }
  } catch (error) {
    return null
  }
}

const resizeCanvas = () => {
  if (canvasRef.value) {
    canvasRef.value.width = window.innerWidth
    canvasRef.value.height = window.innerHeight
  }
}

const initWeather = async () => {
  try {
    let loc; try { loc = await getUserLocation() } catch { loc = FALLBACK_LOCATION }
    const weather = await fetchWeather(loc.lat, loc.lon, loc.city)
    if (weather) {
      weatherData.value = weather; weatherLoaded.value = true
      const effect = WEATHER_METADATA[weatherCondition.value].effect
      if (effect) initWeatherEffects(effect)
      if (!isDiscovered(EASTER_EGGS.WEATHER_BACKGROUND)) {
        setTimeout(() => discoverEgg(EASTER_EGGS.WEATHER_BACKGROUND), 2000)
      }
    }
  } catch (e) {
    weatherData.value = { temp: 20, city: 'Unknown', condition: 'clear' }; weatherLoaded.value = true
  }
}

onMounted(() => {
  resizeCanvas(); window.addEventListener('resize', resizeCanvas); initWeather()
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas); stopAnimation()
})
</script>

<style lang="scss" scoped>
.weather-background {
  position: fixed;
  inset: 0;
  pointer-events: none; // Parent is "invisible" to clicks...
  z-index: 1000;
}

.weather-overlay,
.weather-canvas {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: -1; // ...so these stay behind your content
}

.weather-overlay {
  transition: background 1.5s ease;
  &.weather-rain { background: linear-gradient(180deg, rgba(30, 40, 60, 0.4) 0%, rgba(10, 15, 25, 0.6) 100%); }
  &.weather-snow { background: linear-gradient(180deg, rgba(200, 210, 220, 0.2) 0%, rgba(150, 160, 170, 0.3) 100%); }
  &.weather-clear { background: linear-gradient(180deg, rgba(74, 158, 255, 0.1) 0%, rgba(30, 50, 90, 0.2) 100%); }
  &.weather-clouds { background: linear-gradient(180deg, rgba(100, 100, 110, 0.2) 0%, rgba(40, 40, 50, 0.4) 100%); }
  &.weather-thunder { background: radial-gradient(circle at center, rgba(15, 15, 25, 0.85) 0%, rgba(5, 5, 10, 0.95) 100%); }
}

.weather-canvas { opacity: 0.6; }

.weather-info {
  position: fixed;
  top: 6rem;
  right: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  background: rgba(17, 17, 19, 0.85);
  border: 1px solid var(--terminal-border);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  color: var(--terminal-text);
  font-family: var(--font-mono);
  font-size: 0.875rem;
  
  /* CRITICAL: Enable clicks on the widget specifically */
  pointer-events: auto; 
  cursor: pointer;
  z-index: 1001; 
  user-select: none;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &:hover {
    transform: scale(1.08);
    border-color: var(--terminal-accent);
    box-shadow: 0 0 20px rgba(201, 162, 39, 0.15);
  }

  &:active { transform: scale(0.92); }

  &.weather-info-thunder {
    border-color: #00ffff;
    background: rgba(10, 10, 20, 0.95);
    animation: shake 0.1s infinite alternate;
  }
}

@keyframes shake { from { transform: translate(1px, 1px); } to { transform: translate(-1px, -1px); } }

.weather-icon { font-size: 1.5rem; }
.weather-temp { font-weight: 600; color: var(--terminal-accent); }
.weather-city { color: var(--terminal-text-dim); }

/* --- OLD STYLES (Reference) ---
.weather-info-clear {
  background: linear-gradient(135deg, rgba(74, 158, 255, 0.9), rgba(30, 50, 90, 0.9));
}
------------------------------- */
</style>