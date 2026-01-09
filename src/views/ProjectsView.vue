<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGitHubStore } from '@/stores/github'
import ProjectModal from '@/components/ProjectModal.vue'

const router = useRouter()
const githubStore = useGitHubStore()

const isModalOpen = ref(false)
const selectedProject = ref(null)
const isLoading = ref(true)
const scrollContainer = ref(null)
const activeIndex = ref(0)

const projects = computed(() => githubStore.sortedRepositories)

const handleOpenProject = async (project) => {
  await githubStore.selectRepository(project.name)
  selectedProject.value = githubStore.selectedRepo
  isModalOpen.value = true
}

const handleCloseModal = () => {
  isModalOpen.value = false
  setTimeout(() => {
    selectedProject.value = null
  }, 500)
}

const goToTerminal = () => {
  router.push('/')
}

const handleScroll = () => {
  if (!scrollContainer.value) return
  const containerWidth = scrollContainer.value.offsetWidth
  const scrollPosition = scrollContainer.value.scrollLeft
  const cardWidth = containerWidth * 0.6
  activeIndex.value = Math.round(scrollPosition / cardWidth)
}

const scrollToProject = (index) => {
  if (!scrollContainer.value) return
  const containerWidth = scrollContainer.value.offsetWidth
  const cardWidth = containerWidth * 0.6
  scrollContainer.value.scrollTo({
    left: index * cardWidth,
    behavior: 'smooth'
  })
}

onMounted(async () => {
  await githubStore.fetchRepositories()
  isLoading.value = false
})
</script>

<template>
  <div class="projects-page">
    <!-- Header -->
    <header class="page-header">
      <button class="back-btn" @click="goToTerminal" data-cursor-hover>
        <span class="back-icon">←</span>
        <span class="back-text">Terminal</span>
      </button>
      
      <h1 class="page-title">Projects</h1>
      
      <div class="project-count">
        <span class="count-current">{{ activeIndex + 1 }}</span>
        <span class="count-divider">/</span>
        <span class="count-total">{{ projects.length }}</span>
      </div>
    </header>

    <!-- Loading state -->
    <div v-if="isLoading" class="loading-state">
      <div class="loader"></div>
      <p>Fetching repositories...</p>
    </div>

    <!-- Projects horizontal scroll -->
    <main v-else class="projects-main">
      <div 
        ref="scrollContainer"
        class="projects-scroll"
        @scroll="handleScroll"
      >
        <article 
          v-for="(project, index) in projects"
          :key="project.id"
          class="project-card"
          :class="{ active: activeIndex === index }"
          @click="handleOpenProject(project)"
          data-cursor-hover
        >
          <div class="card-number">{{ String(index + 1).padStart(2, '0') }}</div>
          
          <div class="card-content">
            <h2 class="card-title">{{ project.name }}</h2>
            <p class="card-description">{{ project.description || 'No description available' }}</p>
            
            <div class="card-meta">
              <span v-if="project.language" class="meta-lang">{{ project.language }}</span>
              <span class="meta-stat">★ {{ project.stars }}</span>
              <span class="meta-stat">⑂ {{ project.forks }}</span>
            </div>
          </div>
          
          <div class="card-visual">
            <div class="visual-pattern">
              <span v-for="i in 9" :key="i" class="pattern-dot"></span>
            </div>
          </div>
          
          <div class="card-cta">
            <span>View Details</span>
            <span class="cta-arrow">→</span>
          </div>
        </article>
      </div>

      <!-- Navigation dots -->
      <div class="scroll-nav">
        <button
          v-for="(project, index) in projects.slice(0, 10)"
          :key="project.id"
          class="nav-dot"
          :class="{ active: activeIndex === index }"
          @click="scrollToProject(index)"
          data-cursor-hover
        ></button>
        <span v-if="projects.length > 10" class="nav-more">+{{ projects.length - 10 }}</span>
      </div>
    </main>

    <!-- Quote section -->
    <section class="quote-section">
      <blockquote class="quote">
        <p>"Code is poetry written in logic."</p>
      </blockquote>
    </section>

    <!-- Footer -->
    <footer class="page-footer">
      <div class="footer-nav">
        <router-link to="/" data-cursor-hover>Terminal</router-link>
        <router-link to="/about" data-cursor-hover>About</router-link>
        <router-link to="/contact" data-cursor-hover>Contact</router-link>
      </div>
      <p class="footer-hint">Click on a project to explore</p>
    </footer>

    <!-- Modal -->
    <ProjectModal 
      :project="selectedProject"
      :is-open="isModalOpen"
      @close="handleCloseModal"
    />
  </div>
</template>

