<template>
  <div class="terminal-interface" @click="focusInput">
    <!-- Dismissible overlays -->
    <TerminalQuickNav />
    <TerminalInfoCard />
    <TerminalDemoIndicator :active="demoMode" @stop="stopDemoMode" />

    <!-- Terminal box -->
    <div class="terminal">
      <TerminalHeader :is-processing="terminalStore.isProcessing" />

      <div ref="outputRef" class="terminal__output">
        <TerminalOutput :history="terminalStore.formattedHistory" :prompt="prompt" />
      </div>

      <TerminalInput
        ref="terminalInput"
        :model-value="localInput"
        :prompt="prompt"
        :is-processing="terminalStore.isProcessing || demoMode"
        @update:model-value="handleUserModelUpdate"
        @submit="handleSubmit"
        @history-up="localInput = terminalStore.getPreviousCommand()"
        @history-down="localInput = terminalStore.getNextCommand()"
      />
    </div>

    <!-- Quick-access command cards (mobile navigation) -->
    <div class="quick-commands">
      <h3>Quick Access</h3>
      <div class="command-cards">
        <button
          v-for="card in quickCommandCards"
          :key="card.command"
          class="cmd-card"
          :data-command="card.command"
          data-cursor-hover
          :disabled="demoMode"
          @click="executeQuickCommand(card.command)"
        >
          <span class="cmd-icon">{{ card.icon }}</span>
          <span class="cmd-label">{{ card.label }}</span>
          <span class="cmd-hint">{{ card.hint }}</span>
        </button>
      </div>
    </div>

    <KonamiAnimation :show="showKonamiAnimation" />
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTerminalStore } from '@/stores/terminal'
import { useGitHubStore } from '@/stores/github'
import { useEasterEggs } from '@/composables/useEasterEggs'
import { useKonamiCode } from '@/composables/useKonamiCode'

import TerminalHeader        from './terminalComponents/TerminalHeader.vue'
import TerminalInput         from './terminalComponents/TerminalInput.vue'
import TerminalOutput        from './terminalComponents/TerminalOutput.vue'
import TerminalQuickNav      from './terminalComponents/TerminalQuickNav.vue'
import TerminalInfoCard      from './terminalComponents/TerminalInfoCard.vue'
import TerminalDemoIndicator from './terminalComponents/TerminalDemoIndicator.vue'
import KonamiAnimation       from './KonamiAnimationGradius.vue'

// ─── Stores / composables ─────────────────────────────────────────────────────

const terminalStore = useTerminalStore()
const githubStore   = useGitHubStore()
const router        = useRouter()
const { discoverEgg, EASTER_EGGS } = useEasterEggs()

const emit = defineEmits(['openProject'])

// ─── Refs ─────────────────────────────────────────────────────────────────────

const outputRef           = ref(null)
const terminalInput       = ref(null)
const localInput          = ref('')
const showKonamiAnimation = ref(false)
const isMobile            = ref(false)

// ─── Demo mode ────────────────────────────────────────────────────────────────

const demoMode        = ref(false)
const demoCommands    = ['help', 'about', 'skills', 'projects']
const DEMO_TIMEOUT_MS = 120000
let demoTimeout       = null
let demoCommandIndex  = 0
let demoCharIndex     = 0

const typeNextCharacter = () => {
  if (!demoMode.value) return

  const cmd = demoCommands[demoCommandIndex]

  if (demoCharIndex < cmd.length) {
    localInput.value += cmd[demoCharIndex++]
    demoTimeout = setTimeout(typeNextCharacter, 100)
  } else {
    demoTimeout = setTimeout(() => {
      executeCommand(localInput.value)
      localInput.value = ''
      demoCharIndex = 0
      demoCommandIndex++

      if (demoCommandIndex < demoCommands.length) {
        demoTimeout = setTimeout(typeNextCharacter, 1500)
      } else {
        stopDemoMode()
      }
    }, 500)
  }
}

const startDemoMode = () => {
  if (demoMode.value) return
  demoMode.value   = true
  demoCommandIndex = 0
  demoCharIndex    = 0
  localInput.value = ''
  typeNextCharacter()
}

const stopDemoMode = () => {
  demoMode.value   = false
  localInput.value = ''
  demoCommandIndex = 0
  demoCharIndex    = 0
  clearTimeout(demoTimeout)
}

