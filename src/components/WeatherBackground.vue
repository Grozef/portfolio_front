<template>
  <div class="weather-background">
    <div class="weather-overlay" :class="`weather-${weatherCondition}`"></div>
    <canvas 
      ref="canvasRef" 
      class="weather-canvas"
      role="presentation"
      aria-hidden="true"
    ></canvas>

    <div 
      v-if="isLoading"
      class="weather-info weather-loading"
      role="status"
      aria-live="polite"
    >
      <span class="weather-icon">⏳</span>
      <span class="weather-temp">Loading...</span>
    </div>

    <div 
      v-else-if="weatherLoaded && weatherData" 
      class="weather-info" 
      :class="[`weather-info-${weatherCondition}`, { 'chaos-mode': isChaosActive }]"
      @click="handleWeatherClick"
      data-cursor-hover
      role="button"
      tabindex="0"
      :aria-label="`Weather: ${weatherIcon} ${weatherCondition === 'eruption' ? '900' : weatherData.temp} degrees in ${weatherCondition === 'eruption' ? 'Eyjafjallajökull' : weatherData.city}. Click to change weather.`"
      @keydown.enter="handleWeatherClick"
      @keydown.space.prevent="handleWeatherClick"
    >
      <span class="weather-icon" aria-hidden="true">{{ weatherIcon }}</span>
      <span class="weather-temp">{{ weatherCondition === 'eruption' ? '900' : weatherData.temp }}°C</span>
      <span class="weather-city">{{ weatherCondition === 'eruption' ? 'Eyjafjallajökull' : weatherData.city }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useEasterEggs } from '@/composables/useEasterEggs'
import { fetchWeather } from '@/services/weather'
import { ParticleSystem } from '@/utils/ParticleSystem'

const { discoverEgg, EASTER_EGGS } = useEasterEggs()

const canvasRef = ref(null)
const weatherLoaded = ref(false)
const isLoading = ref(true)
const weatherData = ref(null)
const weatherIcon = ref('☀️')
const weatherCondition = ref('clear')

const clickCount = ref(0)
const isChaosActive = ref(false) 
let clickTimer = null
let particleSystem = null
let resizeObserver = null

const STANDARD_TYPES = ['clear', 'sunny_intervals', 'clouds', 'rain', 'heavy_rain', 'snow']
const CHAOS_TYPES = ['thunder', 'eruption']
const CACHE_KEY = 'weather_cache'
const CACHE_DURATION = 1800000

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

const getCachedWeather = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null
    
    const { data, timestamp } = JSON.parse(cached)
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(CACHE_KEY)
      return null
    }
    
    return data
  } catch (e) {
    console.error('Cache read error:', e)
    return null
  }
}

const setCachedWeather = (data) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now()
    }))
  } catch (e) {
    console.error('Cache write error:', e)
  }
}

const getRandomWeather = (currentWeather, pool) => {
  const availableWeathers = pool.filter(w => w !== currentWeather)
  const randomIndex = Math.floor(Math.random() * availableWeathers.length)
  return availableWeathers[randomIndex]
}

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
  const nextType = getRandomWeather(weatherCondition.value, pool)
  applyWeatherState(nextType)
}

const applyWeatherState = (type) => {
  weatherCondition.value = type
  weatherIcon.value = WEATHER_METADATA[type].icon
  
  if (particleSystem) {
    particleSystem.stop()
    particleSystem = null
  }
  
  if (WEATHER_METADATA[type].effect) {
    initWeatherEffects(WEATHER_METADATA[type].effect)
  } else {
    clearCanvas()
  }
}

const initWeatherEffects = (type) => {
  const canvas = canvasRef.value
  if (!canvas) return
  
  try {
    particleSystem = new ParticleSystem(canvas, type, weatherCondition)
    particleSystem.start()
  } catch (e) {
    console.error('Particle system initialization failed:', e)
    clearCanvas()
  }
}

const clearCanvas = () => {
  if (canvasRef.value) {
    const ctx = canvasRef.value.getContext('2d')
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
    }
  }
}

const handleResize = () => {
  if (canvasRef.value) {
    canvasRef.value.width = window.innerWidth
    canvasRef.value.height = window.innerHeight
    
    if (particleSystem) {
      particleSystem.handleResize()
    }
  }
}

const initWeather = async () => {
  isLoading.value = true
  
  try {
    const cached = getCachedWeather()
    let data
    
    if (cached) {
      data = cached
    } else {
      data = await fetchWeather()
      setCachedWeather(data)
    }

    const mainCondition = data.weather[0].main.toLowerCase()
    const description = data.weather[0].description.toLowerCase()
    const weatherId = data.weather[0].id

    let type = 'clear'

    if (mainCondition.includes('thunderstorm')) {
      type = 'thunder'
      isChaosActive.value = true
    } else if (weatherId === 762 || mainCondition.includes('ash')) {
      type = 'eruption'
      isChaosActive.value = true
    } else if (weatherId >= 502 && weatherId <= 504) {
      type = 'heavy_rain'
    } else if (mainCondition.includes('rain') || mainCondition.includes('drizzle')) {
      type = 'rain'
    } else if (mainCondition.includes('snow')) {
      type = 'snow'
    } else if (description.includes('few clouds')) {
      type = 'sunny_intervals'
    } else if (mainCondition.includes('cloud')) {
      type = 'clouds'
    }

    weatherData.value = { 
      temp: Math.round(data.main.temp), 
      city: data.name 
    }
    weatherLoaded.value = true
    applyWeatherState(type)
  } catch (e) {
    console.error('Weather Error:', e)
    weatherLoaded.value = true
    applyWeatherState('clear')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (canvasRef.value) {
    canvasRef.value.width = window.innerWidth
    canvasRef.value.height = window.innerHeight
    
    resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(document.body)
  }
  
  initWeather()
})

onUnmounted(() => {
  if (particleSystem) {
    particleSystem.stop()
  }
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
  clearTimeout(clickTimer)
})
</script>

<style src="@/assets/styles/componentsScss/weather-background.scss" lang="scss" scoped></style>