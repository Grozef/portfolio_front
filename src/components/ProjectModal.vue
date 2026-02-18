<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen && project" ref="modalRef" class="project-modal" @click.self="handleClose">
        <div class="modal-container">
          <!-- Close button -->
          <button class="modal-close" @click="handleClose" data-cursor-hover>
            <span class="close-line"></span>
            <span class="close-line"></span>
          </button>

          <!-- Navigation dots -->
          <div class="modal-nav">
            <button v-for="(section, index) in sections" :key="section.id" class="nav-dot"
              :class="{ active: currentSection === index }" @click="scrollToSection(index)" data-cursor-hover
              :aria-label="`View ${section.title} section`" :aria-current="currentSection === index ? 'true' : 'false'">

              <span class="dot-label">{{ section.title }}</span>
            </button>
          </div>

          <!-- Horizontal scroll container -->
          <div ref="scrollContainerRef" class="modal-scroll" @wheel="handleWheel" @mousedown="handleMouseDown"
            @mousemove="handleMouseMove" @mouseup="handleMouseUp" @mouseleave="handleMouseUp" @scroll="handleScroll">
            <!-- Section 1: Overview -->
            <section class="modal-section section-overview">
              <div class="section-content">
                <span class="section-number">01</span>
                <h1 class="project-title">{{ project.name }}</h1>
                <p class="project-description">{{ project.description || 'A project without description.' }}</p>

                <div class="project-meta">
                  <div class="meta-item">
                    <span class="meta-label">Stars</span>
                    <span class="meta-value">{{ project.stars || 0 }}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">Forks</span>
                    <span class="meta-value">{{ project.forks || 0 }}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">Language</span>
                    <span class="meta-value">{{ project.language || 'N/A' }}</span>
                  </div>
                </div>

                <div class="scroll-hint">
                  <span>Scroll or drag to explore</span>
                  <div class="scroll-arrow">→</div>
                </div>
              </div>
              <div class="section-visual">
                <div class="visual-circle"></div>
                <div class="visual-lines">
                  <span v-for="i in 5" :key="i" class="line" :style="{ animationDelay: `${i * 0.2}s` }"></span>
                </div>
              </div>
            </section>

            <!-- Section 2: Technologies -->
            <section class="modal-section section-tech">
              <div class="section-content">
                <span class="section-number">02</span>
                <h2 class="section-title">Technologies</h2>

                <div v-if="project.languages?.length" class="tech-bars">
                  <div v-for="lang in project.languages" :key="lang.name" class="tech-bar">
                    <div class="bar-header">
                      <span class="bar-name">{{ lang.name }}</span>
                      <span class="bar-percent">{{ lang.percentage }}%</span>
                    </div>
                    <div class="bar-track">
                      <div class="bar-fill" :style="{
                        width: `${lang.percentage}%`,
                        backgroundColor: getLanguageColor(lang.name)
                      }"></div>
                    </div>
                  </div>
                </div>

                <div v-if="project.topics?.length" class="tech-topics">
                  <span class="topics-label">Topics</span>
                  <div class="topics-list">
                    <span v-for="topic in project.topics" :key="topic" class="topic-tag">
                      {{ topic }}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <!-- Section 3: README -->
            <section class="modal-section section-readme">
              <div class="section-content">
                <span class="section-number">03</span>
                <h2 class="section-title">Documentation</h2>

                <div v-if="parsedReadme" class="readme-content" v-html="parsedReadme"></div>
                <div v-else class="readme-empty">
                  <p>No documentation available for this project.</p>
                </div>
              </div>
            </section>

            <!-- Section 4: Links -->
            <section class="modal-section section-links">
              <div class="section-content">
                <span class="section-number">04</span>
                <h2 class="section-title">Links & Actions</h2>

                <div class="links-grid">
                  <a :href="project.html_url" target="_blank" rel="noopener" class="link-card" data-cursor-hover>
                    <span class="link-icon">◆</span>
                    <span class="link-label">View on GitHub</span>
                    <span class="link-arrow">→</span>
                  </a>

                  <a v-if="project.homepage" :href="project.homepage" target="_blank" rel="noopener" class="link-card"
                    data-cursor-hover>
                    <span class="link-icon">◇</span>
                    <span class="link-label">Live Demo</span>
                    <span class="link-arrow">→</span>
                  </a>

                  <button class="link-card" @click="handleClose" aria-label="Close project details" data-cursor-hover>
                    <span class="link-icon">←</span>
                    <span class="link-label">Back to Terminal</span>
                    <span class="link-arrow">ESC</span>
                  </button>
                </div>

                <div class="project-dates">
                  <p>
                    <span class="date-label">Created:</span>
                    {{ new Date(project.created_at).toLocaleDateString() }}
                  </p>
                  <p>
                    <span class="date-label">Last updated:</span>
                    {{ new Date(project.updated_at).toLocaleDateString() }}
                  </p>
                </div>
              </div>
            </section>
          </div>

          <!-- Keyboard hint -->
          <div class="keyboard-hint">
            <span>←→ Navigate</span>
            <span>ESC Close</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { marked } from 'marked'