const resetDemoTimer = () => {
  clearTimeout(demoTimeout)
  if (!demoMode.value) {
    demoTimeout = setTimeout(startDemoMode, DEMO_TIMEOUT_MS)
  }
}

// ─── Prompt / focus ───────────────────────────────────────────────────────────

const checkMobile = () => { isMobile.value = window.innerWidth < 600 }

const prompt = computed(() => {
  const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
  return isMobile.value ? '$' : `visitor@portfolio [${time}]`
})

const focusInput = () => {
  if (!demoMode.value) terminalInput.value?.focus()
}

const scrollToBottom = () => {
  nextTick(() => {
    if (outputRef.value) outputRef.value.scrollTop = outputRef.value.scrollHeight
  })
}

// ─── Input handling ───────────────────────────────────────────────────────────

// Handles real user typing via update:modelValue emitted from TerminalInput.
// Programmatic writes to localInput.value (demo typing) do NOT go through
// this handler, so the demo cannot accidentally kill itself.
const handleUserModelUpdate = (val) => {
  localInput.value = val
  if (!demoMode.value) resetDemoTimer()
}

const handleSubmit = (text) => {
  if (demoMode.value) return
  terminalStore.processCommand(text, executeCommand)
  localInput.value = ''
}

// Escape stops demo mode regardless of input focus
const handleGlobalKeydown = (e) => {
  if (e.key === 'Escape' && demoMode.value) {
    e.preventDefault()
    stopDemoMode()
  }
}

// ─── Quick-access command cards ───────────────────────────────────────────────

const quickCommandCards = [
  { command: 'about',      icon: '👤', label: 'About Me',   hint: 'View bio & background'  },
  { command: 'projects',   icon: '💼', label: 'Projects',   hint: 'Browse GitHub repos'    },
  { command: 'skills',     icon: '🛠️', label: 'Skills',     hint: 'Tech stack & expertise' },
  { command: 'contact',    icon: '📧', label: 'Contact',    hint: 'Get in touch'            },
  { command: 'experience', icon: '💻', label: 'Experience', hint: 'Work history'            },
  { command: 'social',     icon: '🔗', label: 'Social',     hint: 'Find me online'          },
]

const executeQuickCommand = (cmd) => {
  if (demoMode.value) return
  stopDemoMode()
  localInput.value = cmd
  terminalStore.processCommand(cmd, executeCommand)
  localInput.value = ''
  focusInput()
}

// ─── Commands ─────────────────────────────────────────────────────────────────

const executeCommand = async (input) => {
  const parts   = input.trim().split(/\s+/)
  const command = parts[0].toLowerCase()
  const args    = parts.slice(1)

  resetDemoTimer()

  switch (command) {
    case 'help':       outputHelp(args[0]); break
    case 'clear':      terminalStore.clearHistory(); break
    case 'about':      outputAbout(); break
    case 'projects':   await outputProjects(args.includes('--pinned')); break
    case 'open':
      if (args[0]) { await openProject(args[0]) }
      else { terminalStore.addToHistory({ type: 'error', content: 'Usage: open <project-name>' }) }
      break
    case 'skills':     outputSkills(args[0]); break
    case 'contact':    outputContact(); break
    case 'whoami':     await outputEnhancedWhoami(); break
    case 'date':       terminalStore.addToHistory({ type: 'output', content: new Date().toString() }); break
    case 'echo':       terminalStore.addToHistory({ type: 'output', content: args.join(' ') || '' }); break
    case 'social':     outputSocial(); break
    case 'experience': outputExperience(); break
    case 'gui':
      terminalStore.addToHistory({ type: 'output', content: 'Switching to GUI mode...' })
      setTimeout(() => router.push('/projects'), 500)
      break
    case 'theme':
      terminalStore.addToHistory({ type: 'output', content: 'Theme switching coming soon!' })
      break
    case 'resetegg()':              await resetEasterEggsCommand(); break
    case 'x_project_dj_fresh_2005': await developerHeaderMessage(); break
    default:
      terminalStore.addToHistory({
        type: 'error',
        content: `Command not found: ${command}. Type 'help' for available commands.`
      })
  }
}

// ─── Output functions ─────────────────────────────────────────────────────────

