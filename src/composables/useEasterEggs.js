import { ref, computed, watch } from 'vue'
import { setCookie, getCookie, deleteCookie } from '@/utils/cookies'

const EASTER_EGGS = {
  VIM_QUIT: 'vim_quit',
  ASCII_ART: 'ascii_art',
  FLEEING_BUTTON: 'fleeing_button',
  PROGRESSIVE_BUTTON: 'progressive_button',
  EXTREME_DARK_MODE: 'extreme_dark_mode',
  SLEEPING_CURSOR: 'sleeping_cursor',
  HUMANS_TXT: 'humans_txt',
  FOUND_404: 'found_404',
  DINO_GAME: 'dino_game',
  ENHANCED_WHOAMI: 'enhanced_whoami',
  KONAMI_CODE: 'konami_code',
  SWORD_CURSOR: 'sword_cursor',
  SOUND_EFFECTS: 'sound_effects',
  MUSIC_PLAYER: 'music_player',
  WEATHER_BACKGROUND: 'weather_background',
  ADBLOCK_DETECTOR: 'adblock_detector',
  FAKE_ADMIN: 'fake_admin',
  RICKROLL: 'rickroll',
  TEA_POT: 'tea_pot',
  X_CODE: 'x_code',
  MASTER_EGG: 'master_egg'
}

const EASTER_EGG_NAMES = {
  vim_quit: 'Vim Command',
  ascii_art: 'ASCII Art',
  fleeing_button: 'Fleeing Button',
  progressive_button: 'Contact Button',
  extreme_dark_mode: 'Dark Mode',
  sleeping_cursor: 'Sleeping Cursor',
  humans_txt: 'humans.txt',
  dino_game: 'Dino Game Champion',
  found_404: '404 Game',
  enhanced_whoami: 'whoami Command',
  konami_code: 'Konami Code',
  sword_cursor: 'Sword Cursor',
  sound_effects: '8-bit Sounds',
  music_player: 'Hidden Player',
  weather_background: 'Weather Magic',
  adblock_detector: 'AdBlock Message',
  fake_admin: 'Fake Terminal',
  rickroll: 'Rick Roll',
  tea_pot: 'It’s a Teapot',
  x_code: 'X Dev Message',
  master_egg: 'Master Achievement'
}

const STORAGE_KEY = 'portfolio_easter_eggs'

/* --- LEGACY COOKIE FUNCTIONS (Kept for comparison) ---
const loadFromCookies = () => {
  const stored = getCookie(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch (e) {
      return []
    }
  }
  return []
}

const saveToCookies = (eggs) => {
  const cookieConsent = getCookie('cookie_consent')
  if (cookieConsent === 'accepted') {
    setCookie(STORAGE_KEY, JSON.stringify(eggs), 365)
  }
}
------------------------------------------------------ */

/**
 * NEW: LocalStorage Loader
 * Prevents issues with cookie expiration or size limits
 */
const loadFromStorage = () => {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      return Array.isArray(parsed) ? parsed : []
    } catch (e) {
      console.error("Storage read error:", e)
      return []
    }
  }
  return []
}

/**
 * NEW: Persistence logic with security check
 * Ensures we don't overwrite progress with an empty array on load failure
 */
const saveToStorage = (eggs) => {
  if (typeof window === 'undefined') return
  
  // Guard: If incoming data is empty but storage has data, it's likely a load error
  if (eggs.length === 0 && loadFromStorage().length > 0) {
    console.warn("Save blocked: preventing accidental progress reset.")
    return
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(eggs))
}

// --- GLOBAL STATE (Initialized once) ---
const discoveredEggs = ref(loadFromStorage())
const initialized = ref(false)
const masterEggTriggered = ref(discoveredEggs.value.includes('master_egg'))
const isLoading = ref(false)
const isSyncing = ref(false)
const progressLogged = ref(false)

// --- GLOBAL WATCHER ---
// Tracks the reactive array and saves to storage automatically
watch(discoveredEggs, (newEggs) => {
  try {
    saveToStorage(newEggs)
    
    // Optional: keeping cookies in sync if consent is given
    const cookieConsent = getCookie('cookie_consent')
    if (cookieConsent === 'accepted') {
      setCookie(STORAGE_KEY, JSON.stringify(newEggs), 365)
    }
  } catch (error) {
    console.error('Error in persistence watcher:', error)
  }
}, { deep: true })


