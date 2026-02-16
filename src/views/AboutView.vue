<template>
  <div class="about-page" :class="{ visible: isVisible }">
    <header class="page-header">
      <router-link to="/" class="back-btn" aria-label="Back to home" data-cursor-hover>
        <span class="back-icon">←</span>
        <span>Back</span>
      </router-link>
      <h1 class="page-title">About</h1>
      <div class="header-spacer"></div>
    </header>

    <main class="about-main">
      <HiddenMusicPlayer musicSrc="/sound/mindmist-sounds-of-waves-313367.mp3" />

      <section class="hero-section">
        <div class="hero-content">
          <span class="hero-label">Hello, I'm</span>
          <h2 class="hero-name">Francois <span class="accent-text">Lisowski</span></h2>
          <p class="hero-tagline">Full Stack Developer — The one you need.</p>
        </div>
        <div class="hero-visual">
          <div class="visual-photo">
            <img src="/images/francois-lisowski.png" alt="Francois Lisowski">
          </div>

          <div class="visual-ring"></div>
          <div class="visual-ring ring-2"></div>
          <div class="visual-ring ring-3"></div>
        </div>
      </section>

      <section class="bio-section">
        <div class="section-number">01</div>
        <div class="section-content">
          <h3 class="section-title">Who I Am</h3>
          <p class="bio-text">
            I’m a passionate developer with over 3 years of experience. I first studied at the
            Chambre de Commerce et d’Industrie (CCI) of Lyon, where I earned my first state-recognized
            degree: Développeur Web et Web Mobile (DWWM - RNCP Level 5) in 2024.
          </p>
          <p class="bio-text">
            I continued my specialization at the IT Academy,
            obtaining the Concepteur Développeur d'Applications (CDA - RNCP Level 6) certification.
            This two-year work-study program, completed in 2026, allowed me to master high-level
            application architecture while working in production environments.
          </p>
        </div>
      </section>

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

      <section class="experience-section">
        <div class="section-number">03</div>
        <div class="section-content">
          <h3 class="section-title">Experience</h3>
          <div class="timeline">
            <div v-for="exp in experience" :key="exp.company + exp.title" class="timeline-item">
              <div class="timeline-marker"></div>
              <div class="timeline-content">
                <div class="exp-header">
                  <h4 class="exp-title">{{ exp.title }}</h4>
                  <span class="exp-period">{{ exp.period }}</span>
                </div>
                <span class="exp-company">{{ exp.company }}</span>
                <ul class="exp-task-list">
                  <li v-for="(task, index) in exp.tasks" :key="index" class="exp-task-item">
                    {{ task }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="quote-section">
        <blockquote class="quote">
          <p>« Talk is cheap. Show me the code. » </p>
          <cite>— Linus Torvalds</cite>
        </blockquote>
      </section>

      <section class="cta-section">
        <h3 class="cta-title">Let's work together</h3>
        <p class="cta-text">I'm always interested in new opportunities and challenges.</p>
        <router-link to="/contact" class="cta-button" aria-label="Contact me" data-cursor-hover>
          Get in Touch
          <span class="btn-arrow">→</span>
        </router-link>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import HiddenMusicPlayer from '@/components/HiddenMusicPlayer.vue'

const isVisible = ref(false)

const skills = {
  frontend: ['JavaScript', 'Vue.js', 'TypeScript', 'Quasar', 'Ionic', 'SCSS'],
  backend: ['PHP', 'Laravel', 'Symfony', 'MySQL', 'REST APIs'],
  devops: ['Docker', 'AWS', 'CI/CD', 'Apache', 'Linux'],
  tools: ['Git', 'GitHub', 'Figma', 'VS Code', 'Vite', 'Cypress'],
  mobile: ['Android Studio', 'Dart', 'Flutter', 'Capacitor'],
}

const experience = [
  {
    title: "Full Stack Developer",
    company: "Lab",
    period: "2024 – Present",
    tasks: [
      "Designed and developed internal SaaS platforms for warranty management.",
      "Maintenance of the company's spare parts management app.",
      "Built a mobile application for factory inspections (offline-first).",
      "Stack: Vue3, Quasar, Ionic, Laravel, MySQL, REST APIs, Cypress."
    ]
  },
  {
    title: "Backend Developer",
    company: "High Connexion",
    period: "2023",
    tasks: [
      "Developed a CLI tool for automated phone number processing.",
      "Optimized performance and integrated third-party systems.",
      "Stack: Symfony, MySQL."
    ]
  }
]

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
  text-decoration: none;
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

.hero-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 40vh;
  margin-bottom: 6rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
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
  font-size: 3.5rem;
  font-weight: 500;
  color: var(--terminal-text);
  margin-bottom: 1rem;

  .accent-text {
    color: var(--terminal-accent);
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
}

.hero-tagline {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  color: var(--terminal-text-dim);
  font-style: italic;
}

.hero-visual {
  position: relative;
  width: 220px; // Slightly larger to accommodate the photo
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    margin-top: 3rem;
  }
}