const outputHelp = (specific) => {
  if (specific && terminalStore.availableCommands[specific]) {
    const cmd = terminalStore.availableCommands[specific]
    terminalStore.addToHistory({ type: 'output', format: 'help-single', content: { name: specific, description: cmd.description, usage: cmd.usage } })
  } else {
    terminalStore.addToHistory({
      type: 'output',
      format: 'help',
      content: Object.entries(terminalStore.availableCommands).map(([name, cmd]) => ({ name, description: cmd.description }))
    })
  }
}

const outputAbout = () => {
  terminalStore.addToHistory({
    type: 'output',
    format: 'about',
    content: {
      name:     'Full Stack Developer',
      title:    'Cook and philosopher when I get the time',
      bio:      `I'm a passionate developer with over 3 years of experience.
            I first studied at the Chambre de Commerce et d'Industrie (CCI) of Lyon, where I developed my skills (pun intended) in both frontend and backend development, where I first earned a degree in Web and Mobile Development (Developpeur Web et Web Mobile, DWWM - RNCP level 5) in 2024. I then continued my studies at the IT Academy (Concepteur Developpeur d'Applications CDA - RNCP level 6), completing a two-year work-study program in 2026.`,
      location: 'Lyon, France & Chichigneux, Groland',
      status:   'Open to opportunities'
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
  if (repo) { emit('openProject', repo) }
  else { terminalStore.addToHistory({ type: 'error', content: `Project not found: ${name}` }) }
}

const outputSkills = (category) => {
  const skills = {
    frontend: ['Vue.js', 'React', 'TypeScript', 'Tailwind CSS', 'SCSS', 'GSAP'],
    backend:  ['Laravel', 'Node.js', 'PostgreSQL', 'Redis', 'GraphQL'],
    devops:   ['Docker', 'AWS', 'CI/CD', 'Nginx', 'Linux'],
    tools:    ['Git', 'Figma', 'VS Code', 'Postman', 'Webpack']
  }
  const key = category?.toLowerCase()
  terminalStore.addToHistory({
    type: 'output',
    format: 'skills',
    content: (key && skills[key]) ? { [key]: skills[key] } : skills
  })
}

const outputContact = () => {
  terminalStore.addToHistory({
    type: 'output',
    format: 'contact',
    content: {
      email:    'francois.lisowski@proton.me',
      github:   'github.com/Grozef',
      linkedin: 'linkedin.com/in/francois-lisowski-39a88576'
    }
  })
}

const outputSocial = () => {
  terminalStore.addToHistory({
    type: 'output',
    format: 'social',
    content: [
      { name: 'GitHub',   url: 'https://github.com/Grozef',                                                     icon: '◆' },
      { name: 'LinkedIn', url: 'https://linkedin.com/in/francois-lisowski-39a88576',                            icon: '◆' },
      { name: 'X',        url: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&mute=0',         icon: '◆' }
    ]
  })
}

const outputExperience = () => {
  terminalStore.addToHistory({
    type: 'output',
    format: 'experience',
    content: [
      {
        title:       'Full Stack Developer',
        company:     'Lab',
        period:      '2024 – Present',
        description:
          'Designed and developed an internal SaaS platforms for warranty management.\n' +
          "Maintenance of the company's spare parts management app.\n" +
          'Built a mobile application for factory inspections, enabling offline data collection with sync capabilities to a central server.\n' +
          'Technologies: Vue3, Quasar, Ionic, Laravel, REST APIs, Pinia (state management), Cypress (testing).\n' +
          'Environment: Docker, GitHub (collaboration), Laragon (local development).'
      },
      {
        title:       'Backend Developer',
        company:     'High Connexion',
        period:      '2023',
        description:
          'Developed a CLI tool for automated phone number processing (validation, formatting, and export).\n' +
          'Optimized performance and integrated with third-party systems.\n' +
          'Technologies: Symfony 7.4, MySQL.'
      }
    ]
  })
}

const outputEnhancedWhoami = async () => {
  const ua          = navigator.userAgent
  const bi          = getBrowserInfo(ua)
  const conn        = navigator.connection || navigator.mozConnection || navigator.webkitConnection
  const isMob       = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
  const isTab       = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)
  const device      = isTab ? 'Tablet' : isMob ? 'Mobile' : 'Desktop'
  const referrerRaw = document.referrer || 'Direct'
  const referrer    = referrerRaw.substring(0, 50) + (referrerRaw.length > 50 ? '...' : '')

  terminalStore.addToHistory({
    type: 'output',
    format: 'whoami',
    content: {
      userAgent:       ua,
      browser:         bi.name,
      browserVersion:  bi.version,
      engine:          bi.engine,
      platform:        navigator.platform,
      deviceType:      device,
      cpuCores:        navigator.hardwareConcurrency || 'Unknown',
      deviceMemory:    navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'Unknown',
      touchSupport:    'ontouchstart' in window || navigator.maxTouchPoints > 0 ? 'Yes' : 'No',
      screen:          `${window.screen.width}x${window.screen.height}`,
      viewport:        `${window.innerWidth}x${window.innerHeight}`,
      colorDepth:      `${window.screen.colorDepth}-bit`,
      pixelRatio:      window.devicePixelRatio || 1,
      online:          navigator.onLine ? 'Online' : 'Offline',
      connectionType:  conn?.effectiveType || 'Unknown',
      connectionSpeed: conn?.downlink ? `${conn.downlink} Mbps` : 'Unknown',
      cookiesEnabled:  navigator.cookieEnabled ? 'Enabled' : 'Disabled',
      doNotTrack:      navigator.doNotTrack || 'Not Set',
      referrer,
      timezone:        Intl.DateTimeFormat().resolvedOptions().timeZone,
      language:        navigator.language,
      languages:       navigator.languages ? navigator.languages.join(', ') : navigator.language
    }
  })

  discoverEgg(EASTER_EGGS.ENHANCED_WHOAMI)
}

const getBrowserInfo = (ua) => {
  if (ua.includes('Firefox'))                      return { name: 'Firefox', version: ua.match(/Firefox\/([\d.]+)/)?.[1]       || 'Unknown', engine: 'Gecko'  }
  if (ua.includes('Edg'))                          return { name: 'Edge',    version: ua.match(/Edg\/([\d.]+)/)?.[1]           || 'Unknown', engine: 'Blink'  }
  if (ua.includes('Chrome'))                       return { name: 'Chrome',  version: ua.match(/Chrome\/([\d.]+)/)?.[1]        || 'Unknown', engine: 'Blink'  }
  if (ua.includes('Safari'))                       return { name: 'Safari',  version: ua.match(/Version\/([\d.]+)/)?.[1]       || 'Unknown', engine: 'WebKit' }
  if (ua.includes('Opera') || ua.includes('OPR'))  return { name: 'Opera',   version: ua.match(/(?:Opera|OPR)\/([\d.]+)/)?.[1] || 'Unknown', engine: 'Blink'  }
  return { name: 'Unknown', version: 'Unknown', engine: 'Unknown' }
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
  ╚═══════════════════════════════════════════════════════════╝`
  })
}

const resetEasterEggsCommand = async () => {
  const { resetEggs } = useEasterEggs()
  terminalStore.addToHistory({ type: 'output',  content: 'Resetting all easter eggs...' })
  await resetEggs()
  terminalStore.addToHistory({ type: 'success', content: '✓ All easter egg progress has been reset!' })
  terminalStore.addToHistory({ type: 'output',  content: 'Start exploring again to discover all 18 easter eggs!' })
}

// ─── Konami ───────────────────────────────────────────────────────────────────

useKonamiCode(() => {
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
  ╚═══════════════════════════════════════════════════════════╝`
  })
  setTimeout(() => { showKonamiAnimation.value = false }, 5000)
})

// ─── Watchers / lifecycle ─────────────────────────────────────────────────────

watch(() => terminalStore.history.length, scrollToBottom)

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  document.addEventListener('keydown', handleGlobalKeydown)
  focusInput()

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

  terminalStore.addToHistory({ type: 'output', format: 'ascii', content: isMobile.value ? mobileWelcome : desktopWelcome })
  terminalStore.addToHistory({ type: 'output', content: '💡 Tip: Wait 2 minutes to see a demo, or start typing commands!' })

  resetDemoTimer()
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  document.removeEventListener('keydown', handleGlobalKeydown)
  stopDemoMode()
})
</script>

<style src="@/assets/styles/componentsScss/main-terminal.scss" lang="scss" scoped></style>