<template>
  <div class="terminal-viewport" ref="containerRef">
    <div 
      class="terminal-scaler" 
      :style="{ 
        transform: `scale(${scaleFactor})`, 
        width: `${baseWidth}px` 
      }"
    >
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
          <div v-for="entry in terminalStore.formattedHistory" :key="entry.id" class="output-entry"
            :class="`output-entry--${entry.type}`">
            
            <template v-if="entry.type === 'input'">
              <span class="prompt">{{ prompt }} $</span>
              <span class="command">{{ entry.content }}</span>
            </template>

            <template v-else-if="entry.format === 'ascii'">
              <pre class="ascii-art">{{ entry.content }}</pre>
            </template>

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

            <template v-else-if="entry.format === 'help-single'">
              <div class="help-output">
                <p class="help-title">Command: {{ entry.content.name }}</p>
                <p class="cmd-desc">{{ entry.content.description }}</p>
                <p class="cmd-usage" v-if="entry.content.usage">Usage: {{ entry.content.usage }}</p>
              </div>
            </template>

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

            <template v-else-if="entry.format === 'contact'">
              <div class="contact-output">
                <div v-for="(value, key) in entry.content" :key="key" class="contact-item">
                  <span class="contact-label">{{ key }}:</span>
                  <span class="contact-value">{{ value }}</span>
                </div>
              </div>
            </template>

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
                  @click="handleSocialLinkClick(link, $event)"
                >
                  <span class="social-icon">{{ link.icon }}</span>
                  {{ link.name }}
                </a>
              </div>
            </template>

            <template v-else-if="entry.format === 'whoami'">
              <div class="whoami-output">
                <div class="whoami-header">
                  <span class="whoami-title">=== WHOAMI OUTPUT ===</span>
                </div>

                <div class="whoami-section">
                  <div class="section-title">[Browser Info]</div>
                  <div class="whoami-grid">
                    <div class="whoami-item">
                      <span class="whoami-label">Browser:</span>
                      <span class="whoami-value">{{ entry.content.browser }} {{ entry.content.browserVersion }}</span>
                    </div>
                    <div class="whoami-item">
                      <span class="whoami-label">Engine:</span>
                      <span class="whoami-value">{{ entry.content.engine }}</span>
                    </div>
                    <div class="whoami-item">
                      <span class="whoami-label">Cookies:</span>
                      <span class="whoami-value">{{ entry.content.cookiesEnabled }}</span>
                    </div>
                    <div class="whoami-item">
                      <span class="whoami-label">Do Not Track:</span>
                      <span class="whoami-value">{{ entry.content.doNotTrack }}</span>
                    </div>
                  </div>
                </div>

                <div class="whoami-section">
                  <div class="section-title">[System Info]</div>
                  <div class="whoami-grid">
                    <div class="whoami-item">
                      <span class="whoami-label">Platform:</span>
                      <span class="whoami-value">{{ entry.content.platform }}</span>
                    </div>
                    <div class="whoami-item">
                      <span class="whoami-label">Device Type:</span>
                      <span class="whoami-value">{{ entry.content.deviceType }}</span>
                    </div>
                    <div class="whoami-item">
                      <span class="whoami-label">CPU Cores:</span>
                      <span class="whoami-value">{{ entry.content.cpuCores }}</span>
                    </div>
                    <div class="whoami-item">
                      <span class="whoami-label">Memory:</span>
                      <span class="whoami-value">{{ entry.content.deviceMemory }}</span>
                    </div>
                    <div class="whoami-item">
                      <span class="whoami-label">Touch Support:</span>
                      <span class="whoami-value">{{ entry.content.touchSupport }}</span>
                    </div>
                  </div>
                </div>

                <div class="whoami-section">
                  <div class="section-title">[Display Info]</div>
                  <div class="whoami-grid">
                    <div class="whoami-item">
                      <span class="whoami-label">Screen:</span>
                      <span class="whoami-value">{{ entry.content.screen }}</span>
                    </div>
                    <div class="whoami-item">
                      <span class="whoami-label">Viewport:</span>
                      <span class="whoami-value">{{ entry.content.viewport }}</span>
                    </div>
                    <div class="whoami-item">
                      <span class="whoami-label">Color Depth:</span>
                      <span class="whoami-value">{{ entry.content.colorDepth }}</span>
                    </div>
                    <div class="whoami-item">
                      <span class="whoami-label">Pixel Ratio:</span>
                      <span class="whoami-value">{{ entry.content.pixelRatio }}</span>
                    </div>
                  </div>
                </div>

                <div class="whoami-section">
                  <div class="section-title">[Network Info]</div>
                  <div class="whoami-grid">
                    <div class="whoami-item">
                      <span class="whoami-label">Status:</span>
                      <span class="whoami-value">{{ entry.content.online }}</span>
                    </div>
                    <div class="whoami-item">
                      <span class="whoami-label">Type:</span>
                      <span class="whoami-value">{{ entry.content.connectionType }}</span>
                    </div>
                    <div class="whoami-item">
                      <span class="whoami-label">Speed:</span>
                      <span class="whoami-value">{{ entry.content.connectionSpeed }}</span>
                    </div>
                  </div>
                </div>

                <div class="whoami-section">
                  <div class="section-title">[Location Info]</div>
                  <div class="whoami-grid">
                    <div class="whoami-item">
                      <span class="whoami-label">Timezone:</span>
                      <span class="whoami-value">{{ entry.content.timezone }}</span>
                    </div>
                    <div class="whoami-item">
                      <span class="whoami-label">Language:</span>
                      <span class="whoami-value">{{ entry.content.language }}</span>
                    </div>
                    <div class="whoami-item wide">
                      <span class="whoami-label">Languages:</span>
                      <span class="whoami-value">{{ entry.content.languages }}</span>
                    </div>
                  </div>
                </div>

                <div class="whoami-section">
                  <div class="section-title">[Privacy Settings]</div>
                  <div class="whoami-grid">
                    <div class="whoami-item wide">
                      <span class="whoami-label">Referrer:</span>
                      <span class="whoami-value">{{ entry.content.referrer }}</span>
                    </div>
                    <div class="whoami-item wide">
                      <span class="whoami-label">User Agent:</span>
                      <span class="whoami-value small">{{ entry.content.userAgent }}</span>
                    </div>
                  </div>
                </div>

                <div class="whoami-footer">
                  <small>Your privacy is important. This information is only displayed to you.</small>
                </div>
              </div>
            </template>

            <template v-else-if="entry.type === 'error'">
              <span class="error-text">{{ entry.content }}</span>
            </template>

            <template v-else-if="entry.type === 'success'">
              <span class="success-text">{{ entry.content }}</span>
            </template>

            <template v-else>
              <span class="output-text">{{ entry.content }}</span>
            </template>
          </div>
        </div>

        <div class="terminal__input-line">
          <span class="prompt">{{ prompt }} $</span>
          <input ref="inputRef" v-model="localInput" type="text" class="terminal__input"
            :disabled="terminalStore.isProcessing" autocomplete="off" autocorrect="off" autocapitalize="off"
            spellcheck="false" @keydown="handleKeyDown" />
          <span class="cursor cursor-blink">█</span>
        </div>
      </div>
    </div>
  </div>

  <KonamiAnimation :show="showKonamiAnimation" />
