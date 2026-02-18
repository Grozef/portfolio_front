<template>
  <div class="home">
    <header class="home__header">
      <div class="header-content">
        <div class="logo">
          <span class="logo-symbol">◆</span>
          <span class="logo-text">Lisowski François</span>
        </div>

        <nav class="nav desktop-nav" role="navigation" aria-label="Primary navigation">
          <router-link to="/" class="nav-link active" aria-current="page">terminal</router-link>
          <router-link to="/projects" class="nav-link">projects</router-link>
          <router-link to="/books" class="nav-link">books</router-link>
          <router-link to="/about" class="nav-link">about</router-link>
          <router-link to="/contact" class="nav-link">contact</router-link>
        </nav>

        <button class="mobile-menu-btn" @click="toggleMobileMenu" aria-label="Toggle navigation menu"
          :aria-expanded="isMobileMenuOpen" data-cursor-hover>
          <span v-if="!isMobileMenuOpen">☰</span>
          <span v-else>✕</span>
        </button>

        <div class="header-status">
          <span class="status-indicator"></span>
          <span class="status-text">Available for work</span>
        </div>
      </div>

      <nav class="mobile-nav" :class="{ open: isMobileMenuOpen }" role="navigation" aria-label="Mobile navigation">
        <router-link to="/" class="nav-link" @click="closeMobileMenu">terminal</router-link>
        <router-link to="/projects" class="nav-link" @click="closeMobileMenu">projects</router-link>
        <router-link to="/books" class="nav-link" @click="closeMobileMenu">books</router-link>
        <router-link to="/about" class="nav-link" @click="closeMobileMenu">about</router-link>
        <router-link to="/contact" class="nav-link" @click="closeMobileMenu">contact</router-link>
      </nav>
    </header>

    <main id="main-content" class="home__main" tabindex="-1">
      <div class="terminal-wrapper">
        <TerminalInterface @open-project="handleOpenProject" />
      </div>
    </main>

    <ProjectModal :project="selectedProject" :is-open="isModalOpen" @close="handleCloseModal" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useGitHubStore } from '@/stores/github'
import TerminalInterface from '@/components/TerminalInterface.vue'
import ProjectModal from '@/components/ProjectModal.vue'

const githubStore = useGitHubStore()
const isModalOpen = ref(false)
const selectedProject = ref(null)
const isMobileMenuOpen = ref(false)

const handleOpenProject = (project) => {
  selectedProject.value = project
  isModalOpen.value = true
}

const handleCloseModal = () => {
  isModalOpen.value = false
  setTimeout(() => {
    selectedProject.value = null
  }, 500)
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const handleEsc = (e) => {
  if (e.key === 'Escape' && isMobileMenuOpen.value) closeMobileMenu()
}

onMounted(() => {
  githubStore.fetchProfile()
  document.addEventListener('keydown', handleEsc)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEsc)
})
</script>

<style lang="scss" scoped>
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--terminal-bg);

  &__header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    padding: 1rem 2rem;
    background: rgba(10, 10, 15, 0.8);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--terminal-border);

    @media (max-width: 768px) {
      padding: 1rem;
    }
  }

  &__main {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6rem 2rem 4rem;

    // temporary fix to not go under footer, will need to be reworked when more content is added
    padding-bottom: 40rem;

    @media (max-width: 768px) {
      padding: 5rem 1rem 2rem;
    }
  }

  &__footer {
    padding: 1rem 2rem;
    border-top: 1px solid var(--terminal-border);

    @media (max-width: 768px) {
      padding: 1rem;
    }
  }
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;

  @media (max-width: 768px) {
    gap: 1rem;
  }
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;

  .logo-symbol {
    color: var(--terminal-accent);
    font-size: 1.25rem;
  }

  .logo-text {
    font-weight: 500;
    letter-spacing: 0.05em;
    color: var(--terminal-text);

    @media (max-width: 480px) {
      font-size: 0.9rem;
    }
  }
}

.desktop-nav {
  display: flex;
  gap: 2rem;

  @media (max-width: 968px) {
    gap: 1.5rem;
  }

  @media (max-width: 868px) {
    display: none;
  }
}

.mobile-menu-btn {
  display: none;
  background: transparent;
  border: 1px solid var(--terminal-border);
  color: var(--terminal-text);
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--terminal-accent);
    color: var(--terminal-accent);
  }

  @media (max-width: 868px) {
    display: flex;
  }
}

.mobile-nav {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(10, 10, 15, 0.98);
  border-bottom: 1px solid var(--terminal-border);
  flex-direction: column;
  padding: 0;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease;

  @media (max-width: 868px) {
    display: flex;
  }

  &.open {
    max-height: 300px;
    padding: 1rem 0;
  }

  .nav-link {
    padding: 1rem 2rem;
    border-bottom: 1px solid var(--terminal-border);

    &:last-child {
      border-bottom: none;
    }

    &::after {
      display: none;
    }
  }
}

.nav-link {
  font-size: 0.875rem;
  color: var(--terminal-text-dim);
  transition: color 0.3s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 1px;
    background: var(--terminal-accent);
    transition: width 0.3s ease;
  }

  &:hover,
  &.active {
    color: var(--terminal-text);

    &::after {
      width: 100%;
    }
  }

  &.active {
    color: var(--terminal-accent);
  }
}

.header-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 968px) {
    display: none;
  }
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4ade80;
  animation: pulse 2s ease infinite;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

.status-text {
  font-size: 0.75rem;
  color: var(--terminal-text-dim);
}

.terminal-wrapper {
  width: 100%;
  max-width: 1000px;
  height: 70vh;
  min-height: 400px;

  @media (max-width: 768px) {
    height: calc(100vh - 8rem);
    min-height: 300px;
  }

  @media (max-width: 480px) {
    height: calc(100vh - 6rem);
    min-height: 250px;
  }
}
</style>