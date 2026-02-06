<template>
  <div class="weather-background">
    <div class="weather-overlay" :class="`weather-${weatherCondition}`"></div>
    <canvas ref="canvasRef" class="weather-canvas"></canvas>
    <div v-if="weatherLoaded && weatherData" class="weather-info" :class="`weather-info-${weatherCondition}`">
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

let animationFrameId = null
let particles = []

const WEATHER_API_KEY = '9a971ce1dc8fe614aa09980420e4c0a6'
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather'

// Fallback location: Paris, France
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
    this.speed = this.type === 'rain' ? Math.random() * 5 + 5 : Math.random() * 2 + 1
    this.size = this.type === 'rain' ? Math.random() * 2 + 1 : Math.random() * 3 + 2
    this.opacity = Math.random() * 0.5 + 0.5
    this.wind = this.type === 'rain' ? Math.random() * 2 - 1 : 0
  }

  update() {
    if (this.type === 'rain') {
      this.y += this.speed
      this.x += this.wind
    } else if (this.type === 'snow') {
      this.y += this.speed
      this.x += Math.sin(this.y * 0.01) * 2
    }

    if (this.y > this.canvas.height) {
      this.reset()
    }
  }

  draw(ctx) {
    ctx.save()
    ctx.globalAlpha = this.opacity

    if (this.type === 'rain') {
      ctx.strokeStyle = '#4a9eff'
      ctx.lineWidth = this.size
      ctx.beginPath()
      ctx.moveTo(this.x, this.y)
      ctx.lineTo(this.x + this.wind, this.y + 10)
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

const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        })
      },
      (error) => {
        reject(error)
      },
      { timeout: 10000 }
    )
  })
}

const fetchWeather = async (lat, lon, city = null) => {
  try {
    const response = await fetch(
      `${WEATHER_API_URL}?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    )
    
    if (!response.ok) throw new Error('Weather fetch failed')
    
    const data = await response.json()
    
    const condition = data.weather[0].main.toLowerCase()
    let icon = '☀️'
    
    if (condition.includes('rain')) icon = '🌧️'
    else if (condition.includes('snow')) icon = '❄️'
    else if (condition.includes('cloud')) icon = '☁️'
    else if (condition.includes('clear')) icon = '☀️'
    else if (condition.includes('thunder')) icon = '⛈️'
    
    weatherIcon.value = icon
    weatherCondition.value = condition.includes('rain') ? 'rain' : 
                            condition.includes('snow') ? 'snow' : 'clear'
    
    return {
      temp: Math.round(data.main.temp),
      city: city || data.name,
      condition: condition
    }
  } catch (error) {
    console.error('Weather API error:', error)
    return null
  }
}

const resizeCanvas = () => {
  const canvas = canvasRef.value
  if (canvas) {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
}

const initWeatherEffects = (condition) => {
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
  } else {
    return
  }
  
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

const initWeather = async () => {
  try {
    let location
    try {
      location = await getUserLocation()
    } catch (geoError) {
      console.warn('Geolocation denied or unavailable, using fallback location:', geoError.message)
      location = FALLBACK_LOCATION
    }
    
    const weather = await fetchWeather(location.lat, location.lon, location.city)
    
    if (weather) {
      weatherData.value = weather
      weatherLoaded.value = true
      
      initWeatherEffects(weather.condition)
      
      if (!isDiscovered(EASTER_EGGS.WEATHER_BACKGROUND)) {
        setTimeout(() => {
          discoverEgg(EASTER_EGGS.WEATHER_BACKGROUND, {
            city: weather.city,
            condition: weather.condition,
            temp: weather.temp
          })
        }, 2000)
      }
    }
  } catch (error) {
    console.error('Weather initialization failed:', error)
    
    weatherData.value = {
      temp: 20,
      city: 'Unknown',
      condition: 'clear'
    }
    weatherLoaded.value = true
    weatherIcon.value = '☀️'
    weatherCondition.value = 'clear'
  }
}

onMounted(() => {
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  initWeather()
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas)
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<style lang="scss" scoped>
.weather-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}

.weather-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: background 1s ease;
  
  &.weather-rain {
    background: linear-gradient(180deg, 
      rgba(70, 85, 110, 0.3) 0%, 
      rgba(40, 50, 70, 0.4) 100%);
  }
  
  &.weather-snow {
    background: linear-gradient(180deg, 
      rgba(200, 210, 220, 0.2) 0%, 
      rgba(180, 190, 200, 0.3) 100%);
  }
  
  &.weather-clear {
    background: linear-gradient(180deg, 
      rgba(30, 50, 90, 0.1) 0%, 
      rgba(20, 30, 50, 0.15) 100%);
  }
}

.weather-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.4;
}

.weather-info {
  position: fixed;
  top: 6rem;
  right: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  background: rgba(17, 17, 19, 0.9);
  border: 1px solid var(--terminal-border);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--terminal-text);
  animation: fadeIn 0.5s ease;
  pointer-events: auto;
  
  @media (max-width: 768px) {
    top: 5rem;
    right: 1rem;
    font-size: 0.75rem;
    padding: 0.5rem 1rem;
  }
}

.weather-icon {
  font-size: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
}

.weather-temp {
  font-weight: 600;
  color: var(--terminal-accent);
}

.weather-city {
  color: var(--terminal-text-dim);
}


/* Weather-specific widget backgrounds */
.weather-info.weather-info-rain {
  background: linear-gradient(135deg, rgba(70, 85, 110, 0.95), rgba(40, 50, 70, 0.95));
  border-color: rgba(74, 158, 255, 0.5);
  box-shadow: 0 4px 20px rgba(74, 158, 255, 0.2);
}

.weather-info.weather-info-snow {
  background: linear-gradient(135deg, rgba(200, 210, 220, 0.95), rgba(180, 190, 200, 0.95));
  border-color: rgba(255, 255, 255, 0.5);
  color: #1a1a1a;
  box-shadow: 0 4px 20px rgba(255, 255, 255, 0.2);
}

.weather-info.weather-info-snow .weather-temp {
  color: #4a9eff;
}

.weather-info.weather-info-snow .weather-city {
  color: #666;
}

.weather-info.weather-info-clear {
  background: linear-gradient(135deg, rgba(74, 158, 255, 0.9), rgba(30, 50, 90, 0.9));
  border-color: rgba(201, 162, 39, 0.5);
  box-shadow: 0 4px 20px rgba(201, 162, 39, 0.2);
}

.weather-info.weather-info-clouds,
.weather-info.weather-info-cloudy {
  background: linear-gradient(135deg, rgba(100, 110, 120, 0.95), rgba(70, 80, 90, 0.95));
  border-color: rgba(150, 150, 150, 0.5);
  box-shadow: 0 4px 20px rgba(100, 100, 100, 0.2);
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>