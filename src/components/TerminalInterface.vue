<template>
  <div class="terminal-wrapper">
    <!-- Bandeau sticky en haut -->
    <transition name="slide-down">
      <div class="quick-nav" v-if="showQuickNav">
        <div class="quick-nav__content">
          <p class="quick-nav__hint">
            <span class="quick-nav__icon">💡</span>
            Not comfortable with terminal commands? 
            <button @click="router.push('/projects')" class="quick-nav__btn" data-cursor-hover>
              Switch to GUI Mode →
            </button>
          </p>
          <button @click="dismissQuickNav" class="quick-nav__close" aria-label="Close banner">
            ✕
          </button>
        </div>
      </div>
    </transition>

    <!-- Section "Why Terminal?" -->
    <transition name="fade">
      <div class="terminal-info" v-if="showTerminalInfo">
        <div class="info-card">
          <button @click="dismissTerminalInfo" class="info-close" aria-label="Close info">✕</button>
          <h3>🖥️ Why a Terminal Interface?</h3>
          <p>
            This portfolio uses a terminal interface to showcase technical skills 
            and create an interactive experience for developers and tech enthusiasts.
          </p>
          <p class="info-hint">
            <strong>Pro tip:</strong> Type "help" to see all available commands, or use the quick access cards below!
          </p>
        </div>
      </div>
    </transition>

    <!-- Mode démo indicator -->
    <transition name="fade">
      <div class="demo-indicator" v-if="demoMode">
        <span class="demo-text">📺 Demo Mode Active</span>
        <button @click="stopDemoMode" class="demo-stop" data-cursor-hover>
          Stop Demo
        </button>
      </div>
    </transition>

    <!-- Terminal principal -->
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
          <!-- Tout ton code template existant reste IDENTIQUE -->
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
          :disabled="terminalStore.isProcessing || demoMode"
          autocomplete="off" 
          autocorrect="off" 
          autocapitalize="off"
          spellcheck="false" 
          @keydown="handleKeyDown"
          @input="handleUserInput"
        />
        <span class="cursor cursor-blink">█</span>
      </div>
    </div>

    <!-- Quick commands cards -->
    <!-- <div class="quick-commands">
      <h3>Quick Access</h3>
      <div class="command-cards">
        <button 
          @click="executeQuickCommand('about')" 
          class="cmd-card"
          data-cursor-hover
          :disabled="demoMode"
        >
          <span class="cmd-icon">👤</span>
          <span class="cmd-label">About Me</span>
          <span class="cmd-hint">View bio & background</span>
        </button>
        
        <button 
          @click="executeQuickCommand('projects')" 
          class="cmd-card"
          data-cursor-hover
          :disabled="demoMode"
        >
          <span class="cmd-icon">💼</span>
          <span class="cmd-label">Projects</span>
          <span class="cmd-hint">Browse GitHub repos</span>
        </button>
        
        <button 
          @click="executeQuickCommand('skills')" 
          class="cmd-card"
          data-cursor-hover
          :disabled="demoMode"
        >
          <span class="cmd-icon">🛠️</span>
          <span class="cmd-label">Skills</span>
          <span class="cmd-hint">Tech stack & expertise</span>
        </button>
        
        <button 
          @click="executeQuickCommand('contact')" 
          class="cmd-card"
          data-cursor-hover
          :disabled="demoMode"
        >
          <span class="cmd-icon">📧</span>
          <span class="cmd-label">Contact</span>
          <span class="cmd-hint">Get in touch</span>
        </button>

        <button 
          @click="executeQuickCommand('experience')" 
          class="cmd-card"
          data-cursor-hover
          :disabled="demoMode"
        >
          <span class="cmd-icon">💻</span>
          <span class="cmd-label">Experience</span>
          <span class="cmd-hint">Work history</span>
        </button>

        <button 
          @click="executeQuickCommand('social')" 
          class="cmd-card"
          data-cursor-hover
          :disabled="demoMode"
        >
          <span class="cmd-icon">🔗</span>
          <span class="cmd-label">Social</span>
          <span class="cmd-hint">Find me online</span>
        </button>
      </div>
    </div> -->

    <!-- Konami Code Animation -->
    <KonamiAnimation :show="showKonamiAnimation" />
  </div>
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
const emit = defineEmits(['openProject'])

const terminalStore = useTerminalStore()
const githubStore = useGitHubStore()
const router = useRouter()

const inputRef = ref(null)
const outputRef = ref(null)
const localInput = ref('')
const showKonamiAnimation = ref(false)

// UI State
const showQuickNav = ref(true)
const showTerminalInfo = ref(true)

// Demo Mode State
const demoMode = ref(false)
const demoCommands = ['help', 'about', 'skills', 'projects']
let demoTimeout = null
let currentDemoCommandIndex = 0
let currentDemoCharIndex = 0

// Storage keys
const QUICK_NAV_KEY = 'hide_quick_nav'
const TERMINAL_INFO_KEY = 'hide_terminal_info'
const DEMO_TIMEOUT_MS = 5000

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
  if (!demoMode.value) {
    inputRef.value?.focus()
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    if (outputRef.value) {
      outputRef.value.scrollTop = outputRef.value.scrollHeight
    }
  })
}

