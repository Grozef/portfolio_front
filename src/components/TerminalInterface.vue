<script setup>
  import { ref, nextTick, onMounted, watch, computed } from 'vue'
  import { useTerminalStore } from '@/stores/terminal'
  import { useGitHubStore } from '@/stores/github'
  import { useRouter } from 'vue-router'
  
  const emit = defineEmits(['openProject'])
  
  const terminalStore = useTerminalStore()
  const githubStore = useGitHubStore()
  const router = useRouter()
  
  const inputRef = ref(null)
  const outputRef = ref(null)
  const localInput = ref('')
  
  const prompt = computed(() => {
    const time = new Date().toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    })
    return `visitor@portfolio [${time}]`
  })
  
  const focusInput = () => {
    inputRef.value?.focus()
  }
  
  const scrollToBottom = () => {
    nextTick(() => {
      if (outputRef.value) {
        outputRef.value.scrollTop = outputRef.value.scrollHeight
      }
    })
  }
  
  const executeCommand = async (input) => {
    const parts = input.trim().split(/\s+/)
    const command = parts[0].toLowerCase()
    const args = parts.slice(1)
  
    switch (command) {
      case 'help':
        outputHelp(args[0])
        break
  
      case 'clear':
        terminalStore.clearHistory()
        break
  
      case 'about':
        outputAbout()
        break
  
      case 'projects':
        await outputProjects(args.includes('--pinned'))
        break
  
      case 'open':
        if (args[0]) {
          await openProject(args[0])
        } else {
          terminalStore.addToHistory({
            type: 'error',
            content: 'Usage: open <project-name>'
          })
        }
        break
  
      case 'skills':
        outputSkills(args[0])
        break
  
      case 'contact':
        outputContact()
        break
  
      case 'whoami':
        terminalStore.addToHistory({
          type: 'output',
          content: 'visitor — Welcome to my portfolio!'
        })
        break
  
      case 'date':
        terminalStore.addToHistory({
          type: 'output',
          content: new Date().toString()
        })
        break
  
      case 'echo':
        terminalStore.addToHistory({
          type: 'output',
          content: args.join(' ') || ''
        })
        break
  
      case 'social':
        outputSocial()
        break
  
      case 'experience':
        outputExperience()
        break
  
      case 'gui':
        terminalStore.addToHistory({
          type: 'output',
          content: 'Switching to GUI mode...'
        })
        setTimeout(() => router.push('/projects'), 500)
        break
  
      case 'theme':
        terminalStore.addToHistory({
          type: 'output',
          content: 'Theme switching coming soon!'
        })
        break
  
      default:
        terminalStore.addToHistory({
          type: 'error',
          content: `Command not found: ${command}. Type 'help' for available commands.`
        })
    }
  }
  
  const outputHelp = (specificCommand) => {
    if (specificCommand && terminalStore.availableCommands[specificCommand]) {
      const cmd = terminalStore.availableCommands[specificCommand]
      terminalStore.addToHistory({
        type: 'output',
        format: 'help-single',
        content: {
          name: specificCommand,
          description: cmd.description,
          usage: cmd.usage
        }
      })
    } else {
      terminalStore.addToHistory({
        type: 'output',
        format: 'help',
        content: Object.entries(terminalStore.availableCommands).map(([name, cmd]) => ({
          name,
          description: cmd.description
        }))
      })
    }
  }
  
  const outputAbout = () => {
    terminalStore.addToHistory({
      type: 'output',
      format: 'about',
      content: {
        name: 'Full Stack Developer',
        title: 'Creative Technologist',
        bio: `Passionate developer with expertise in modern web technologies.
  Building elegant solutions with clean code and thoughtful architecture.
  Specializing in Vue.js, Laravel, and cloud infrastructure.`,
        location: 'Available Worldwide',
        status: 'Open to opportunities'
      }
    })
  }
  
  const outputProjects = async (pinnedOnly) => {
    terminalStore.addToHistory({
      type: 'output',
      content: 'Fetching repositories from GitHub...'
    })
  
    if (pinnedOnly) {
      await githubStore.fetchPinnedRepos()
      terminalStore.addToHistory({
        type: 'output',
        format: 'projects',
        content: githubStore.pinnedRepos
      })
    } else {
      await githubStore.fetchRepositories()
      terminalStore.addToHistory({
        type: 'output',
        format: 'projects',
        content: githubStore.sortedRepositories.slice(0, 10)
      })
    }
  }
  
  const openProject = async (name) => {
    terminalStore.addToHistory({
      type: 'output',
      content: `Loading project: ${name}...`
    })
  
    const repo = await githubStore.fetchRepository(name)
    
    if (repo) {
      emit('openProject', repo)
    } else {
      terminalStore.addToHistory({
        type: 'error',
        content: `Project not found: ${name}`
      })
    }
  }
  
  const outputSkills = (category) => {
    const skills = {
      frontend: ['Vue.js', 'React', 'TypeScript', 'Tailwind CSS', 'SCSS', 'GSAP'],
      backend: ['Laravel', 'Node.js', 'PostgreSQL', 'Redis', 'GraphQL'],
      devops: ['Docker', 'AWS', 'CI/CD', 'Nginx', 'Linux'],
      tools: ['Git', 'Figma', 'VS Code', 'Postman', 'Webpack']
    }
  
    if (category && skills[category.toLowerCase()]) {
      terminalStore.addToHistory({
        type: 'output',
        format: 'skills',
        content: { [category.toLowerCase()]: skills[category.toLowerCase()] }
      })
    } else {
      terminalStore.addToHistory({
        type: 'output',
        format: 'skills',
        content: skills
      })
    }
  }
  
  const outputContact = () => {
    terminalStore.addToHistory({
      type: 'output',
      format: 'contact',
      content: {
        email: 'hello@example.com',
        github: 'github.com/username',
        linkedin: 'linkedin.com/in/username',
        twitter: '@username'
      }
    })
  }
  
  const outputSocial = () => {
    terminalStore.addToHistory({
      type: 'output',
      format: 'social',
      content: [
        { name: 'GitHub', url: 'https://github.com/username', icon: '◆' },
        { name: 'LinkedIn', url: 'https://linkedin.com/in/username', icon: '◆' },
        { name: 'Twitter', url: 'https://twitter.com/username', icon: '◆' },
        { name: 'Blog', url: 'https://blog.example.com', icon: '◆' }
      ]
    })
  }
  
  const outputExperience = () => {
    terminalStore.addToHistory({
      type: 'output',
      format: 'experience',
      content: [
        {
          title: 'Senior Full Stack Developer',
          company: 'Tech Company',
          period: '2022 - Present',
          description: 'Leading development of microservices architecture'
        },
        {
          title: 'Full Stack Developer',
          company: 'Startup Inc',
          period: '2020 - 2022',
          description: 'Built and scaled SaaS platform from 0 to 100k users'
        },
        {
          title: 'Frontend Developer',
          company: 'Digital Agency',
          period: '2018 - 2020',
          description: 'Developed interactive web experiences'
        }
      ]
    })
  }
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !terminalStore.isProcessing) {
      e.preventDefault()
      terminalStore.processCommand(localInput.value, executeCommand)
      localInput.value = ''
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      localInput.value = terminalStore.getPreviousCommand()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      localInput.value = terminalStore.getNextCommand()
    } else if (e.key === 'Tab') {
      e.preventDefault()
      // Auto-complete could be implemented here
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      terminalStore.clearHistory()
    }
  }
  
  watch(() => terminalStore.history.length, () => {
    scrollToBottom()
  })
  
  onMounted(() => {
    focusInput()
    
    // Welcome message
    terminalStore.addToHistory({
      type: 'output',
      format: 'ascii',
      content: `
  ╔════════════════════════════════════════════════════════════════════════════╗
  ║                                                                            ║
  ║   ██████╗  ██████╗ ██████╗ ████████╗███████╗ ██████╗ ██╗     ██╗ ██████╗   ║
  ║   ██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██╔════╝██╔═══██╗██║     ██║██╔═══██╗  ║
  ║   ██████╔╝██║   ██║██████╔╝   ██║   █████╗  ██║   ██║██║     ██║██║   ██║  ║
  ║   ██╔═══╝ ██║   ██║██╔══██╗   ██║   ██╔══╝  ██║   ██║██║     ██║██║   ██║  ║
  ║   ██║     ╚██████╔╝██║  ██║   ██║   ██║     ╚██████╔╝███████╗██║╚██████╔╝  ║
  ║   ╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝      ╚═════╝ ╚══════╝╚═╝ ╚═════╝   ║
  ║                                                                            ║
  ║   Welcome to my interactive portfolio terminal                             ║
  ║   Type 'help' to see available commands                                    ║
  ║   Type 'gui' to switch to graphical mode                                   ║
  ║                                                                            ║
  ╚════════════════════════════════════════════════════════════════════════════╝`
    })
  })
  </script>
  
  <template>
    <div class="terminal" @click="focusInput">
      <div class="terminal__header">
        <div class="terminal__controls">
          <span class="control control--close"></span>
          <span class="control control--minimize"></span>
          <span class="control control--maximize"></span>
        </div>
        <span class="terminal__title">portfolio@terminal ~ </span>
        <div class="terminal__status">
          <span class="status-dot" :class="{ active: !terminalStore.isProcessing }"></span>
          <span class="status-text">{{ terminalStore.isProcessing ? 'Processing...' : 'Ready' }}</span>
        </div>
      </div>
  
      <div ref="outputRef" class="terminal__output">
        <div
          v-for="entry in terminalStore.formattedHistory"
          :key="entry.id"
          class="output-entry"
          :class="`output-entry--${entry.type}`"
        >
          <!-- Input echo -->
          <template v-if="entry.type === 'input'">
            <span class="prompt">{{ prompt }} $</span>
            <span class="command">{{ entry.content }}</span>
          </template>
  
          <!-- ASCII art -->
          <template v-else-if="entry.format === 'ascii'">
            <pre class="ascii-art">{{ entry.content }}</pre>
          </template>
  
          <!-- Help output -->
          <template v-else-if="entry.format === 'help'">
            <div class="help-output">
              <p class="help-title">Available Commands:</p>
              <div class="help-list">
                <div v-for="cmd in entry.content" :key="cmd.name" class="help-item">
                  <span class="cmd-name">{{ cmd.name }}</span>
                  <span class="cmd-desc">{{ cmd.description }}</span>
                </div>
              </div>
            </div>
          </template>
  
          <!-- About output -->
          <template v-else-if="entry.format === 'about'">
            <div class="about-output">
              <p class="about-name">{{ entry.content.name }}</p>
              <p class="about-title">{{ entry.content.title }}</p>
              <p class="about-bio">{{ entry.content.bio }}</p>
              <p class="about-meta">
                <span class="label">Location:</span> {{ entry.content.location }}
              </p>
              <p class="about-meta">
                <span class="label">Status:</span> 
                <span class="status-available">{{ entry.content.status }}</span>
              </p>
            </div>
          </template>
  
          <!-- Projects output -->
          <template v-else-if="entry.format === 'projects'">
            <div class="projects-output">
              <div v-for="repo in entry.content" :key="repo.name" class="project-item">
                <div class="project-header">
                  <span class="project-name" data-cursor-hover>{{ repo.name }}</span>
                  <span class="project-lang" v-if="repo.language">{{ repo.language }}</span>
                </div>
                <p class="project-desc">{{ repo.description || 'No description' }}</p>
                <div class="project-stats">
                  <span class="stat">★ {{ repo.stars || 0 }}</span>
                  <span class="stat">⑂ {{ repo.forks || 0 }}</span>
                </div>
                <span class="project-hint">Type: open {{ repo.name }}</span>
              </div>
            </div>
          </template>
  
          <!-- Skills output -->
          <template v-else-if="entry.format === 'skills'">
            <div class="skills-output">
              <div v-for="(skills, category) in entry.content" :key="category" class="skill-category">
                <span class="category-name">{{ category.toUpperCase() }}</span>
                <div class="skill-list">
                  <span v-for="skill in skills" :key="skill" class="skill-tag">{{ skill }}</span>
                </div>
              </div>
            </div>
          </template>
  
          <!-- Contact output -->
          <template v-else-if="entry.format === 'contact'">
            <div class="contact-output">
              <div v-for="(value, key) in entry.content" :key="key" class="contact-item">
                <span class="contact-label">{{ key }}:</span>
                <span class="contact-value">{{ value }}</span>
              </div>
            </div>
          </template>
  
          <!-- Experience output -->
          <template v-else-if="entry.format === 'experience'">
            <div class="experience-output">
              <div v-for="exp in entry.content" :key="exp.title + exp.company" class="exp-item">
                <div class="exp-header">
                  <span class="exp-title">{{ exp.title }}</span>
                  <span class="exp-period">{{ exp.period }}</span>
                </div>
                <span class="exp-company">@ {{ exp.company }}</span>
                <p class="exp-desc">{{ exp.description }}</p>
              </div>
            </div>
          </template>
  
          <!-- Social output -->
          <template v-else-if="entry.format === 'social'">
            <div class="social-output">
              <a 
                v-for="link in entry.content" 
                :key="link.name"
                :href="link.url"
                target="_blank"
                rel="noopener"
                class="social-link"
                data-cursor-hover
              >
                <span class="social-icon">{{ link.icon }}</span>
                {{ link.name }}
              </a>
            </div>
          </template>
  
          <!-- Error output -->
          <template v-else-if="entry.type === 'error'">
            <span class="error-text">{{ entry.content }}</span>
          </template>
  
          <!-- Default output -->
          <template v-else>
            <span class="output-text">{{ entry.content }}</span>
          </template>
        </div>
      </div>
  
      <div class="terminal__input-line">
        <span class="prompt">{{ prompt }} $</span>
        <input
          ref="inputRef"
          v-model="localInput"
          type="text"
          class="terminal__input"
          :disabled="terminalStore.isProcessing"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          @keydown="handleKeyDown"
        />
        <span class="cursor cursor-blink">█</span>
      </div>
    </div>
  </template>
  
  <style lang="scss" scoped>
  .terminal {
    background: var(--terminal-bg);
    border: 1px solid var(--terminal-border);
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 100%;
    max-height: 80vh;
    box-shadow: 
      0 25px 50px -12px rgba(0, 0, 0, 0.5),
      0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  
    &__header {
      display: flex;
      align-items: center;
      padding: 0.75rem 1rem;
      background: var(--terminal-bg-secondary);
      border-bottom: 1px solid var(--terminal-border);
      gap: 1rem;
    }
  
    &__controls {
      display: flex;
      gap: 8px;
    }
  
    &__title {
      flex: 1;
      font-size: 0.8rem;
      color: var(--terminal-text-dim);
      text-align: center;
    }
  
    &__status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      color: var(--terminal-text-dim);
    }
  
    &__output {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
      font-size: 0.9rem;
      line-height: 1.6;
    }
  
    &__input-line {
      display: flex;
      align-items: center;
      padding: 0.75rem 1rem;
      border-top: 1px solid var(--terminal-border);
      background: var(--terminal-bg-secondary);
    }
  
    &__input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      color: var(--terminal-text);
      font-family: inherit;
      font-size: inherit;
      caret-color: transparent;
  
      &:disabled {
        opacity: 0.5;
      }
    }
  }
  
  .control {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    
    &--close { background: #ff5f56; }
    &--minimize { background: #ffbd2e; }
    &--maximize { background: #27ca40; }
  }
  
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--terminal-warning);
    
    &.active {
      background: var(--terminal-success);
    }
  }
  
  .prompt {
    color: var(--terminal-accent);
    margin-right: 0.5rem;
    white-space: nowrap;
  }
  
  .command {
    color: var(--terminal-text);
  }
  
  .cursor {
    color: var(--terminal-accent);
  }
  
  .output-entry {
    margin-bottom: 0.5rem;
    
    &--error .error-text {
      color: var(--terminal-error);
    }
  }
  
  .ascii-art {
    font-size: 0.6rem;
    line-height: 1.2;
    color: var(--terminal-accent);
    
    @media (max-width: 768px) {
      font-size: 0.4rem;
    }
  }
  
  // Help styles
  .help-output {
    margin-top: 0.5rem;
  }
  
  .help-title {
    color: var(--terminal-accent);
    margin-bottom: 0.5rem;
  }
  
  .help-list {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .help-item {
    display: flex;
    gap: 1rem;
  }
  
  .cmd-name {
    color: var(--terminal-accent-secondary);
    min-width: 120px;
  }
  
  .cmd-desc {
    color: var(--terminal-text-dim);
  }
  
  // About styles
  .about-output {
    margin-top: 0.5rem;
    padding-left: 1rem;
    border-left: 2px solid var(--terminal-accent);
  }
  
  .about-name {
    font-size: 1.25rem;
    color: var(--terminal-accent);
    font-weight: 600;
  }
  
  .about-title {
    color: var(--terminal-accent-secondary);
    margin-bottom: 0.5rem;
  }
  
  .about-bio {
    color: var(--terminal-text);
    white-space: pre-line;
    margin-bottom: 0.5rem;
  }
  
  .about-meta {
    color: var(--terminal-text-dim);
    font-size: 0.85rem;
    
    .label {
      color: var(--terminal-text-dim);
    }
  }
  
  .status-available {
    color: var(--terminal-success);
  }
  
  // Projects styles
  .projects-output {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 0.5rem;
  }
  
  .project-item {
    padding: 0.75rem;
    background: var(--terminal-bg-secondary);
    border: 1px solid var(--terminal-border);
    border-radius: 6px;
  }
  
  .project-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.25rem;
  }
  
  .project-name {
    color: var(--terminal-accent);
    font-weight: 500;
    cursor: pointer;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  .project-lang {
    font-size: 0.75rem;
    padding: 0.125rem 0.5rem;
    background: var(--terminal-border);
    border-radius: 4px;
    color: var(--terminal-accent-secondary);
  }
  
  .project-desc {
    color: var(--terminal-text-dim);
    font-size: 0.85rem;
    margin-bottom: 0.25rem;
  }
  
  .project-stats {
    display: flex;
    gap: 1rem;
    font-size: 0.8rem;
    color: var(--terminal-text-dim);
  }
  
  .project-hint {
    display: block;
    font-size: 0.75rem;
    color: var(--terminal-text-dim);
    margin-top: 0.5rem;
    opacity: 0.7;
  }
  
  // Skills styles
  .skills-output {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 0.5rem;
  }
  
  .skill-category {
    .category-name {
      display: block;
      color: var(--terminal-accent);
      font-weight: 600;
      margin-bottom: 0.5rem;
      font-size: 0.8rem;
      letter-spacing: 0.1em;
    }
  }
  
  .skill-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .skill-tag {
    padding: 0.25rem 0.75rem;
    background: var(--terminal-bg-secondary);
    border: 1px solid var(--terminal-border);
    border-radius: 4px;
    font-size: 0.85rem;
    color: var(--terminal-text);
    
    &:hover {
      border-color: var(--terminal-accent);
      color: var(--terminal-accent);
    }
  }
  
  // Contact styles
  .contact-output {
    margin-top: 0.5rem;
  }
  
  .contact-item {
    margin-bottom: 0.25rem;
  }
  
  .contact-label {
    color: var(--terminal-accent);
    margin-right: 0.5rem;
    text-transform: capitalize;
  }
  
  .contact-value {
    color: var(--terminal-text);
  }
  
  // Experience styles
  .experience-output {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 0.5rem;
  }
  
  .exp-item {
    padding-left: 1rem;
    border-left: 2px solid var(--terminal-border);
    
    &:hover {
      border-color: var(--terminal-accent);
    }
  }
  
  .exp-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.25rem;
  }
  
  .exp-title {
    color: var(--terminal-accent);
    font-weight: 500;
  }
  
  .exp-period {
    color: var(--terminal-text-dim);
    font-size: 0.8rem;
  }
  
  .exp-company {
    color: var(--terminal-accent-secondary);
    font-size: 0.9rem;
  }
  
  .exp-desc {
    color: var(--terminal-text-dim);
    font-size: 0.85rem;
    margin-top: 0.25rem;
  }
  
  // Social styles
  .social-output {
    display: flex;
    gap: 1rem;
    margin-top: 0.5rem;
    flex-wrap: wrap;
  }
  
  .social-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--terminal-bg-secondary);
    border: 1px solid var(--terminal-border);
    border-radius: 4px;
    color: var(--terminal-text);
    transition: all 0.2s ease;
    
    &:hover {
      border-color: var(--terminal-accent);
      color: var(--terminal-accent);
    }
  }
  
  .social-icon {
    color: var(--terminal-accent);
  }
  
  .output-text {
    color: var(--terminal-text);
  }
  </style>