</template>

<script setup>
import { ref, nextTick, onMounted, onUnmounted, watch, computed } from 'vue'
import { useTerminalStore } from '@/stores/terminal'
import { useGitHubStore } from '@/stores/github'
import { useRouter } from 'vue-router'
import { useKonamiCode } from '@/composables/useKonamiCode'
import KonamiAnimation from './KonamiAnimationGradius.vue'
import { useEasterEggs } from '@/composables/useEasterEggs'

const { discoverEgg, resetEggs, EASTER_EGGS } = useEasterEggs() 

const emit = defineEmits(['openProject'])
const terminalStore = useTerminalStore()
const githubStore = useGitHubStore()
const router = useRouter()

const containerRef = ref(null)
const inputRef = ref(null)
const outputRef = ref(null)
const localInput = ref('')
const showKonamiAnimation = ref(false)

// Viewport Logic Variables
const scaleFactor = ref(1)
const baseWidth = 1024 // Fixed internal width to prevent layout break

const handleResize = () => {
  if (containerRef.value) {
    const containerWidth = containerRef.value.offsetWidth
    scaleFactor.value = Math.min(1, containerWidth / baseWidth)
  }
}

const handleSocialLinkClick = (link, event) => {
  if (link.name === 'X') {
    event.preventDefault()
    discoverEgg(EASTER_EGGS.RICKROLL)
    console.log('%c Rick Roll from Terminal! ', 'color: #c9a227; font-size: 16px; font-weight: bold;')
    window.open(link.url, '_blank')
  }
}

