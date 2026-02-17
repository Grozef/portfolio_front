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

<style src="@/assets/styles/pagesScss/about.scss" lang="scss" scoped>

</style>