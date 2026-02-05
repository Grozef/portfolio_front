import { ref, computed, watch } from 'vue'
import api from '@/services/api'

// Complete list of all easter eggs (18 total: 17 regular + 1 master)
// The count shown to users is 17 (excluding master egg from the hunt)
const EASTER_EGGS = {
  VIM_QUIT: 'vim_quit',
  // ASCII_ART: 'ascii_art',
  FLEEING_BUTTON: 'fleeing_button',
  PROGRESSIVE_BUTTON: 'progressive_button',
  EXTREME_DARK_MODE: 'extreme_dark_mode',
  SLEEPING_CURSOR: 'sleeping_cursor',
  HUMANS_TXT: 'humans_txt',
  FOUND_404: 'found_404',
  ENHANCED_WHOAMI: 'enhanced_whoami',
  KONAMI_CODE: 'konami_code',
  SWORD_CURSOR: 'sword_cursor',
  SOUND_EFFECTS: 'sound_effects',
  MUSIC_PLAYER: 'music_player',
  WEATHER_BACKGROUND: 'weather_background',
  ADBLOCK_DETECTOR: 'adblock_detector',
  FAKE_ADMIN: 'fake_admin',
  // CUSTOM_HEADER: 'custom_header',
  MASTER_EGG: 'master_egg'
}

// Human-readable names
const EASTER_EGG_NAMES = {
  vim_quit: 'Vim Command',
  ascii_art: 'ASCII Art',
  fleeing_button: 'Fleeing Button',
  progressive_button: 'Contact Button',
  extreme_dark_mode: 'Dark Mode',
  sleeping_cursor: 'Sleeping Cursor',
  humans_txt: 'humans.txt',
  found_404: '404 Game',
  enhanced_whoami: 'whoami Command',
  konami_code: 'Konami Code',
  sword_cursor: 'Sword Cursor',
  sound_effects: '8-bit Sounds',
  music_player: 'Hidden Player',
  weather_background: 'Weather Magic',
  adblock_detector: 'AdBlock Message',
  fake_admin: 'Fake Terminal',
  custom_header: 'HTTP Header',
  master_egg: 'Master Achievement'
}

const STORAGE_KEY = 'portfolio_easter_eggs'
const SESSION_KEY = 'portfolio_session_id'

// Generate or retrieve session ID
const getSessionId = () => {
  let sessionId = localStorage.getItem(SESSION_KEY)
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    localStorage.setItem(SESSION_KEY, sessionId)
  }
  return sessionId
}

// Global state
const discoveredEggs = ref([])
const masterEggTriggered = ref(false)
const isLoading = ref(false)
const isSyncing = ref(false)

// Load from backend
const loadFromBackend = async () => {
  try {
    isLoading.value = true
    const sessionId = getSessionId()
    
    const response = await api.get('/easter-eggs/progress', {
      headers: {
        'X-Session-Id': sessionId
      }
    })
    
    if (response.data.success) {
      discoveredEggs.value = response.data.data || []
      
      // Check if master egg is discovered
      if (discoveredEggs.value.includes('master_egg')) {
        masterEggTriggered.value = true
      }
      
      // Also sync with localStorage for offline access
      localStorage.setItem(STORAGE_KEY, JSON.stringify(discoveredEggs.value))
    }
  } catch (error) {
    console.error('Failed to load easter eggs from backend:', error)
    
    // Fallback to localStorage
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        discoveredEggs.value = JSON.parse(stored)
      } catch (e) {
        discoveredEggs.value = []
      }
    }
  } finally {
    isLoading.value = false
  }
}

// Save to backend
const saveToBackend = async (eggId, metadata = {}) => {
  try {
    const sessionId = getSessionId()
    
    const response = await api.post('/easter-eggs/discover', {
      egg_id: eggId,
      metadata: metadata
    }, {
      headers: {
        'X-Session-Id': sessionId
      }
    })
    
    return response.data
  } catch (error) {
    console.error('Failed to save easter egg to backend:', error)
    return null
  }
}

