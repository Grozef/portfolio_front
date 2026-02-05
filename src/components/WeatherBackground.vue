<template>
  <div class="weather-background">
    <canvas ref="canvasRef" class="weather-canvas"></canvas>
    <div v-if="weatherLoaded && weatherData" class="weather-info">
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

let animationFrameId = null
let particles = []

// Weather API configuration 
const WEATHER_API_KEY = '9a971ce1dc8fe614aa09980420e4c0a6' 
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather'

// Particle class for weather effects
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

// Get user location
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
      }
    )
  })
}

// Fetch weather data
const fetchWeather = async (lat, lon) => {
  try {
    const response = await fetch(
      `${WEATHER_API_URL}?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    )
    
    if (!response.ok) {
      throw new Error('Weather API request failed')
    }

    const data = await response.json()
    
    return {
      temp: Math.round(data.main.temp),
      city: data.name,
      condition: data.weather[0].main.toLowerCase(),
      description: data.weather[0].description
    }
  } catch (error) {
    console.error('Failed to fetch weather:', error)
    return null
  }
}

// Initialize weather effects
const initWeatherEffects = (condition) => {
  const canvas = canvasRef.value
  if (!canvas) return

  particles = []
  let particleCount = 0
  let particleType = 'rain'

  switch (condition) {
    case 'rain':
    case 'drizzle':
    case 'thunderstorm':
      particleCount = 200
      particleType = 'rain'
      weatherIcon.value = '🌧️'
      break
    case 'snow':
      particleCount = 150
      particleType = 'snow'
      weatherIcon.value = '❄️'
      break
    case 'clouds':
      particleCount = 0
      weatherIcon.value = '☁️'
      break
    case 'clear':
      particleCount = 0
      weatherIcon.value = '☀️'
      break
    default:
      particleCount = 0
      weatherIcon.value = '🌤️'
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(canvas, particleType))
  }

  animate()
}

// Animation loop
const animate = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  particles.forEach(particle => {
    particle.update()
    particle.draw(ctx)
  })

  animationFrameId = requestAnimationFrame(animate)
}

// Resize canvas
const resizeCanvas = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

// Initialize weather system
const initWeather = async () => {
  try {
    // Get user location
    const location = await getUserLocation()
    
    // Fetch weather data
    const weather = await fetchWeather(location.lat, location.lon)
    
    if (weather) {
      weatherData.value = weather
      weatherLoaded.value = true
      
      // Initialize weather effects
      initWeatherEffects(weather.condition)
      
      // Discover easter egg if not already discovered
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
    
    // Fallback: use default sunny weather
    weatherData.value = {
      temp: 20,
      city: 'Unknown',
      condition: 'clear'
    }
    weatherLoaded.value = true
    weatherIcon.value = '☀️'
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
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.weather-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.3;
}

.weather-info {
  position: fixed;
  top: 6rem;
  right: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  background: rgba(17, 17, 19, 0.8);
  border: 1px solid var(--terminal-border);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--terminal-text);
  animation: fadeIn 0.5s ease;
  
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
