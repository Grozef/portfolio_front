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
      <div v-for="entry in terminalStore.formattedHistory" :key="entry.id" class="output-entry"
        :class="`output-entry--${entry.type}`">
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

            <!-- Browser Info Section -->
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

            <!-- System Info Section -->
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

            <!-- Display Info Section -->
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

            <!-- Network Info Section -->
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

            <!-- Location Info Section -->
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

            <!-- Privacy Section -->
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
      <input ref="inputRef" v-model="localInput" type="text" class="terminal__input"
        :disabled="terminalStore.isProcessing" autocomplete="off" autocorrect="off" autocapitalize="off"
        spellcheck="false" @keydown="handleKeyDown" />
      <span class="cursor cursor-blink">█</span>
    </div>
  </div>

  <!-- Konami Code Animation -->
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

const { discoverEgg, EASTER_EGGS } = useEasterEggs() 

const handleSocialLinkClick = (link, event) => {
  if (link.name === 'X') {
    event.preventDefault()
    discoverEgg(EASTER_EGGS.RICKROLL)
    console.log('%c Rick Roll from Terminal! ', 'color: #c9a227; font-size: 16px; font-weight: bold;')
    window.open(link.url, '_blank')
  }
}

const emit = defineEmits(['openProject'])

const terminalStore = useTerminalStore()
const githubStore = useGitHubStore()
const router = useRouter()

const inputRef = ref(null)
const outputRef = ref(null)
const localInput = ref('')
const showKonamiAnimation = ref(false)

