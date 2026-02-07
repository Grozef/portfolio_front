// src/composables/useMusic.js
import { ref } from 'vue'

// Logic defined outside the function persists across the entire app
// This is the "Engine" that never dies when routes change
const isPlaying = ref(false)
const audioInstance = new Audio('/sound/mindmist-sounds-of-waves-313367.mp3')
audioInstance.loop = true

export function useMusic() {
  const togglePlay = () => {
    if (isPlaying.value) {
      audioInstance.pause()
      isPlaying.value = false
    } else {
      // Browsers require user interaction before playing audio
      audioInstance.play()
        .catch(err => console.warn("Audio play blocked: interaction needed", err))
      isPlaying.value = true
    }
  }

  return {
    isPlaying,
    togglePlay
  }
}