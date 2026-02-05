<template>
  <!-- Sword Cursor Overlay -->
  <div v-if="swordCursorActive" class="sword-cursor" ref="swordRef">
    <div class="sword-handle"></div>
    <div class="sword-pommel"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useSwordCursor } from '@/composables/useSwordCursor'

const { swordCursorActive } = useSwordCursor()
const swordRef = ref(null)

let cursorX = 0
let cursorY = 0

const updateCursorPosition = (e) => {
  cursorX = e.clientX
  cursorY = e.clientY
  
  if (swordRef.value) {
    swordRef.value.style.left = cursorX + 'px'
    swordRef.value.style.top = cursorY + 'px'
  }
}

const handleMouseDown = () => {
  document.body.classList.add('clicking')
  setTimeout(() => {
    document.body.classList.remove('clicking')
  }, 100)
}

const handleClick = () => {
  document.body.classList.add('attacking')
  setTimeout(() => {
    document.body.classList.remove('attacking')
  }, 300)
}

watch(swordCursorActive, (isActive) => {
  if (isActive) {
    document.addEventListener('mousemove', updateCursorPosition)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('click', handleClick)
  } else {
    document.removeEventListener('mousemove', updateCursorPosition)
    document.removeEventListener('mousedown', handleMouseDown)
    document.removeEventListener('click', handleClick)
  }
})

onMounted(() => {
  if (swordCursorActive.value) {
    document.addEventListener('mousemove', updateCursorPosition)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('click', handleClick)
  }
})

onUnmounted(() => {
  document.removeEventListener('mousemove', updateCursorPosition)
  document.removeEventListener('mousedown', handleMouseDown)
  document.removeEventListener('click', handleClick)
  document.body.classList.remove('sword-cursor-active', 'clicking', 'attacking')
})
</script>

<style lang="scss">
@import '@/assets/sword-cursor.css';
</style>