.visual-photo {
  width: 140px;  // Size of the photo circle
  height: 140px;
  border-radius: 50%;
  overflow: hidden;
  z-index: 2; // Above the rings
  border: 2px solid var(--terminal-border);
  background: var(--terminal-bg);
  box-shadow: 0 0 20px rgba(var(--terminal-accent-rgb), 0.1);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    // Tip: Add a slight grayscale for a pro look that matches the terminal theme
    filter: grayscale(20%); 
    transition: filter 0.3s ease;

    &:hover {
      filter: grayscale(0%);
    }
  }
}

.visual-ring {
  position: absolute;
  inset: 0; // Rings take the full 220px width
  border: 1px solid var(--terminal-border);
  border-radius: 50%;
  animation: rotate 20s linear infinite;
  z-index: 1;
  
  &.ring-2 {
    inset: 15px;
    border-color: var(--terminal-accent);
    opacity: 0.4;
    animation-direction: reverse;
    animation-duration: 15s;
  }
  
  &.ring-3 {
    inset: 30px;
    border-color: var(--terminal-accent-secondary);
    opacity: 0.2;
    animation-duration: 25s;
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
  to {
    transform: rotate(360deg);
  }
}

.section-number {
  font-family: var(--font-serif);
  font-size: 5rem;
  font-weight: 300;
  color: var(--terminal-border);
  line-height: 1;
  margin-bottom: 0.5rem;
}

.section-title {
  font-family: var(--font-display);
  font-size: 2rem;
  color: var(--terminal-text);
  margin-bottom: 2rem;
}

.bio-section,
.skills-section,
.experience-section {
  margin-bottom: 8rem;
}

.bio-text {
  font-family: var(--font-serif);
  font-size: 1.2rem;
  line-height: 1.8;
  color: var(--terminal-text-dim);
  margin-bottom: 1.5rem;

  strong {
    color: var(--terminal-text);
  }
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.category-title {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--terminal-accent);
  margin-bottom: 1.25rem;
}

.skill-list {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 0;
}

.skill-item {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--terminal-text);
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--terminal-border);
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--terminal-accent);
    color: var(--terminal-accent);
  }
}

.timeline {
  position: relative;
  padding-left: 2rem;
  border-left: 1px solid var(--terminal-border);
}

.timeline-item {
  position: relative;
  margin-bottom: 4rem;

  &:last-child {
    margin-bottom: 0;
  }
}

.timeline-marker {
  position: absolute;
  left: calc(-2rem - 5px);
  top: 0.5rem;
  width: 9px;
  height: 9px;
  background: var(--terminal-bg);
  border: 2px solid var(--terminal-accent);
  border-radius: 50%;
}

.exp-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.5rem;

  @media (max-width: 600px) {
    flex-direction: column;
  }
}

.exp-title {
  font-family: var(--font-display);
  font-size: 1.4rem;
  color: var(--terminal-text);
}

.exp-period {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--terminal-text-dim);
}

.exp-company {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.9rem;
  color: var(--terminal-accent-secondary);
  margin-bottom: 1rem;
}

.exp-task-list {
  list-style: none;
  padding: 0;
}

.exp-task-item {
  font-family: var(--font-serif);
  font-size: 1rem;
  color: var(--terminal-text-dim);
  line-height: 1.6;
  margin-bottom: 0.5rem;
  position: relative;
  padding-left: 1.2rem;

  &::before {
    content: "→";
    position: absolute;
    left: 0;
    color: var(--terminal-accent);
    font-family: var(--font-mono);
  }
}

.quote-section {
  padding: 5rem 0;
  border-block: 1px solid var(--terminal-border);
  margin-bottom: 6rem;
  text-align: center;

  .quote p {
    font-family: var(--font-serif);
    font-size: 1.8rem;
    font-style: italic;
    color: var(--terminal-text);
    margin-bottom: 1rem;
  }

  cite {
    font-family: var(--font-mono);
    font-size: 0.9rem;
    color: var(--terminal-text-dim);
  }
}

.cta-section {
  text-align: center;
  padding-bottom: 4rem;

  .cta-title {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  .cta-text {
    font-family: var(--font-serif);
    margin-bottom: 2.5rem;
    color: var(--terminal-text-dim);
  }
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  background: var(--terminal-accent);
  color: var(--terminal-bg);
  padding: 1.2rem 2.5rem;
  text-decoration: none;
  font-family: var(--font-mono);
  font-weight: bold;
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    background: var(--terminal-text);
    transform: translateY(-2px);

    .btn-arrow {
      transform: translateX(5px);
    }
  }

  .btn-arrow {
    transition: transform 0.3s ease;
  }
}
</style>