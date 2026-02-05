import { ref } from 'vue'
import { useEasterEggs } from './useEasterEggs'

const soundsInitialized = ref(false)
const audioContext = ref(null)

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

  const playHoverSound = () => playSound('hover')
  const playClickSound = () => playSound('click')
  const playSuccessSound = () => playSound('success')
  const playBlipSound = () => playSound('blip')

  return {
    playSound,
    playHoverSound,
    playClickSound,
    playSuccessSound,
    playBlipSound
  }
}