// Konami Code activation
const handleKonamiActivation = () => {
  discoverEgg(EASTER_EGGS.KONAMI_CODE)
  showKonamiAnimation.value = true
  terminalStore.addToHistory({
    type: 'output',
    format: 'ascii',
    content: `
  ╔═══════════════════════════════════════════════════════════╗
  ║                                                           ║
  ║              ▲                                            ║
  ║             ▲▲▲         GRADIUS POWER UP!                 ║
  ║            ▲▲ ▲▲                                          ║
  ║           ▲▲   ▲▲       KONAMI CODE ACTIVATED             ║
  ║          ▲▲▲▲▲▲▲▲▲                                        ║
  ║                                                           ║
  ║    ┌──────────────────────────────────────────┐           ║
  ║    │ SPEED UP │ MISSILE │ DOUBLE │ LASER │   │           ║
  ║    │          │         │        │       │   │           ║
  ║    │  OPTION  │  SHIELD │                    │           ║
  ║    └──────────────────────────────────────────┘           ║
  ║                                                           ║
  ║                  ◢◣  VIC VIPER                            ║
  ║                ▬▬◢◣▬▬                                     ║
  ║                                                           ║
  ║                   ⚡ 30 LIVES ⚡                          ║
  ║                                                           ║
  ║               ↑ ↑ ↓ ↓ ← → ← → B A                         ║
  ║                                                           ║
  ╚═══════════════════════════════════════════════════════════╝
      `
  })

  setTimeout(() => {
    showKonamiAnimation.value = false
  }, 5000)
}

useKonamiCode(handleKonamiActivation)

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

// Command Executor
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
      await outputEnhancedWhoami()
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
    case 'resetegg()':
      await resetEasterEggsCommand()
      break
    case 'x_project_dj_fresh_2005':
      await developerHeaderMessage()
      break  
    default:
      terminalStore.addToHistory({
        type: 'error',
        content: `Command not found: ${command}. Type 'help' for available commands.`
      })
  }
}

// Developer Easter Egg Message
const developerHeaderMessage = async () => {
  discoverEgg(EASTER_EGGS.X_CODE)
  terminalStore.addToHistory({
    type: 'output',
    format: 'ascii',
    content: `
  ╔═══════════════════════════════════════════════════════════╗
  ║                                                           ║
  ║           You've found the secret X code!                 ║
  ║                                                           ║
  ║           This was a hidden message from the developer.   ║
  ║           Thanks for exploring the terminal!              ║
  ║                                                           ║
  ╚═══════════════════════════════════════════════════════════╝
      `
  })
}

// Reset Progress Command
const resetEasterEggsCommand = async () => {
  terminalStore.addToHistory({ type: 'output', content: 'Resetting all easter eggs...' })
  await resetEggs()
  terminalStore.addToHistory({ type: 'success', content: '✓ All easter egg progress has been reset!' })
  terminalStore.addToHistory({ type: 'output', content: 'Start exploring again to discover all 18 easter eggs!' })
}

// System Information Collector
const outputEnhancedWhoami = async () => {
  const userAgent = navigator.userAgent
  const browserInfo = getBrowserInfo(userAgent)
  const platform = navigator.platform
  const cpuCores = navigator.hardwareConcurrency || 'Unknown'
  const deviceMemory = navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'Unknown'
  const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0 ? 'Yes' : 'No'
  const screenWidth = window.screen.width
  const screenHeight = window.screen.height
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const colorDepth = `${window.screen.colorDepth}-bit`
  const pixelRatio = window.devicePixelRatio || 1
  const isOnline = navigator.onLine ? 'Online' : 'Offline'
  
  let connectionType = 'Unknown'
  let connectionSpeed = 'Unknown'
  if ('connection' in navigator) {
    const conn = navigator.connection
    connectionType = conn.effectiveType || 'Unknown'
    if (conn.downlink) connectionSpeed = `${conn.downlink} Mbps`
  }

  const cookiesEnabled = navigator.cookieEnabled ? 'Enabled' : 'Disabled'
  const doNotTrack = navigator.doNotTrack || 'Not Set'
  const referrer = document.referrer || 'Direct'
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const language = navigator.language
  const languages = navigator.languages ? navigator.languages.join(', ') : language

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
  const isTablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)
  let deviceType = 'Desktop'
  if (isMobile && !isTablet) deviceType = 'Mobile'
  if (isTablet) deviceType = 'Tablet'

  terminalStore.addToHistory({
    type: 'output',
    format: 'whoami',
    content: {
      userAgent,
      browser: browserInfo.name,
      browserVersion: browserInfo.version,
      engine: browserInfo.engine,
      platform,
      deviceType,
      cpuCores,
      deviceMemory,
      touchSupport,
      screen: `${screenWidth}x${screenHeight}`,
      viewport: `${viewportWidth}x${viewportHeight}`,
      colorDepth,
      pixelRatio,
      online: isOnline,
      connectionType,
      connectionSpeed,
      cookiesEnabled,
      doNotTrack,
      referrer: referrer.substring(0, 50) + (referrer.length > 50 ? '...' : ''),
      timezone,
      language,
      languages
    }
  })
  discoverEgg(EASTER_EGGS.ENHANCED_WHOAMI)
}

