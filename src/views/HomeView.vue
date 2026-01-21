<script setup>
  import { ref, onMounted } from 'vue'
  import { useGitHubStore } from '@/stores/github'
  import TerminalInterface from '@/components/TerminalInterface.vue'
  import ProjectModal from '@/components/ProjectModal.vue'
  
  const githubStore = useGitHubStore()
  const isModalOpen = ref(false)
  const selectedProject = ref(null)
  
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
  
  onMounted(() => {
    githubStore.fetchProfile()
  })
  </script>
  
  <template>
    <div class="home">
      <header class="home__header">
        <div class="header-content">
          <div class="logo">
            <span class="logo-symbol">◆</span>
            <span class="logo-text">portfolio</span>
          </div>
          <nav class="nav">
            <router-link to="/" class="nav-link active" data-cursor-hover>terminal</router-link>
            <router-link to="/projects" class="nav-link" data-cursor-hover>projects</router-link>
            <router-link to="/books" class="nav-link" data-cursor-hover>books</router-link>
            <router-link to="/about" class="nav-link" data-cursor-hover>about</router-link>
            <router-link to="/contact" class="nav-link" data-cursor-hover>contact</router-link>
          </nav>
          <div class="header-status">
            <span class="status-indicator"></span>
            <span class="status-text">Available for work</span>
          </div>
        </div>
      </header>
  
      <main class="home__main">
        <div class="terminal-wrapper">
          <TerminalInterface @open-project="handleOpenProject" />
        </div>
      </main>
  
      <footer class="home__footer">
        <div class="footer-content">
          <span class="copyright">© {{ new Date().getFullYear() }}</span>
          <div class="footer-links">
            <a href="https://github.com" target="_blank" rel="noopener" data-cursor-hover>GitHub</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener" data-cursor-hover>LinkedIn</a>
            <a href="https://twitter.com" target="_blank" rel="noopener" data-cursor-hover>Twitter</a>
          </div>
          <span class="version">v1.0.0</span>
        </div>
      </footer>
  
      <ProjectModal 
        :project="selectedProject"
        :is-open="isModalOpen"
        @close="handleCloseModal"
      />
    </div>
  </template>
  
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
    }
  
    &__main {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 6rem 2rem 4rem;
    }
  
    &__footer {
      padding: 1rem 2rem;
      border-top: 1px solid var(--terminal-border);
    }
  }
  
  .header-content {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
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
    }
  }
  
  .nav {
    display: flex;
    gap: 2rem;
    
    @media (max-width: 768px) {
      display: none;
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
    
    @media (max-width: 768px) {
      display: none;
    }
  }
  
  .status-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--terminal-success);
    animation: pulse 2s ease infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  .status-text {
    font-size: 0.75rem;
    color: var(--terminal-text-dim);
  }
  
  .terminal-wrapper {
    width: 100%;
    max-width: 1000px;
    height: 70vh;
    min-height: 500px;
  }
  
  .footer-content {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.75rem;
    color: var(--terminal-text-dim);
  }
  
  .footer-links {
    display: flex;
    gap: 1.5rem;
    
    a {
      color: var(--terminal-text-dim);
      transition: color 0.3s ease;
      
      &:hover {
        color: var(--terminal-accent);
      }
    }
  }
  
  .version {
    font-family: var(--font-mono);
  }
  </style>