const props = defineProps({
  project: {
    type: Object,
    default: null
  },
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const modalRef = ref(null)
const scrollContainerRef = ref(null)
const currentSection = ref(0)
const isDragging = ref(false)
const startX = ref(0)
const scrollLeft = ref(0)

const sections = computed(() => {
  if (!props.project) return []

  return [
    { id: 'overview', title: 'Overview' },
    { id: 'technologies', title: 'Technologies' },
    { id: 'readme', title: 'Documentation' },
    { id: 'links', title: 'Links' }
  ]
})

const parsedReadme = computed(() => {
  if (!props.project?.readme) return null
  return marked(props.project.readme)
})

const languageColors = {
  JavaScript: '#f7df1e',
  TypeScript: '#3178c6',
  Vue: '#42b883',
  PHP: '#777bb4',
  Python: '#3776ab',
  CSS: '#1572b6',
  SCSS: '#c6538c',
  HTML: '#e34f26',
  Shell: '#89e051',
  Go: '#00add8',
  Rust: '#dea584',
  Java: '#b07219',
  Ruby: '#cc342d',
  Swift: '#fa7343',
  Kotlin: '#a97bff'
}

const getLanguageColor = (lang) => {
  return languageColors[lang] || '#8b8b8b'
}

const previousFocus = ref(null)

const getFocusableElements = () => {
  if (!modalRef.value) return []
  return Array.from(modalRef.value.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  ))
}

const trapFocus = (e) => {
  if (e.key !== 'Tab') return
  const focusable = getFocusableElements()
  if (!focusable.length) return
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (e.shiftKey) {
    if (document.activeElement === first) {
      e.preventDefault()
      last.focus()
    }
  } else {
    if (document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }
}

const handleKeydown = (e) => {
  if (e.key === 'Escape') {
    handleClose()
  } else if (e.key === 'ArrowRight') {
    scrollToSection(currentSection.value + 1)
  } else if (e.key === 'ArrowLeft') {
    scrollToSection(currentSection.value - 1)
  }
}

const handleClose = () => {
  emit('close')
  if (previousFocus.value) {
    previousFocus.value.focus()
    previousFocus.value = null
  }
}

const scrollToSection = (index) => {
  if (index < 0 || index >= sections.value.length) return
  currentSection.value = index

  const container = scrollContainerRef.value
  if (container) {
    const sectionEl = container.children[index]
    if (sectionEl) {
      sectionEl.scrollIntoView({ behavior: 'smooth', inline: 'start' })
    }
  }
}

const handleWheel = (e) => {
  e.preventDefault()
  const container = scrollContainerRef.value
  if (container) {
    container.scrollLeft += e.deltaY
  }
}

const handleMouseDown = (e) => {
  isDragging.value = true
  startX.value = e.pageX - scrollContainerRef.value.offsetLeft
  scrollLeft.value = scrollContainerRef.value.scrollLeft
}

const handleMouseMove = (e) => {
  if (!isDragging.value) return
  e.preventDefault()
  const x = e.pageX - scrollContainerRef.value.offsetLeft
  const walk = (x - startX.value) * 2
  scrollContainerRef.value.scrollLeft = scrollLeft.value - walk
}

const handleMouseUp = () => {
  isDragging.value = false
}

const handleScroll = () => {
  const container = scrollContainerRef.value
  if (!container) return

  const scrollPosition = container.scrollLeft
  const sectionWidth = container.offsetWidth
  currentSection.value = Math.round(scrollPosition / sectionWidth)
}

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    previousFocus.value = document.activeElement
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeydown)
    document.addEventListener('keydown', trapFocus)
    nextTick(() => {
      currentSection.value = 0
      if (scrollContainerRef.value) {
        scrollContainerRef.value.scrollLeft = 0
      }
      const focusable = getFocusableElements()
      if (focusable.length) focusable[0].focus()
    })
  } else {
    document.body.style.overflow = ''
    document.removeEventListener('keydown', handleKeydown)
    document.removeEventListener('keydown', trapFocus)
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('keydown', trapFocus)
})
</script>

<style src="@/assets/styles/componentsScss/project-modal.scss" lang="scss" scoped></style>