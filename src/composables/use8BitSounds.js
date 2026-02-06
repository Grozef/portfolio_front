import { ref } from 'vue'
import { useEasterEggs } from './useEasterEggs'

const soundsInitialized = ref(false)
const audioContext = ref(null)

// HTML5 Audio for 8-bit music
const music8Bit = ref(null)
const isMusicPlaying = ref(false)

// Initialize music element
if (typeof window !== 'undefined') {
  music8Bit.value = new Audio('/sound/djartmusic-the-return-of-the-8-bit-era-301292.mp3')
  music8Bit.value.loop = true
  music8Bit.value.volume = 1
}

// Create 8-bit style sound using Web Audio API
const create8BitSound = (frequency = 440, duration = 0.1, type = 'square') => {
  if (!audioContext.value) {
    audioContext.value = new (window.AudioContext || window.webkitAudioContext)()
  }

  const ctx = audioContext.value
  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()

  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)
  
  gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)

  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)

  oscillator.start(ctx.currentTime)
  oscillator.stop(ctx.currentTime + duration)
}

// Different sound variations
const soundEffects = {
  hover: () => create8BitSound(800, 0.05, 'square'),
  click: () => create8BitSound(600, 0.08, 'triangle'),
  success: () => {
    create8BitSound(523, 0.08, 'square')
    setTimeout(() => create8BitSound(659, 0.08, 'square'), 80)
    setTimeout(() => create8BitSound(784, 0.15, 'square'), 160)
  },
  blip: () => create8BitSound(1000, 0.03, 'square')
}

export function use8BitSounds() {
  const { discoverEgg, EASTER_EGGS, isDiscovered } = useEasterEggs()
  
  // Play beep sound effect (for hover)
  const playSound = (soundType = 'hover') => {
    try {
      if (soundEffects[soundType]) {
        soundEffects[soundType]()
      }
      
      // Discover easter egg on first sound play
      if (!soundsInitialized.value && !isDiscovered(EASTER_EGGS.SOUND_EFFECTS)) {
        soundsInitialized.value = true
        discoverEgg(EASTER_EGGS.SOUND_EFFECTS)
      }
    } catch (error) {
      console.error('Failed to play sound:', error)
    }
  }

  // Toggle 8-bit music (for click)
  const toggleMusic = () => {
    if (!music8Bit.value) return

    try {
      if (isMusicPlaying.value) {
        music8Bit.value.pause()
        isMusicPlaying.value = false
      } else {
        music8Bit.value.play()
        isMusicPlaying.value = true
        
        // Discover easter egg on first music play
        if (!soundsInitialized.value && !isDiscovered(EASTER_EGGS.SOUND_EFFECTS)) {
          soundsInitialized.value = true
          discoverEgg(EASTER_EGGS.SOUND_EFFECTS)
        }
      }
    } catch (error) {
      console.error('Failed to toggle music:', error)
    }
  }

  // Play 8-bit music
  const playMusic = () => {
    if (!music8Bit.value || isMusicPlaying.value) return
    
    try {
      music8Bit.value.play()
      isMusicPlaying.value = true
      
      if (!soundsInitialized.value && !isDiscovered(EASTER_EGGS.SOUND_EFFECTS)) {
        soundsInitialized.value = true
        discoverEgg(EASTER_EGGS.SOUND_EFFECTS)
      }
    } catch (error) {
      console.error('Failed to play music:', error)
    }
  }

  // Pause 8-bit music
  const pauseMusic = () => {
    if (!music8Bit.value || !isMusicPlaying.value) return
    
    try {
      music8Bit.value.pause()
      isMusicPlaying.value = false
    } catch (error) {
      console.error('Failed to pause music:', error)
    }
  }

  const playHoverSound = () => playSound('hover')
  const playClickSound = () => playSound('click')
  const playSuccessSound = () => playSound('success')
  const playBlipSound = () => playSound('blip')

  return {
    // Sound effects
    playSound,
    playHoverSound,
    playClickSound,
    playSuccessSound,
    playBlipSound,
    
    // Music controls
    toggleMusic,
    playMusic,
    pauseMusic,
    isMusicPlaying
  }
}