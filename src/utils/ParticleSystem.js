export class ParticleSystem {
  constructor(canvas, type, weatherConditionRef) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.type = type
    this.weatherConditionRef = weatherConditionRef
    this.particles = []
    this.animationFrameId = null
    this.isVisible = true
    
    this.setupVisibilityDetection()
    this.initParticles()
  }

  setupVisibilityDetection() {
    if (typeof document.hidden !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        this.isVisible = !document.hidden
      })
    }
  }

  initParticles() {
    const count = this.type === 'heavy_rain' ? 250 : 150
    this.particles = []
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(this.canvas, this.type))
    }
  }

  handleResize() {
    this.particles.forEach(p => p.canvas = this.canvas)
  }

  start() {
    this.animate()
  }

  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
    this.particles = []
  }

  animate() {
    if (!this.isVisible) {
      this.animationFrameId = requestAnimationFrame(() => this.animate())
      return
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    if (this.weatherConditionRef.value === 'thunder' && Math.random() > 0.985) {
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }

    this.particles.forEach(p => {
      p.update()
      p.draw(this.ctx)
    })

    this.animationFrameId = requestAnimationFrame(() => this.animate())
  }
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
      ctx.strokeStyle = '#4a9eff'
      ctx.lineWidth = this.type === 'heavy_rain' ? 2 : 1
      ctx.beginPath()
      ctx.moveTo(this.x, this.y)
      ctx.lineTo(this.x + 2, this.y + 10)
      ctx.stroke()
    } else if (this.type === 'snow' || this.type === 'ash') {
      ctx.fillStyle = this.type === 'snow' ? '#ffffff' : this.color
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.restore()
  }
}