// Browser Detection Helper
const getBrowserInfo = (ua) => {
  let name = 'Unknown', version = 'Unknown', engine = 'Unknown'
  if (ua.indexOf('Firefox') > -1) {
    name = 'Firefox'; engine = 'Gecko'
    version = ua.match(/Firefox\/(\d+\.\d+)/)?.[1] || 'Unknown'
  } else if (ua.indexOf('Edg') > -1) {
    name = 'Edge'; engine = 'Blink'
    version = ua.match(/Edg\/(\d+\.\d+)/)?.[1] || 'Unknown'
  } else if (ua.indexOf('Chrome') > -1) {
    name = 'Chrome'; engine = 'Blink'
    version = ua.match(/Chrome\/(\d+\.\d+)/)?.[1] || 'Unknown'
  } else if (ua.indexOf('Safari') > -1) {
    name = 'Safari'; engine = 'WebKit'
    version = ua.match(/Version\/(\d+\.\d+)/)?.[1] || 'Unknown'
  }
  return { name, version, engine }
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
      title: 'Cook and philosopher when I have the time',
      bio: `I’m a passionate developer with over 3 years of experience. I first studied at CCI Lyon (RNCP 5) in 2024, then continued at the IT Academy (Concepteur Développeur d'Applications CDA - RNCP level 6), completing my work-study in 2026.`,
      location: 'Lyon, France & Chichigneux, Groland',
      status: 'Open to opportunities'
    }
  })
}

const outputProjects = async (pinnedOnly) => {
  terminalStore.addToHistory({ type: 'output', content: 'Fetching repositories from GitHub...' })
  if (pinnedOnly) {
    await githubStore.fetchPinnedRepos()
    terminalStore.addToHistory({ type: 'output', format: 'projects', content: githubStore.pinnedRepos })
  } else {
    await githubStore.fetchRepositories()
    terminalStore.addToHistory({ type: 'output', format: 'projects', content: githubStore.sortedRepositories.slice(0, 10) })
  }
}

const openProject = async (name) => {
  terminalStore.addToHistory({ type: 'output', content: `Loading project: ${name}...` })
  const repo = await githubStore.fetchRepository(name)
  if (repo) emit('openProject', repo)
  else terminalStore.addToHistory({ type: 'error', content: `Project not found: ${name}` })
}

const outputSkills = (category) => {
  const skills = {
    frontend: ['Vue.js', 'React', 'TypeScript', 'Tailwind CSS', 'SCSS', 'GSAP'],
    backend: ['Laravel', 'Node.js', 'PostgreSQL', 'Redis', 'GraphQL'],
    devops: ['Docker', 'AWS', 'CI/CD', 'Nginx', 'Linux'],
    tools: ['Git', 'Figma', 'VS Code', 'Postman', 'Webpack']
  }
  if (category && skills[category.toLowerCase()]) {
    terminalStore.addToHistory({ type: 'output', format: 'skills', content: { [category.toLowerCase()]: skills[category.toLowerCase()] } })
  } else {
    terminalStore.addToHistory({ type: 'output', format: 'skills', content: skills })
  }
}

const outputContact = () => {
  terminalStore.addToHistory({
    type: 'output', format: 'contact',
    content: {
      email: 'francois.lisowski@proton.me',
      github: 'github.com/Grozef',
      linkedin: 'linkedin.com/in/françois-lisowski-39a88576',
    }
  })
}