<style lang="scss" scoped>
.projects-page {
  min-height: 100vh;
  background: var(--terminal-bg);
  display: flex;
  flex-direction: column;
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
  background: transparent;
  border: 1px solid var(--terminal-border);
  color: var(--terminal-text);
  padding: 0.75rem 1.5rem;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--terminal-accent);
    color: var(--terminal-accent);
  }
  
  .back-icon {
    transition: transform 0.3s ease;
  }
  
  &:hover .back-icon {
    transform: translateX(-4px);
  }
}

.page-title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--terminal-text);
  letter-spacing: -0.02em;
}

.project-count {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--terminal-text-dim);
  
  .count-current {
    color: var(--terminal-accent);
    font-size: 1.5rem;
    font-weight: 600;
  }
  
  .count-divider {
    margin: 0 0.25rem;
  }
}

.loading-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: var(--terminal-text-dim);
  
  .loader {
    width: 40px;
    height: 40px;
    border: 2px solid var(--terminal-border);
    border-top-color: var(--terminal-accent);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.projects-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 2rem 0;
}

.projects-scroll {
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  padding: 2rem;
  gap: 2rem;
  
  &::-webkit-scrollbar {
    display: none;
  }
}

.project-card {
  flex: 0 0 60vw;
  min-width: 400px;
  max-width: 700px;
  aspect-ratio: 4/3;
  scroll-snap-align: center;
  background: var(--terminal-bg-secondary);
  border: 1px solid var(--terminal-border);
  border-radius: 12px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  transition: all 0.5s var(--ease-out-expo);
  opacity: 0.6;
  transform: scale(0.95);
  
  &.active {
    opacity: 1;
    transform: scale(1);
    border-color: var(--terminal-accent);
    
    .card-visual {
      opacity: 1;
    }
  }
  
  &:hover {
    border-color: var(--terminal-accent);
  }
  
  @media (max-width: 768px) {
    flex: 0 0 85vw;
    min-width: 280px;
  }
}

.card-number {
  font-family: var(--font-serif);
  font-size: 5rem;
  font-weight: 300;
  color: var(--terminal-border);
  line-height: 1;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 3rem;
  }
}

.card-content {
  flex: 1;
}

.card-title {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 500;
  color: var(--terminal-text);
  margin-bottom: 0.75rem;
  letter-spacing: -0.02em;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
}

.card-description {
  font-size: 1rem;
  color: var(--terminal-text-dim);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  gap: 1rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--terminal-text-dim);
  
  .meta-lang {
    color: var(--terminal-accent-secondary);
    padding: 0.25rem 0.75rem;
    background: var(--terminal-bg);
    border-radius: 4px;
  }
}

.card-visual {
  position: absolute;
  right: 2rem;
  top: 2rem;
  opacity: 0.3;
  transition: opacity 0.5s ease;
}

.visual-pattern {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  
  .pattern-dot {
    width: 8px;
    height: 8px;
    background: var(--terminal-accent);
    border-radius: 50%;
    opacity: 0.5;
    
    &:nth-child(odd) {
      opacity: 1;
    }
  }
}

.card-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1.5rem;
  border-top: 1px solid var(--terminal-border);
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--terminal-text-dim);
  
  .cta-arrow {
    transition: transform 0.3s ease;
  }
  
  .project-card:hover & {
    color: var(--terminal-accent);
    
    .cta-arrow {
      transform: translateX(4px);
    }
  }
}

.scroll-nav {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 0;
}

.nav-dot {
  width: 10px;
  height: 10px;
  border: 1px solid var(--terminal-border);
  border-radius: 50%;
  background: transparent;
  transition: all 0.3s ease;
  
  &.active {
    background: var(--terminal-accent);
    border-color: var(--terminal-accent);
  }
  
  &:hover {
    border-color: var(--terminal-accent);
  }
}

.nav-more {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--terminal-text-dim);
}

.quote-section {
  padding: 4rem 2rem;
  text-align: center;
  border-top: 1px solid var(--terminal-border);
}

.quote {
  max-width: 600px;
  margin: 0 auto;
  
  p {
    font-family: var(--font-serif);
    font-size: 1.75rem;
    font-style: italic;
    color: var(--terminal-text-dim);
    line-height: 1.6;
    
    @media (max-width: 768px) {
      font-size: 1.25rem;
    }
  }
}

.page-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-top: 1px solid var(--terminal-border);
}

.footer-nav {
  display: flex;
  gap: 2rem;
  
  a {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--terminal-text-dim);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    transition: color 0.3s ease;
    
    &:hover {
      color: var(--terminal-accent);
    }
  }
}

.footer-hint {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--terminal-text-dim);
}
</style>
