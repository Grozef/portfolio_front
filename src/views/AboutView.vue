<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isVisible = ref(false)

const skills = {
  frontend: ['Vue.js', 'React', 'TypeScript', 'Tailwind CSS', 'GSAP', 'Three.js'],
  backend: ['Laravel', 'Node.js', 'PostgreSQL', 'Redis', 'GraphQL', 'REST APIs'],
  devops: ['Docker', 'AWS', 'CI/CD', 'Nginx', 'Linux', 'Kubernetes'],
  tools: ['Git', 'Figma', 'VS Code', 'Webpack', 'Vite', 'Jest']
}

const experience = [
  {
    title: 'Senior Full Stack Developer',
    company: 'Tech Company',
    period: '2022 - Present',
    description: 'Leading development of microservices architecture and mentoring junior developers.'
  },
  {
    title: 'Full Stack Developer',
    company: 'Startup Inc',
    period: '2020 - 2022',
    description: 'Built and scaled SaaS platform from 0 to 100k users.'
  },
  {
    title: 'Frontend Developer',
    company: 'Digital Agency',
    period: '2018 - 2020',
    description: 'Developed interactive web experiences for major brands.'
  }
]

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 100)
})
</script>

<template>
  <div class="about-page" :class="{ visible: isVisible }">
    <header class="page-header">
      <router-link to="/" class="back-btn" data-cursor-hover>
        <span class="back-icon">←</span>
        <span>Back</span>
      </router-link>
      <h1 class="page-title">About</h1>
      <div class="header-spacer"></div>
    </header>

    <main class="about-main">
      <!-- Hero section -->
      <section class="hero-section">
        <div class="hero-content">
          <span class="hero-label">Hello, I'm</span>
          <h2 class="hero-name">Full Stack Developer</h2>
          <p class="hero-tagline">Creative Technologist & Problem Solver</p>
        </div>
        <div class="hero-visual">
          <div class="visual-ring"></div>
          <div class="visual-ring ring-2"></div>
          <div class="visual-ring ring-3"></div>
        </div>
      </section>

      <!-- Bio section -->
      <section class="bio-section">
        <div class="section-number">01</div>
        <div class="section-content">
          <h3 class="section-title">Who I Am</h3>
          <p class="bio-text">
            I'm a passionate developer with over 6 years of experience building elegant 
            digital solutions. I specialize in creating performant, accessible, and 
            visually stunning web applications that make a difference.
          </p>
          <p class="bio-text">
            My approach combines technical excellence with creative thinking, ensuring 
            every project I work on is both functional and beautiful. I believe in clean 
            code, thoughtful architecture, and continuous learning.
          </p>
        </div>
      </section>

      <!-- Skills section -->
      <section class="skills-section">
        <div class="section-number">02</div>
        <div class="section-content">
          <h3 class="section-title">Skills & Technologies</h3>
          <div class="skills-grid">
            <div v-for="(items, category) in skills" :key="category" class="skill-category">
              <h4 class="category-title">{{ category }}</h4>
              <ul class="skill-list">
                <li v-for="skill in items" :key="skill" class="skill-item">{{ skill }}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- Experience section -->
      <section class="experience-section">
        <div class="section-number">03</div>
        <div class="section-content">
          <h3 class="section-title">Experience</h3>
          <div class="timeline">
            <div v-for="exp in experience" :key="exp.title + exp.company" class="timeline-item">
              <div class="timeline-marker"></div>
              <div class="timeline-content">
                <div class="exp-header">
                  <h4 class="exp-title">{{ exp.title }}</h4>
                  <span class="exp-period">{{ exp.period }}</span>
                </div>
                <span class="exp-company">{{ exp.company }}</span>
                <p class="exp-description">{{ exp.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Quote section -->
      <section class="quote-section">
        <blockquote class="quote">
          <p>"The best way to predict the future is to create it."</p>
          <cite>— Peter Drucker</cite>
        </blockquote>
      </section>

      <!-- CTA section -->
      <section class="cta-section">
        <h3 class="cta-title">Let's work together</h3>
        <p class="cta-text">I'm always interested in new opportunities and challenges.</p>
        <router-link to="/contact" class="cta-button" data-cursor-hover>
          Get in Touch
          <span class="btn-arrow">→</span>
        </router-link>
      </section>
    </main>

    <footer class="page-footer">
      <div class="footer-nav">
        <router-link to="/" data-cursor-hover>Terminal</router-link>
        <router-link to="/projects" data-cursor-hover>Projects</router-link>
        <router-link to="/contact" data-cursor-hover>Contact</router-link>
      </div>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
.about-page {
  min-height: 100vh;
  background: var(--terminal-bg);
  opacity: 0;
  transition: opacity 0.6s ease;
  
  &.visible {
    opacity: 1;
  }
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem;
  border-bottom: 1px solid var(--terminal-border);
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--terminal-text-dim);
  font-family: var(--font-mono);
  font-size: 0.875rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--terminal-accent);
  }
}

.page-title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--terminal-text);
}

