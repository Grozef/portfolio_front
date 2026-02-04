// FIX: Complete Easter egg tracking with ALL eggs including Konami code
import { ref, computed, watch } from 'vue'

// FIX: Complete list with Konami code and Master egg
const EASTER_EGGS = {
  VIM_QUIT: 'vim_quit',
  ASCII_ART: 'ascii_art',
  FLEEING_BUTTON: 'fleeing_button',
  PROGRESSIVE_BUTTON: 'progressive_button',
  EXTREME_DARK_MODE: 'extreme_dark_mode',
  SLEEPING_CURSOR: 'sleeping_cursor',
  HUMANS_TXT: 'humans_txt',
  FOUND_404: 'found_404',
  ENHANCED_WHOAMI: 'enhanced_whoami',
  KONAMI_CODE: 'konami_code',           // FIX: Added Konami code
  MASTER_EGG: 'master_egg'              // FIX: Added Master egg
}

// FIX: Complete human-readable names
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
  konami_code: 'Konami Code',           // FIX: Added
  master_egg: 'Master Achievement'      // FIX: Added
}

const STORAGE_KEY = 'portfolio_easter_eggs'

const loadDiscoveredEggs = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error loading easter eggs:', error)
    return []
  }
}

// Global state for discovered easter eggs
const discoveredEggs = ref(loadDiscoveredEggs())
const masterEggTriggered = ref(localStorage.getItem('master_egg_triggered') === 'true')

// FIX: Dynamic console logger function
const logEasterEggProgress = () => {
  // FIX: Total is now 11 (including Konami and Master)
  const totalEggs = Object.values(EASTER_EGGS).length
  const foundCount = discoveredEggs.value.length
  const remaining = totalEggs - foundCount

  // Clear previous output and show updated progress
  console.clear()
  
  console.log('%c╔════════════════════════════════════════════╗', 'color: #c9a227; font-family: monospace;')
  console.log('%c║     EASTER EGGS PROGRESS                   ║', 'color: #c9a227; font-family: monospace; font-weight: bold;')
  console.log('%c╚════════════════════════════════════════════╝', 'color: #c9a227; font-family: monospace;')
  console.log('')
  console.log(`%cDécouverts: ${foundCount}/${totalEggs}`, 'color: #4a9eff; font-weight: bold; font-size: 14px;')
  console.log('')

  // Show discovered eggs
  if (foundCount > 0) {
    console.log('%cEaster Eggs Found:', 'color: #27ca40; font-weight: bold;')
    discoveredEggs.value.forEach(eggId => {
      const name = EASTER_EGG_NAMES[eggId] || eggId
      console.log(`%c✓ ${name}`, 'color: #27ca40;')
    })
    console.log('')
  }

  // FIX: French countdown for last 3 eggs
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
}

// Watch for changes and save to localStorage
watch(discoveredEggs, (newEggs) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEggs))
    // FIX: Update console on every change
    logEasterEggProgress()
  } catch (error) {
    console.error('Error saving easter eggs:', error)
  }
}, { deep: true })

export function useEasterEggs() {
  const discoverEgg = (eggId) => {
    if (!discoveredEggs.value.includes(eggId)) {
      discoveredEggs.value.push(eggId)
      
      const eggName = EASTER_EGG_NAMES[eggId] || eggId
      console.log(`%c🥚 Easter Egg Discovered: ${eggName}`, 'color: #c9a227; font-weight: bold; font-size: 14px;')
      
      // Check if all eggs are discovered (excluding master egg itself)
      checkMasterEgg()
    }
  }

  const isDiscovered = (eggId) => {
    return discoveredEggs.value.includes(eggId)
  }

  const allEggsDiscovered = computed(() => {
    // FIX: Check if all eggs EXCEPT master egg are discovered
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
      localStorage.setItem('master_egg_triggered', 'true')
      // FIX: Also add master egg to discovered list
      if (!discoveredEggs.value.includes('master_egg')) {
        discoveredEggs.value.push('master_egg')
      }
      return true
    }
    return false
  }

  const resetEggs = () => {
    discoveredEggs.value = []
    masterEggTriggered.value = false
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem('master_egg_triggered')
    logEasterEggProgress()
  }

  // FIX: Log progress on initialization
  setTimeout(() => {
    logEasterEggProgress()
  }, 1000)

  return {
    EASTER_EGGS,
    discoveredEggs: computed(() => discoveredEggs.value),
    masterEggTriggered: computed(() => masterEggTriggered.value),
    allEggsDiscovered,
    progress,
    discoverEgg,
    isDiscovered,
    resetEggs,
    logEasterEggProgress // Export for manual refresh
  }
}