export function useEasterEggs() {
  
  if (!initialized.value) {
    initialized.value = true
  }

  /**
   * NEW VERSION: Uses spread operator for clean reactivity
   */
  const discoverEgg = (eggId) => {
    if (!eggId) return
    
    if (!discoveredEggs.value.includes(eggId)) {
      discoveredEggs.value = [...discoveredEggs.value, eggId]
      
      const eggName = EASTER_EGG_NAMES[eggId] || eggId
      console.log(`%c[+] Easter Egg Discovered: ${eggName}`, 'color: #c9a227; font-weight: bold; font-size: 14px;')
      
      logEasterEggProgress(true)
    }
  }

  /* --- OLD VERSION (Kept for comparison) ---
  const discoverEgg = (eggId, metadata = {}) => {
    if (!discoveredEggs.value.includes(eggId)) {
      discoveredEggs.value.push(eggId)
      
      const eggName = EASTER_EGG_NAMES[eggId] || eggId
      console.log(`%c[+] Easter Egg Discovered: ${eggName}`, 'color: #c9a227; font-weight: bold; font-size: 14px;')
      
      logEasterEggProgress(true)
    }
  }
  ------------------------------------------ */

  const isDiscovered = (eggId) => {
    return discoveredEggs.value.includes(eggId)
  }

  const allEggsDiscovered = computed(() => {
    const regularEggs = Object.values(EASTER_EGGS).filter(egg => egg !== 'master_egg')
    const discoveredRegularEggs = discoveredEggs.value.filter(egg => egg !== 'master_egg')
    return discoveredRegularEggs.length >= regularEggs.length
  })

  const progress = computed(() => {
    const regularEggs = Object.values(EASTER_EGGS).filter(egg => egg !== 'master_egg')
    const discoveredRegular = discoveredEggs.value.filter(egg => egg !== 'master_egg')
    return {
      discovered: discoveredRegular.length,
      total: regularEggs.length,
      percentage: Math.round((discoveredRegular.length / regularEggs.length) * 100)
    }
  })

  const resetEggs = () => {
    discoveredEggs.value = []
    masterEggTriggered.value = false
    localStorage.removeItem(STORAGE_KEY)
    deleteCookie(STORAGE_KEY)
    
    logEasterEggProgress(true)
    console.log('%c[OK] Easter egg progress reset!', 'color: #27ca40; font-weight: bold;')
  }

  const logEasterEggProgress = (force = false) => {
    if (progressLogged.value && !force) return
    progressLogged.value = true
    
    const regularEggs = Object.values(EASTER_EGGS).filter(egg => egg !== 'master_egg')
    const totalEggs = regularEggs.length
    const discoveredRegular = discoveredEggs.value.filter(egg => egg !== 'master_egg')
    const foundCount = discoveredRegular.length
    const remaining = totalEggs - foundCount
    
    console.log('\n%c╔════════════════════════════════════════════╗', 'color: #c9a227; font-family: monospace;')
    console.log('%c║      EASTER EGGS PROGRESS                  ║', 'color: #c9a227; font-family: monospace; font-weight: bold;')
    console.log('%c╚════════════════════════════════════════════╝', 'color: #c9a227; font-family: monospace;')
    console.log(`%cDiscovered: ${foundCount}/${totalEggs}`, 'color: #4a9eff; font-weight: bold; font-size: 14px;')

    if (foundCount > 0) {
      console.log('%cEaster Eggs Found:', 'color: #27ca40; font-weight: bold;')
      discoveredRegular.forEach(eggId => {
        const name = EASTER_EGG_NAMES[eggId] || eggId
        console.log(`%c[X] ${name}`, 'color: #27ca40;')
      })
    }

    if (remaining > 0) {
      const remainingMessage = remaining === 1 ? 'Only one left!' : `Remaining: ${remaining}`
      console.log(`%c${remainingMessage}`, 'color: #ffa500; font-weight: bold;')
    } else {
      console.log('%cALL EASTER EGGS FOUND!', 'color: #27ca40; font-weight: bold; font-size: 16px;')
    }
  }

  // Initial delay for the console log to appear after page load
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
    logEasterEggProgress
  }
}

/**
 * GLOBAL CONSOLE ACCESS
 */
if (typeof window !== 'undefined') {
  window.resetEasterEggs = () => {
    const { resetEggs } = useEasterEggs()
    resetEggs()
  }
  
  window.showEasterEggs = () => {
    const { logEasterEggProgress } = useEasterEggs()
    logEasterEggProgress(true)
  }
}