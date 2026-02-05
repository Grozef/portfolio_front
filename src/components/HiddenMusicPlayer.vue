<template>
  <div class="hidden-music-player">
    <button 
      @click="togglePlay"
      class="play-button"
      :class="{ playing: isPlaying }"
      data-cursor-hover
      title="Play hold music"
    >
      {{ isPlaying ? '⏸' : '▶' }}
    </button>
    
    <audio ref="audioRef" loop>
      <source :src="musicSrc" type="audio/mpeg">
    </audio>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useEasterEggs } from '@/composables/useEasterEggs'

const props = defineProps({
  musicSrc: {
    type: String,
    default: '/audio/hold-music.mp3' // Path to hold music file
  }
})

const { discoverEgg, EASTER_EGGS } = useEasterEggs()

const audioRef = ref(null)
const isPlaying = ref(false)
const discovered = ref(false)

const togglePlay = () => {
  if (!audioRef.value) return

  if (isPlaying.value) {
    audioRef.value.pause()
    isPlaying.value = false
  } else {
    audioRef.value.play()
    isPlaying.value = true
    
    // Discover easter egg on first play
    if (!discovered.value) {
      discovered.value = true
      discoverEgg(EASTER_EGGS.MUSIC_PLAYER)
    }
  }
}
</script>

<style lang="scss" scoped>
.hidden-music-player {
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  z-index: 100;
}

.play-button {
  width: 16px;
  height: 16px;
  padding: 0;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 3px;
  color: var(--terminal-text-dim);
  font-size: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0.3;
  transition: all 0.3s ease;

  &:hover {
    opacity: 1;
    border-color: var(--terminal-accent);
    color: var(--terminal-accent);
    transform: scale(1.5);
  }

  &.playing {
    opacity: 0.6;
    color: var(--terminal-accent);
    animation: pulse 2s ease infinite;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}
</style>