// Konami Code activation
const handleKonamiActivation = () => {

  const { discoverEgg, EASTER_EGGS } = useEasterEggs()
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
  ║    │ SPEED UP │ MISSILE │ DOUBLE │ LASER │   │            ║
  ║    │          │         │        │       │   │            ║
  ║    │  OPTION  │  SHIELD │                    │            ║
  ║    └──────────────────────────────────────────┘           ║
  ║                                                           ║
  ║                  ◢◣  VIC VIPER                           ║
  ║                ▬▬◢◣▬▬                                    ║
  ║                                                           ║
  ║                   ⚡ 30 LIVES ⚡                         ║
  ║                                                           ║
  ║              ↑ ↑ ↓ ↓ ← → ← → B A                          ║
  ║                                                           ║
  ╚═══════════════════════════════════════════════════════════╝
      `
  })

  setTimeout(() => {
    showKonamiAnimation.value = false
  }, 5000)
}

useKonamiCode(handleKonamiActivation)

const isMobileTerminal = ref(false)

const checkMobile = () => {
  isMobileTerminal.value = window.innerWidth < 600
}

const prompt = computed(() => {
  const time = new Date().toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  })
  if (isMobileTerminal.value) {
    return `$`
  }
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

const developerHeaderMessage = async () => {
  const { discoverEgg, EASTER_EGGS } = useEasterEggs()
  discoverEgg(EASTER_EGGS.X_CODE)

  terminalStore.addToHistory({
    type: 'output',
    format: 'ascii',
    content: `
  ╔═══════════════════════════════════════════════════════════╗
  ║                                                           ║
  ║          You've found the secret X code!                  ║
  ║                                                           ║
  ║          This was a hidden message from the developer.    ║
  ║          Thanks for exploring the terminal!               ║
  ║                                                           ║
  ╚═══════════════════════════════════════════════════════════╝
      `
  })
}

const resetEasterEggsCommand = async () => {
  const { resetEggs } = useEasterEggs()

  terminalStore.addToHistory({
    type: 'output',
    content: 'Resetting all easter eggs...'
  })

  await resetEggs()

  terminalStore.addToHistory({
    type: 'success',
    content: '✓ All easter egg progress has been reset!'
  })

  terminalStore.addToHistory({
    type: 'output',
    content: 'Start exploring again to discover all 18 easter eggs!'
  })
}

const outputEnhancedWhoami = async () => {
  const { discoverEgg, EASTER_EGGS } = useEasterEggs()

  // Browser Info
  const userAgent = navigator.userAgent
  const browserInfo = getBrowserInfo(userAgent)

  // System Info
  const platform = navigator.platform
  const cpuCores = navigator.hardwareConcurrency || 'Unknown'
  const deviceMemory = navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'Unknown'
  const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0 ? 'Yes' : 'No'

  // Display Info
  const screenWidth = window.screen.width
  const screenHeight = window.screen.height
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const colorDepth = `${window.screen.colorDepth}-bit`
  const pixelRatio = window.devicePixelRatio || 1

  // Network Info
  const isOnline = navigator.onLine ? 'Online' : 'Offline'
  let connectionType = 'Unknown'
  let connectionSpeed = 'Unknown'

  if ('connection' in navigator || 'mozConnection' in navigator || 'webkitConnection' in navigator) {
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection
    connectionType = conn.effectiveType || 'Unknown'
    if (conn.downlink) {
      connectionSpeed = `${conn.downlink} Mbps`
    }
  }

  // Privacy Settings
  const cookiesEnabled = navigator.cookieEnabled ? 'Enabled' : 'Disabled'
  const doNotTrack = navigator.doNotTrack || 'Not Set'
  const referrer = document.referrer || 'Direct'

  // Location Info
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const language = navigator.language
  const languages = navigator.languages ? navigator.languages.join(', ') : language

  // Device Type
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
  const isTablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)
  let deviceType = 'Desktop'
  if (isMobile && !isTablet) deviceType = 'Mobile'
  if (isTablet) deviceType = 'Tablet'

  terminalStore.addToHistory({
    type: 'output',
    format: 'whoami',
    content: {
      // Browser Info
      userAgent,
      browser: browserInfo.name,
      browserVersion: browserInfo.version,
      engine: browserInfo.engine,

      // System Info
      platform,
      deviceType,
      cpuCores,
      deviceMemory,
      touchSupport,

      // Display Info
      screen: `${screenWidth}x${screenHeight}`,
      viewport: `${viewportWidth}x${viewportHeight}`,
      colorDepth,
      pixelRatio,

      // Network Info
      online: isOnline,
      connectionType,
      connectionSpeed,

      // Privacy Settings
      cookiesEnabled,
      doNotTrack,
      referrer: referrer.substring(0, 50) + (referrer.length > 50 ? '...' : ''),

      // Location Info
      timezone,
      language,
      languages
    }
  })

  discoverEgg(EASTER_EGGS.ENHANCED_WHOAMI)
}

// FIX: Helper function to parse browser info
const getBrowserInfo = (ua) => {
  let name = 'Unknown'
  let version = 'Unknown'
  let engine = 'Unknown'

  // Detect browser
  if (ua.indexOf('Firefox') > -1) {
    name = 'Firefox'
    version = ua.match(/Firefox\/(\d+\.\d+)/)?.[1] || 'Unknown'
    engine = 'Gecko'
  } else if (ua.indexOf('Edg') > -1) {
    name = 'Edge'
    version = ua.match(/Edg\/(\d+\.\d+)/)?.[1] || 'Unknown'
    engine = 'Blink'
  } else if (ua.indexOf('Chrome') > -1) {
    name = 'Chrome'
    version = ua.match(/Chrome\/(\d+\.\d+)/)?.[1] || 'Unknown'
    engine = 'Blink'
  } else if (ua.indexOf('Safari') > -1) {
    name = 'Safari'
    version = ua.match(/Version\/(\d+\.\d+)/)?.[1] || 'Unknown'
    engine = 'WebKit'
  } else if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1) {
    name = 'Opera'
    version = ua.match(/(?:Opera|OPR)\/(\d+\.\d+)/)?.[1] || 'Unknown'
    engine = 'Blink'
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
      title: 'Cook and philosopher when I get the time',
      bio: `I’m a passionate developer with over 3 years of experience.
            I first studied at the Chambre de Commerce et d’Industrie (CCI) of Lyon, where I developed my skills (pun intended) in both frontend and backend development, where I first earned a degree in Web and Mobile Development (Developpeur Web et Web Mobile, DWWM - RNCP level 5) in 2024. I then continued my studies at the IT Academy (Concepteur Developpeur d'Applications CDA - RNCP level 6), completing a two-year work-study program in 2026.`,
      location: 'Lyon, France & Chichigneux, Groland',
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
      email: 'francois.lisowski@proton.me',
      github: 'github.com/Grozef',
      linkedin: 'linkedin.com/in/françois-lisowski-39a88576',
    }
  })
}

const outputSocial = () => {
  terminalStore.addToHistory({
    type: 'output',
    format: 'social',
    content: [
      { name: 'GitHub', url: 'https://github.com/Grozef', icon: '◆' },
      { name: 'LinkedIn', url: 'https://linkedin.com/in/françois-lisowski-39a88576', icon: '◆' },
      {
        name: 'X',
        url: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1',
        icon: '◆'
      },
      // { name: 'Blog', url: 'https://blog.example.com', icon: '◆' }
    ]
  })
}

const outputExperience = () => {
  terminalStore.addToHistory({
    type: 'output',
    format: 'experience',
    content: [
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
  checkMobile()
  window.addEventListener('resize', checkMobile)

  // Welcome message
  const mobileWelcome = `
  ╔══════════════════════════════╗
  ║                              ║
  ║     PORTFOLIO TERMINAL       ║
  ║                              ║
  ║  Type 'help' to start        ║
  ║  Type 'gui' for GUI mode     ║
  ║                              ║
  ╚══════════════════════════════╝`

  const desktopWelcome = `
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

  terminalStore.addToHistory({
    type: 'output',
    format: 'ascii',
    content: isMobileTerminal.value ? mobileWelcome : desktopWelcome
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style src="@/assets/styles/componentsScss/main-terminal.scss" lang="scss" scoped>

</style>