.header-spacer {
  width: 80px;
}

.about-main {
  max-width: 1000px;
  margin: 0 auto;
  padding: 4rem 2rem;
}

// Hero section
.hero-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 50vh;
  margin-bottom: 6rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    min-height: auto;
  }
}

.hero-content {
  max-width: 600px;
}

.hero-label {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--terminal-accent);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin-bottom: 1rem;
}

.hero-name {
  font-family: var(--font-display);
  font-size: 4rem;
  font-weight: 500;
  color: var(--terminal-text);
  letter-spacing: -0.03em;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
}

.hero-tagline {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  color: var(--terminal-text-dim);
  font-style: italic;
  
  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
}

.hero-visual {
  position: relative;
  width: 200px;
  height: 200px;
  
  @media (max-width: 768px) {
    margin-top: 2rem;
  }
}

.visual-ring {
  position: absolute;
  inset: 0;
  border: 1px solid var(--terminal-border);
  border-radius: 50%;
  animation: rotate 20s linear infinite;
  
  &.ring-2 {
    inset: 20px;
    border-color: var(--terminal-accent);
    opacity: 0.5;
    animation-direction: reverse;
    animation-duration: 15s;
  }
  
  &.ring-3 {
    inset: 40px;
    border-color: var(--terminal-accent-secondary);
    opacity: 0.3;
    animation-duration: 25s;
  }
}

@keyframes rotate {
  to { transform: rotate(360deg); }
}

// Sections
.section-number {
  font-family: var(--font-serif);
  font-size: 6rem;
  font-weight: 300;
  color: var(--terminal-border);
  line-height: 1;
  margin-bottom: 1rem;
}

.section-title {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 500;
  color: var(--terminal-text);
  margin-bottom: 2rem;
}

// Bio section
.bio-section {
  margin-bottom: 6rem;
}

.bio-text {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  line-height: 1.8;
  color: var(--terminal-text-dim);
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
}

// Skills section
.skills-section {
  margin-bottom: 6rem;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

.skill-category {
  .category-title {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--terminal-accent);
    margin-bottom: 1rem;
  }
}

.skill-list {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.skill-item {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--terminal-text);
  padding: 0.5rem 1rem;
  border: 1px solid var(--terminal-border);
  border-radius: 4px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--terminal-accent);
    color: var(--terminal-accent);
  }
}

// Experience section
.experience-section {
  margin-bottom: 6rem;
}

.timeline {
  position: relative;
  padding-left: 2rem;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 1px;
    background: var(--terminal-border);
  }
}

.timeline-item {
  position: relative;
  padding-bottom: 3rem;
  
  &:last-child {
    padding-bottom: 0;
  }
}

.timeline-marker {
  position: absolute;
  left: -2rem;
  top: 0;
  width: 9px;
  height: 9px;
  background: var(--terminal-bg);
  border: 2px solid var(--terminal-accent);
  border-radius: 50%;
  transform: translateX(-50%);
}

.exp-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.25rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.25rem;
  }
}

.exp-title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--terminal-text);
}

.exp-period {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--terminal-text-dim);
}

.exp-company {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--terminal-accent-secondary);
  margin-bottom: 0.5rem;
}

.exp-description {
  font-family: var(--font-serif);
  font-size: 1rem;
  color: var(--terminal-text-dim);
  line-height: 1.6;
}

// Quote section
.quote-section {
  padding: 4rem 0;
  border-top: 1px solid var(--terminal-border);
  border-bottom: 1px solid var(--terminal-border);
  margin-bottom: 6rem;
  text-align: center;
}

.quote {
  p {
    font-family: var(--font-serif);
    font-size: 2rem;
    font-style: italic;
    color: var(--terminal-text);
    margin-bottom: 1rem;
    
    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }
  
  cite {
    font-family: var(--font-mono);
    font-size: 0.875rem;
    color: var(--terminal-text-dim);
    font-style: normal;
  }
}

// CTA section
.cta-section {
  text-align: center;
}

.cta-title {
  font-family: var(--font-display);
  font-size: 2.5rem;
  font-weight: 500;
  color: var(--terminal-text);
  margin-bottom: 1rem;
}

.cta-text {
  font-family: var(--font-serif);
  font-size: 1.125rem;
  color: var(--terminal-text-dim);
  margin-bottom: 2rem;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  font-family: var(--font-mono);
  font-size: 1rem;
  color: var(--terminal-bg);
  background: var(--terminal-accent);
  padding: 1rem 2rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  
  .btn-arrow {
    transition: transform 0.3s ease;
  }
  
  &:hover {
    background: var(--terminal-text);
    
    .btn-arrow {
      transform: translateX(4px);
    }
  }
}

// Footer
.page-footer {
  padding: 2rem;
  border-top: 1px solid var(--terminal-border);
}

.footer-nav {
  display: flex;
  justify-content: center;
  gap: 3rem;
  
  a {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--terminal-text-dim);
    transition: color 0.3s ease;
    
    &:hover {
      color: var(--terminal-accent);
    }
  }
}
</style>
