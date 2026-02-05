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
           <HiddenMusicPlayer musicSrc="/audio/hold-music.mp3" />
           
      <section class="hero-section">
        <div class="hero-content">
          <span class="hero-label">Hello, I'm a</span>
          <h2 class="hero-name">Full Stack Developer</h2>
          <p class="hero-tagline">The one you need.</p>
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
            I’m a passionate developer with over 3 years of experience.
            I first studied at the Chambre de Commerce et d’Industrie (CCI) of Lyon, where i 
            developed my skills (pun intended) in both frontend and backend development, where 
            i first earned a degree in Web and Mobile Development (Developpeur Web et Web Mobile, DWWM - RNCP level 5) in 2024. I then continued my studies at the IT 
            Academy (Concepteur Developpeur d'Applications CDA - RNCP level 6), completing a 
            two-year work-study program in 2026.
          </p>
          <p class="bio-text">
            Over the years, i specialized in various frameworks including Vue.js (Vue3, Quasar, Ionic), Symfony and Laravel.
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
          <p>« Talk is cheap. Show me the code. » </p>
          <cite>— Linus Torvarlds</cite>
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import HiddenMusicPlayer from '@/components/HiddenMusicPlayer.vue'

const router = useRouter()
const isVisible = ref(false)

const skills = {
  frontend: ['JavaScript', 'Vue.js', 'TypeScript', 'Quasar', 'Ionic', 'TypeScript'],
  backend: ['PHP', 'Laravel', 'Symfony', 'MySQL', 'REST APIs'],
  devops: ['Docker', 'AWS', 'CI/CD', 'Apache', 'Linux'],
  tools: ['Git', 'GitHub', 'Figma', 'VS Code', 'Webpack', 'Vite', 'Cypress'],
  mobile: ['Android Studio', 'Dart', 'Flutter', 'Ionic', 'Capacitor'],
  localEnv: ['Laragon'],
}

const experience = [
  {
    title: "Full Stack Developer",
    company: "Lab",
    period: "2024 – Present",
    description:
      "Designed and developed an internal SaaS platforms for warranty management.\n" +
      "Maintenance of the company's spare parts management app.\n" +
      "Built a mobile application for factory inspections, enabling offline data collection with sync capabilities to a central server.\n" +
      "Technologies: Vue3, Quasar, Ionic, Laravel, REST APIs, Pinia (state management), Cypress (testing).\n" +
      "Environment: Docker, GitHub (collaboration), Laragon (local development)."
  },
  {
    title: "Backend Developer",
    company: "High Connexion",
    period: "2023",
    description:
      "Developed a CLI tool for automated phone number processing (validation, formatting, and export).\n" +
      "Optimized performance and integrated with third-party systems.\n" +
      "Technologies: Symfony 7.4, MySQL."
  }
];

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 100)
})
</script>

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
</style>