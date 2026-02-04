// Easter egg tracking composable
import { ref, computed, watch } from 'vue'

const EASTER_EGGS = {
  VIM_QUIT: 'vim_quit',
  ASCII_ART: 'ascii_art',
  FLEEING_BUTTON: 'fleeing_button',
  PROGRESSIVE_BUTTON: 'progressive_button',
  EXTREME_DARK_MODE: 'extreme_dark_mode',
  SLEEPING_CURSOR: 'sleeping_cursor',
  HUMANS_TXT: 'humans_txt',
  FOUND_404: 'found_404',
  ENHANCED_WHOAMI: 'enhanced_whoami'
}

const STORAGE_KEY = 'portfolio_easter_eggs'

// Load discovered eggs from localStorage
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

// Watch for changes and save to localStorage
watch(discoveredEggs, (newEggs) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEggs))
  } catch (error) {
    console.error('Error saving easter eggs:', error)
  }
}, { deep: true })

export function useEasterEggs() {
  const discoverEgg = (eggId) => {
    if (!discoveredEggs.value.includes(eggId)) {
      discoveredEggs.value.push(eggId)
      console.log(`🥚 Easter egg discovered: ${eggId}`)
      
      // Check if all eggs are discovered
      checkMasterEgg()
    }
  }

  const isDiscovered = (eggId) => {
    return discoveredEggs.value.includes(eggId)
  }

  const allEggsDiscovered = computed(() => {
    const totalEggs = Object.values(EASTER_EGGS).length
    return discoveredEggs.value.length >= totalEggs
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
      return true
    }
    return false
  }

  const resetEggs = () => {
    discoveredEggs.value = []
    masterEggTriggered.value = false
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem('master_egg_triggered')
  }

  return {
    EASTER_EGGS,
    discoveredEggs: computed(() => discoveredEggs.value),
    masterEggTriggered: computed(() => masterEggTriggered.value),
    allEggsDiscovered,
    progress,
    discoverEgg,
    isDiscovered,
    resetEggs
  }
}
