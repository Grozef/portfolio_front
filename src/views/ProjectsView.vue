<template>
  <div class="projects-page">
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

    <div v-if="isLoading" class="loading-state">
      <div class="loader"></div>
      <p>Fetching repositories...</p>
    </div>

    <main v-else class="projects-main">
      <div ref="scrollContainer" class="projects-scroll" @scroll="handleScroll">
        <article 
          v-for="(project, index) in projects" 
          :key="project.id" 
          class="project-card"
          :class="{ active: activeIndex === index }" 
          @click="handleOpenProject(project)" 
          data-cursor-hover
        >
          <div 
            v-if="project.image" 
            class="card-bg-image" 
            :style="{ backgroundImage: `url(${project.image})` }"
          ></div>
          
          <div class="card-number">{{ String(index + 1).padStart(2, '0') }}</div>

          <div class="card-content">
            <div v-if="project.tags" class="card-tags">
              <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>

            <h2 class="card-title">{{ project.name }}</h2>
            
            <p class="card-description">
              {{ project.customDesc || project.description || 'No description available' }}
            </p>

            <div v-if="project.problem || project.solution || project.role || project.outcomes" class="card-case-study">
              <div v-if="project.problem" class="case-item">
                <span class="case-label">Problem:</span>
                <span class="case-value">{{ project.problem }}</span>
              </div>
              <div v-if="project.solution" class="case-item">
                <span class="case-label">Solution:</span>
                <span class="case-value">{{ project.solution }}</span>
              </div>
              <div v-if="project.role" class="case-item">
                <span class="case-label">Role:</span>
                <span class="case-value">{{ project.role }}</span>
              </div>
              <div v-if="project.outcomes" class="case-item">
                <span class="case-label">Outcome:</span>
                <span class="case-value">{{ project.outcomes }}</span>
              </div>
            </div>

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

      <div class="scroll-nav">
        <button 
          class="nav-arrow nav-arrow-prev" 
          :class="{ disabled: activeIndex === 0 }" 
          @click="goToPrevProject"
          :disabled="activeIndex === 0" 
          data-cursor-hover
        >
          <span>←</span>
        </button>

        <div class="nav-dots-container">
          <button 
            v-for="(project, index) in visibleDots" 
            :key="project.id" 
            class="nav-dot" 
            :class="{ active: activeIndex === index }" 
            @click="scrollToProject(index)"
            data-cursor-hover
          ></button>
          <span v-if="projects.length > maxDots" class="nav-more">
            +{{ projects.length - maxDots }}
          </span>
        </div>

        <button 
          class="nav-arrow nav-arrow-next" 
          :class="{ disabled: activeIndex === projects.length - 1 }" 
          @click="goToNextProject"
          :disabled="activeIndex === projects.length - 1" 
          data-cursor-hover
        >
          <span>→</span>
        </button>
      </div>
    </main>

    <section class="quote-section">
      <blockquote class="quote">
        <p>"Tout ce qui arrive est necessaire" Un Stoïcien.</p>
      </blockquote>
    </section>

    <div class="quote-section">
      <p class="citation">"The sword chooses the warrior..."</p>
      <SwordTrigger />
    </div>

    <ProjectModal 
      :project="selectedProject" 
      :is-open="isModalOpen" 
      @close="handleCloseModal" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useGitHubStore } from '@/stores/github'
import ProjectModal from '@/components/ProjectModal.vue'
import SwordTrigger from '@/components/SwordTrigger.vue'

const router = useRouter()
const githubStore = useGitHubStore()

const isModalOpen = ref(false)
const selectedProject = ref(null)
const isLoading = ref(true)
const scrollContainer = ref(null)
const activeIndex = ref(0)
const maxDots = 10

// Curated project customizations
// move into a store ?
const customProjectData = {
  // Example: "repository-name": { 
  //   image: "/images/project-screenshot.jpg",
  //   customDesc: "Custom description overriding GitHub description",
  //   tags: ["Vue", "API", "Design"],
  //   problem: "Users needed a faster way to visualize data",
  //   solution: "Built real-time dashboard with WebSocket integration",
  //   role: "Full-stack developer & UX designer",
  //   outcomes: "50% faster data access, 10k+ daily users"
  // }
}

const projects = computed(() => {
  return githubStore.sortedRepositories.map(repo => ({
    ...repo,
    ...customProjectData[repo.name]
  }))
})

const visibleDots = computed(() => {
  return projects.value.slice(0, maxDots)
})

const handleScroll = () => {
  if (!scrollContainer.value) return
  
  const container = scrollContainer.value
  const scrollPosition = container.scrollLeft
  const containerWidth = container.offsetWidth
  
  // Get actual card element to measure
  const firstCard = container.querySelector('.project-card')
  if (!firstCard) return
  
  const cardStyles = window.getComputedStyle(firstCard)
  const cardWidth = firstCard.offsetWidth
  const gap = parseFloat(cardStyles.marginRight) || 32 // 2rem default gap
  
  const totalCardWidth = cardWidth + gap
  activeIndex.value = Math.round(scrollPosition / totalCardWidth)

  // Infinite scroll trigger
  if (scrollPosition + containerWidth >= container.scrollWidth - 500) {
    if (githubStore.hasMoreRepos && !githubStore.isLoadingMore) {
      githubStore.fetchMoreRepositories()
    }
  }
}

const scrollToProject = (index) => {
  if (!scrollContainer.value) return
  
  const container = scrollContainer.value
  const firstCard = container.querySelector('.project-card')
  if (!firstCard) return
  
  const cardStyles = window.getComputedStyle(firstCard)
  const cardWidth = firstCard.offsetWidth
  const gap = parseFloat(cardStyles.marginRight) || 32
  
  const totalCardWidth = cardWidth + gap
  
  container.scrollTo({
    left: index * totalCardWidth,
    behavior: 'smooth'
  })
}

const goToPrevProject = () => {
  if (activeIndex.value > 0) {
    scrollToProject(activeIndex.value - 1)
  }
}

const goToNextProject = () => {
  if (activeIndex.value < projects.value.length - 1) {
    scrollToProject(activeIndex.value + 1)
  }
}

const handleOpenProject = async (project) => {
  await githubStore.selectRepository(project.name)
  selectedProject.value = githubStore.selectedRepo
  isModalOpen.value = true
}

const handleCloseModal = () => {
  isModalOpen.value = false
  setTimeout(() => {
    selectedProject.value = null
  }, 300)
}

const goToTerminal = () => {
  router.push('/')
}

onMounted(async () => {
  await githubStore.fetchRepositories()
  isLoading.value = false
  
  await nextTick()
  if (scrollContainer.value) {
    scrollToProject(0)
  }
})
</script>

<style lang="scss" src="@/assets/styles/pagesScss/projects.scss"></style>