// === NAVIGATION UI ===

const dismissQuickNav = () => {
  showQuickNav.value = false
  try {
    localStorage.setItem(QUICK_NAV_KEY, 'true')
  } catch (e) {
    console.error('localStorage error:', e)
  }
}

const dismissTerminalInfo = () => {
  showTerminalInfo.value = false
  try {
    localStorage.setItem(TERMINAL_INFO_KEY, 'true')
  } catch (e) {
    console.error('localStorage error:', e)
  }
}

const executeQuickCommand = (cmd) => {
  if (demoMode.value) return
  
  stopDemoMode()
  localInput.value = cmd
  terminalStore.processCommand(cmd, executeCommand)
  localInput.value = ''
  focusInput()
}

// === DEMO MODE ===

const startDemoMode = () => {
  if (demoMode.value) return
  
  demoMode.value = true
  currentDemoCommandIndex = 0
  currentDemoCharIndex = 0
  localInput.value = ''
  
  typeNextCharacter()
}

const typeNextCharacter = () => {
  if (!demoMode.value) return
  
  const currentCommand = demoCommands[currentDemoCommandIndex]
  
  if (currentDemoCharIndex < currentCommand.length) {
    localInput.value += currentCommand[currentDemoCharIndex]
    currentDemoCharIndex++
    demoTimeout = setTimeout(typeNextCharacter, 100)
  } else {
    demoTimeout = setTimeout(() => {
      executeCommand(localInput.value)
      localInput.value = ''
      currentDemoCharIndex = 0
      currentDemoCommandIndex++
      
      if (currentDemoCommandIndex < demoCommands.length) {
        demoTimeout = setTimeout(typeNextCharacter, 1500)
      } else {
        stopDemoMode()
      }
    }, 500)
  }
}

const stopDemoMode = () => {
  demoMode.value = false
  clearTimeout(demoTimeout)
  localInput.value = ''
  currentDemoCommandIndex = 0
  currentDemoCharIndex = 0
}

const resetDemoTimer = () => {
  clearTimeout(demoTimeout)
  
  if (!demoMode.value) {
    demoTimeout = setTimeout(() => {
      startDemoMode()
    }, DEMO_TIMEOUT_MS)
  }
}

const handleUserInput = () => {
  if (demoMode.value) {
    stopDemoMode()
  }
  resetDemoTimer()
}

// === TON CODE EXISTANT (executeCommand, outputHelp, etc.) ===

const handleSocialLinkClick = (link, event) => {
  if (link.name === 'X') {
    event.preventDefault()
    discoverEgg(EASTER_EGGS.RICKROLL)
    console.log('%c Rick Roll from Terminal! ', 'color: #c9a227; font-size: 16px; font-weight: bold;')
    window.open(link.url, '_blank')
  }
}

const executeCommand = async (input) => {
  const parts = input.trim().split(/\s+/)
  const command = parts[0].toLowerCase()
  const args = parts.slice(1)

  resetDemoTimer()

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

  if ('connection' in navigator || 'mozConnection' in navigator || 'webkitConnection' in navigator) {
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection
    connectionType = conn.effectiveType || 'Unknown'
    if (conn.downlink) {
      connectionSpeed = `${conn.downlink} Mbps`
    }
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

const getBrowserInfo = (ua) => {
  let name = 'Unknown'
  let version = 'Unknown'
  let engine = 'Unknown'

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
      bio: `I'm a passionate developer with over 3 years of experience.
            I first studied at the Chambre de Commerce et d'Industrie (CCI) of Lyon, where I developed my skills (pun intended) in both frontend and backend development, where I first earned a degree in Web and Mobile Development (Developpeur Web et Web Mobile, DWWM - RNCP level 5) in 2024. I then continued my studies at the IT Academy (Concepteur Developpeur d'Applications CDA - RNCP level 6), completing a two-year work-study program in 2026.`,
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
        url: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&mute=0',
        icon: '◆'
      },
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
  if (demoMode.value && e.key !== 'Escape') {
    e.preventDefault()
    return
  }

  if (e.key === 'Escape' && demoMode.value) {
    e.preventDefault()
    stopDemoMode()
    return
  }

  if (e.key === 'Enter' && !terminalStore.isProcessing && !demoMode.value) {
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
  } else if (e.key === 'l' && e.ctrlKey) {
    e.preventDefault()
    terminalStore.clearHistory()
  }
}

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

watch(() => terminalStore.history.length, () => {
  scrollToBottom()
})

onMounted(() => {
  focusInput()
  checkMobile()
  window.addEventListener('resize', checkMobile)

  try {
    const hideNav = localStorage.getItem(QUICK_NAV_KEY)
    const hideInfo = localStorage.getItem(TERMINAL_INFO_KEY)
    if (hideNav) showQuickNav.value = false
    if (hideInfo) showTerminalInfo.value = false
  } catch (e) {
    console.error('localStorage error:', e)
  }

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

  terminalStore.addToHistory({
    type: 'output',
    content: '💡 Tip: Wait 5 seconds to see a demo, or start typing commands!'
  })

  resetDemoTimer()
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  stopDemoMode()
})
</script>

<style src="@/assets/styles/componentsScss/main-terminal.scss" lang="scss" scoped></style>