const outputSocial = () => {
  terminalStore.addToHistory({
    type: 'output', format: 'social',
    content: [
      { name: 'GitHub', url: 'https://github.com/Grozef', icon: '◆' },
      { name: 'LinkedIn', url: 'https://linkedin.com/in/françois-lisowski-39a88576', icon: '◆' },
      { name: 'X', url: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&mute=0', icon: '◆' }
    ]
  })
}

const outputExperience = () => {
  terminalStore.addToHistory({
    type: 'output', format: 'experience',
    content: [
      {
        title: "Full Stack Developer", company: "Lab", period: "2024 – Present",
        description: "Designed and developed an internal SaaS platforms for warranty management. Maintenance of spare parts management apps. Built mobile apps for factory inspections."
      },
      {
        title: "Backend Developer", company: "High Connexion", period: "2023",
        description: "Developed a CLI tool for automated phone number processing. Technologies: Symfony 7.4, MySQL."
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
    e.preventDefault(); localInput.value = terminalStore.getPreviousCommand()
  } else if (e.key === 'ArrowDown') {
    e.preventDefault(); localInput.value = terminalStore.getNextCommand()
  } else if (e.key === 'l' && e.ctrlKey) {
    e.preventDefault(); terminalStore.clearHistory()
  }
}

watch(() => terminalStore.history.length, scrollToBottom)

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
  focusInput()
  terminalStore.addToHistory({
    type: 'output', format: 'ascii',
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

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style lang="scss" scoped>
// Viewport logic: creates a container that allows the terminal to scale
.terminal-viewport {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow: hidden;
}

// Scaler: applies the CSS transform while maintaining the virtual width
.terminal-scaler {
  transform-origin: top center;
  transition: transform 0.2s ease-out;
  flex-shrink: 0;
  height: 100%;
}

.terminal {
  background: var(--terminal-bg);
  border: 1px solid var(--terminal-border);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset;

  &__header {
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem;
    background: var(--terminal-bg-secondary);
    border-bottom: 1px solid var(--terminal-border);
    gap: 1rem;
  }

  &__controls { display: flex; gap: 8px; }
  &__title { flex: 1; font-size: 0.8rem; color: var(--terminal-text-dim); text-align: center; }
  &__status { display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; color: var(--terminal-text-dim); }

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
    &:disabled { opacity: 0.5; }
  }
}

// UI Controls
.control { width: 12px; height: 12px; border-radius: 50%; }
.control--close { background: #ff5f56; }
.control--minimize { background: #ffbd2e; }
.control--maximize { background: #27ca40; }
.status-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--terminal-warning); &.active { background: var(--terminal-success); } }

// Text & Prompt
.prompt { color: var(--terminal-accent); margin-right: 0.5rem; white-space: nowrap; }
.command { color: var(--terminal-text); }
.cursor { color: var(--terminal-accent); }
.output-entry { margin-bottom: 0.5rem; &--error .error-text { color: var(--terminal-error); } }
.ascii-art { font-size: 0.6rem; line-height: 1.2; color: var(--terminal-accent); }

// Modules
.help-output { margin-top: 0.5rem; .help-title { color: var(--terminal-accent); margin-bottom: 0.5rem; } .help-item { display: flex; gap: 1rem; .cmd-name { color: var(--terminal-accent-secondary); min-width: 120px; } .cmd-desc { color: var(--terminal-text-dim); } } }
.about-output { margin-top: 0.5rem; padding-left: 1rem; border-left: 2px solid var(--terminal-accent); .about-name { font-size: 1.25rem; color: var(--terminal-accent); font-weight: 600; } .about-title { color: var(--terminal-accent-secondary); margin-bottom: 0.5rem; } .about-bio { color: var(--terminal-text); white-space: pre-line; margin-bottom: 0.5rem; } .about-meta { color: var(--terminal-text-dim); font-size: 0.85rem; } .status-available { color: var(--terminal-success); } }
.projects-output { display: flex; flex-direction: column; gap: 1rem; margin-top: 0.5rem; .project-item { padding: 0.75rem; background: var(--terminal-bg-secondary); border: 1px solid var(--terminal-border); border-radius: 6px; .project-name { color: var(--terminal-accent); font-weight: 500; cursor: pointer; &:hover { text-decoration: underline; } } .project-lang { font-size: 0.75rem; padding: 0.125rem 0.5rem; background: var(--terminal-border); border-radius: 4px; color: var(--terminal-accent-secondary); } .project-desc { color: var(--terminal-text-dim); font-size: 0.85rem; margin-bottom: 0.25rem; } .project-stats { display: flex; gap: 1rem; font-size: 0.8rem; color: var(--terminal-text-dim); } .project-hint { display: block; font-size: 0.75rem; color: var(--terminal-text-dim); margin-top: 0.5rem; opacity: 0.7; } } }
.skills-output { display: flex; flex-direction: column; gap: 1rem; margin-top: 0.5rem; .skill-category .category-name { display: block; color: var(--terminal-accent); font-weight: 600; margin-bottom: 0.5rem; font-size: 0.8rem; letter-spacing: 0.1em; } .skill-list { display: flex; flex-wrap: wrap; gap: 0.5rem; .skill-tag { padding: 0.25rem 0.75rem; background: var(--terminal-bg-secondary); border: 1px solid var(--terminal-border); border-radius: 4px; font-size: 0.85rem; color: var(--terminal-text); &:hover { border-color: var(--terminal-accent); color: var(--terminal-accent); } } } }
.contact-output { margin-top: 0.5rem; .contact-item { margin-bottom: 0.25rem; .contact-label { color: var(--terminal-accent); margin-right: 0.5rem; text-transform: capitalize; } .contact-value { color: var(--terminal-text); } } }
.experience-output { display: flex; flex-direction: column; gap: 1rem; margin-top: 0.5rem; .exp-item { padding-left: 1rem; border-left: 2px solid var(--terminal-border); &:hover { border-color: var(--terminal-accent); } .exp-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; .exp-title { color: var(--terminal-accent); font-weight: 500; } .exp-period { color: var(--terminal-text-dim); font-size: 0.8rem; } } .exp-company { color: var(--terminal-accent-secondary); font-size: 0.9rem; } .exp-desc { color: var(--terminal-text-dim); font-size: 0.85rem; margin-top: 0.25rem; } } }
.social-output { display: flex; gap: 1rem; margin-top: 0.5rem; flex-wrap: wrap; .social-link { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: var(--terminal-bg-secondary); border: 1px solid var(--terminal-border); border-radius: 4px; color: var(--terminal-text); transition: all 0.2s ease; &:hover { border-color: var(--terminal-accent); color: var(--terminal-accent); } } .social-icon { color: var(--terminal-accent); } }

// whoami custom styling
.whoami-output { margin-top: 0.5rem; padding: 1rem; background: var(--terminal-bg-secondary); border: 1px solid var(--terminal-border); border-radius: 6px; .whoami-header { margin-bottom: 1.5rem; padding-bottom: 0.75rem; border-bottom: 2px solid var(--terminal-accent); .whoami-title { color: var(--terminal-accent); font-weight: 700; font-size: 1rem; letter-spacing: 0.05em; font-family: var(--font-mono); } } .whoami-section { margin-bottom: 1.5rem; &:last-of-type { margin-bottom: 0; } .section-title { color: var(--terminal-accent-secondary); font-weight: 600; font-size: 0.875rem; margin-bottom: 0.75rem; padding: 0.25rem 0; border-bottom: 1px solid var(--terminal-border); font-family: var(--font-mono); } .whoami-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 0.5rem; .whoami-item { display: flex; justify-content: space-between; padding: 0.4rem 0.75rem; background: var(--terminal-bg); border-radius: 4px; border-left: 2px solid transparent; transition: border-color 0.2s ease; &:hover { border-left-color: var(--terminal-accent); } &.wide { grid-column: 1 / -1; } .whoami-label { color: var(--terminal-text-dim); font-size: 0.8rem; font-weight: 500; min-width: 120px; font-family: var(--font-mono); } .whoami-value { color: var(--terminal-text); font-weight: 400; text-align: right; flex: 1; font-size: 0.85rem; font-family: var(--font-mono); &.small { font-size: 0.7rem; word-break: break-all; } } } } } .whoami-footer { margin-top: 1.5rem; padding-top: 0.75rem; border-top: 1px solid var(--terminal-border); text-align: center; small { color: var(--terminal-text-dim); font-size: 0.75rem; font-style: italic; } } }

.error-text { color: var(--terminal-error); }
.success-text { color: var(--terminal-success); }
.output-text { color: var(--terminal-text); }
.cursor-blink { animation: blink 1s step-end infinite; }
@keyframes blink { 50% { opacity: 0; } }
</style>