// Console logger - displays progress WITHOUT clearing console data
const logEasterEggProgress = () => {
  const totalEggs = Object.values(EASTER_EGGS).length
  const foundCount = discoveredEggs.value.length
  const remaining = totalEggs - foundCount
  
  console.log('')
  console.log('%c╔════════════════════════════════════════════╗', 'color: #c9a227; font-family: monospace;')
  console.log('%c║     EASTER EGGS PROGRESS                   ║', 'color: #c9a227; font-family: monospace; font-weight: bold;')
  console.log('%c╚════════════════════════════════════════════╝', 'color: #c9a227; font-family: monospace;')
  console.log('')
  console.log(`%cDiscovered: ${foundCount}/${totalEggs}`, 'color: #4a9eff; font-weight: bold; font-size: 14px;')
  console.log('')

  if (foundCount > 0) {
    console.log('%cEaster Eggs Found:', 'color: #27ca40; font-weight: bold;')
    discoveredEggs.value.forEach(eggId => {
      const name = EASTER_EGG_NAMES[eggId] || eggId
      console.log(`%c✓ ${name}`, 'color: #27ca40;')
    })
    console.log('')
  }

  if (remaining > 0) {
    let remainingMessage = ''
    
    if (remaining === 1) {
      remainingMessage = 'Il en manque un'
    } else if (remaining === 2) {
      remainingMessage = 'Il en manque deux'
    } else if (remaining === 3) {
      remainingMessage = 'Il en manque trois'
    } else {
      remainingMessage = `Remaining: ${remaining}`
    }

    console.log(`%c${remainingMessage}`, 'color: #ffa500; font-weight: bold; font-size: 14px;')
    console.log('%cKeep exploring!', 'color: #ffa500;')
  } else {
    console.log('%c🎉 ALL EASTER EGGS FOUND! 🎉', 'color: #27ca40; font-weight: bold; font-size: 16px;')
  }
  
  console.log('')
  console.log('%cHint: Check /humans.txt for clues!', 'color: #6b6b6b; font-style: italic;')
  console.log('%cType resetEasterEggs() in console or terminal to start over', 'color: #6b6b6b; font-style: italic;')
  console.log('')
}

// Watch for changes
watch(discoveredEggs, (newEggs) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEggs))
    logEasterEggProgress()
  } catch (error) {
    console.error('Error saving easter eggs:', error)
  }
}, { deep: true })

export function useEasterEggs() {
  const discoverEgg = async (eggId, metadata = {}) => {
    if (!discoveredEggs.value.includes(eggId)) {
      isSyncing.value = true
      
      // Add to local state immediately
      discoveredEggs.value.push(eggId)
      
      // Sync with backend
      await saveToBackend(eggId, metadata)
      
      const eggName = EASTER_EGG_NAMES[eggId] || eggId
      console.log(`%c🥚 Easter Egg Discovered: ${eggName}`, 'color: #c9a227; font-weight: bold; font-size: 14px;')
      
      // Check if all eggs are discovered
      checkMasterEgg()
      
      isSyncing.value = false
    }
  }

  const isDiscovered = (eggId) => {
    return discoveredEggs.value.includes(eggId)
  }

  const allEggsDiscovered = computed(() => {
    const regularEggs = Object.values(EASTER_EGGS).filter(egg => egg !== 'master_egg')
    const discoveredRegularEggs = discoveredEggs.value.filter(egg => egg !== 'master_egg')
    return discoveredRegularEggs.length >= regularEggs.length
  })

  const progress = computed(() => {
    const totalEggs = Object.values(EASTER_EGGS).length
    return {
      discovered: discoveredEggs.value.length,
      total: totalEggs,
      percentage: Math.round((discoveredEggs.value.length / totalEggs) * 100)
    }
  })

  const checkMasterEgg = () => {
    if (allEggsDiscovered.value && !masterEggTriggered.value) {
      masterEggTriggered.value = true
      
      if (!discoveredEggs.value.includes('master_egg')) {
        discoveredEggs.value.push('master_egg')
        saveToBackend('master_egg', { completedAt: new Date().toISOString() })
      }
      return true
    }
    return false
  }

  const resetEggs = async () => {
    try {
      const sessionId = getSessionId()
      
      // Reset backend
      await api.delete('/easter-eggs/reset', {
        headers: {
          'X-Session-Id': sessionId
        }
      })
      
      // Reset local state
      discoveredEggs.value = []
      masterEggTriggered.value = false
      localStorage.removeItem(STORAGE_KEY)
      
      logEasterEggProgress()
      
      console.log('%c✓ Easter egg progress reset!', 'color: #27ca40; font-weight: bold;')
    } catch (error) {
      console.error('Failed to reset easter eggs:', error)
    }
  }

  // Initialize on first use
  if (discoveredEggs.value.length === 0 && !isLoading.value) {
    loadFromBackend()
  }

  // Log progress after delay
  setTimeout(() => {
    if (!isLoading.value) {
      logEasterEggProgress()
    }
  }, 1000)

  return {
    EASTER_EGGS,
    discoveredEggs: computed(() => discoveredEggs.value),
    masterEggTriggered: computed(() => masterEggTriggered.value),
    allEggsDiscovered,
    progress,
    isLoading: computed(() => isLoading.value),
    isSyncing: computed(() => isSyncing.value),
    discoverEgg,
    isDiscovered,
    resetEggs,
    logEasterEggProgress,
    loadFromBackend
  }
}

// Register global console command
if (typeof window !== 'undefined') {
  window.resetEasterEggs = async () => {
    const { resetEggs } = useEasterEggs()
    await resetEggs()
  }
  
  window.showEasterEggs = () => {
    const { logEasterEggProgress } = useEasterEggs()
    logEasterEggProgress()
  }
}