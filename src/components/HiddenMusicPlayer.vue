<template>
  <div class="hidden-music-player">
    <button 
      @click="handleToggle" 
      class="play-button"
      :class="{ playing: isPlaying }"
      data-cursor-hover
      title="Hidden music player - only visible in dark mode"
    >
      {{ isPlaying ? '⏸' : '▶' }}
    </button>
    
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMusic } from '@/composables/useMusic' // NEW: Import the global state
import { useEasterEggs } from '@/composables/useEasterEggs'

const props = defineProps({
  musicSrc: {
    type: String,
    default: '/audio/hold-music.mp3'
  }
})

// --- NEW LOGIC ---
const { isPlaying, togglePlay } = useMusic()
const { discoverEgg, EASTER_EGGS } = useEasterEggs()
const discovered = ref(false)

const handleToggle = () => {
  togglePlay() // Uses the global engine
  
  // Keep your Easter Egg logic here (local to this button)
  if (isPlaying.value && !discovered.value) {
    discovered.value = true
    discoverEgg(EASTER_EGGS.MUSIC_PLAYER)
  }
}

// --- OLD LOCAL LOGIC (For Analysis) ---
/*
const audioRef = ref(null)
const isPlayingLocal = ref(false) // This was destroyed on page change

const oldTogglePlay = () => {
  if (!audioRef.value) return

  if (isPlayingLocal.value) {
    audioRef.value.pause()
    isPlayingLocal.value = false
  } else {
    audioRef.value.play()
    isPlayingLocal.value = true
    // ... egg logic
  }
}
*/
</script>

<style lang="scss" scoped>
/* Styles remain exactly the same as your original code */
.hidden-music-player {
  position: fixed;
  bottom: 1.5rem;
  left: 1.5rem;
  z-index: 100;
}

.play-button {
  width: 20px;
  height: 20px;
  padding: 0;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.05);
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0.1;
  transition: all 0.3s ease;

  @media (prefers-color-scheme: dark) {
    background: rgba(201, 162, 39, 0.2);
    border: 2px solid rgba(201, 162, 39, 0.8);
    color: #c9a227;
    opacity: 0.7;
    box-shadow: 0 0 10px rgba(201, 162, 39, 0.3);
  }

  &:hover {
    opacity: 1;
    border-color: #c9a227;
    background: rgba(201, 162, 39, 0.3);
    transform: scale(1.8);
    box-shadow: 0 0 20px rgba(201, 162, 39, 0.6);
    color: #c9a227;
  }

  &.playing {
    opacity: 0.9;
    background: rgba(201, 162, 39, 0.3);
    border-color: #c9a227;
    color: #c9a227;
    animation: pulse 2s ease infinite;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.8;
    box-shadow: 0 0 10px rgba(201, 162, 39, 0.3);
  }
  50% {
    opacity: 1;
    box-shadow: 0 0 25px rgba(201, 162, 39, 0.7);
    transform: scale(1.05);
  }
}
</style>