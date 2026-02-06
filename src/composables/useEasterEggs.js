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
  master_egg: 'Master Achievement'
}

const STORAGE_KEY = 'portfolio_easter_eggs'

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

const discoveredEggs = ref(loadFromCookies())
const masterEggTriggered = ref(false)
const isLoading = ref(false)
const isSyncing = ref(false)

if (discoveredEggs.value.includes('master_egg')) {
  masterEggTriggered.value = true
}

const progressLogged = ref(false)

const logEasterEggProgress = (force = false) => {
  if (progressLogged.value && !force) return
  progressLogged.value = true
  
  const regularEggs = Object.values(EASTER_EGGS).filter(egg => egg !== 'master_egg')
  const totalEggs = regularEggs.length
  const discoveredRegular = discoveredEggs.value.filter(egg => egg !== 'master_egg')
  const foundCount = discoveredRegular.length
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
    discoveredRegular.forEach(eggId => {
      const name = EASTER_EGG_NAMES[eggId] || eggId
      console.log(`%c[X] ${name}`, 'color: #27ca40;')
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
    console.log('%cALL EASTER EGGS FOUND!', 'color: #27ca40; font-weight: bold; font-size: 16px;')
  }
  
  console.log('')
  console.log('%cHint: Check /humans.txt for clues!', 'color: #6b6b6b; font-style: italic;')
  console.log('%cType resetEasterEggs() in console or terminal to start over', 'color: #6b6b6b; font-style: italic;')
  console.log('')
}

watch(discoveredEggs, (newEggs) => {
  try {
    saveToCookies(newEggs)
  } catch (error) {
    console.error('Error saving easter eggs:', error)
  }
}, { deep: true })

export function useEasterEggs() {
  const discoverEgg = (eggId, metadata = {}) => {
    if (!discoveredEggs.value.includes(eggId)) {
      discoveredEggs.value.push(eggId)
      
      const eggName = EASTER_EGG_NAMES[eggId] || eggId
      console.log(`%c[+] Easter Egg Discovered: ${eggName}`, 'color: #c9a227; font-weight: bold; font-size: 14px;')
      
      logEasterEggProgress(true)
    }
  }

  const isDiscovered = (eggId) => {
    return discoveredEggs.value.includes(eggId)
  }

  const allEggsDiscovered = computed(() => {
    const regularEggs = Object.values(EASTER_EGGS).filter(egg => egg !== 'master_egg')
    const discoveredRegularEggs = discoveredEggs.value.filter(egg => egg !== 'master_egg')
    const allFound = discoveredRegularEggs.length >= regularEggs.length
    
    if (allFound) {
      console.log('%cALL REGULAR EGGS DISCOVERED!', 'color: #c9a227; font-weight: bold; font-size: 16px;')
      console.log(`%cRegular eggs: ${discoveredRegularEggs.length}/${regularEggs.length}`, 'color: #27ca40; font-size: 14px;')
    }
    
    return allFound
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
    deleteCookie(STORAGE_KEY)
    
    logEasterEggProgress(true)
    
    console.log('%c[OK] Easter egg progress reset!', 'color: #27ca40; font-weight: bold;')
  }

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