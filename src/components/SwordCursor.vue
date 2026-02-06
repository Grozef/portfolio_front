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
/* Sword Cursor Easter Egg Styles - REDESIGNED */

body.sword-cursor-active,
body.sword-cursor-active * {
  cursor: none !important;
}

.sword-cursor {
  position: fixed;
  top: 0;
  left: 0;
  width: 50px;
  height: 50px;
  pointer-events: none;
  z-index: 10001;
  transform: translate(-50%, -50%) rotate(45deg);
  transition: transform 0.1s ease;
}

/* Blade - elongated and tapered */
.sword-cursor::before {
  content: '';
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 35px solid #e8e8f0;
  filter: drop-shadow(0 0 4px rgba(232, 232, 240, 0.6)) 
          drop-shadow(0 2px 2px rgba(0, 0, 0, 0.3));
}

/* Blade shine effect */
.sword-cursor::after {
  content: '';
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 30px;
  background: linear-gradient(to bottom, 
    rgba(255, 255, 255, 0.9) 0%,
    rgba(255, 255, 255, 0.5) 50%,
    transparent 100%
  );
  border-radius: 1px;
}

/* Cross-guard (hilt) */
.sword-handle::before {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 4px;
  background: linear-gradient(90deg, #4a3f15 0%, #8b7520 50%, #4a3f15 100%);
  border-radius: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* Handle/Grip */
.sword-handle {
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 12px;
  background: linear-gradient(to bottom, #8b7520 0%, #6b5a18 50%, #4a3f15 100%);
  border-radius: 2px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.4);
}

/* Pommel (end knob) */
.sword-pommel {
  position: absolute;
  bottom: -18px;
  left: 50%;
  transform: translateX(-50%);
  width: 10px;
  height: 10px;
  background: radial-gradient(circle at 30% 30%, #ffd700, #c9a227, #8b7520);
  border-radius: 50%;
  border: 1px solid #6b5a18;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4),
              inset 0 1px 2px rgba(255, 255, 255, 0.3);
}

/* Glow effect on click */
body.sword-cursor-active.clicking .sword-cursor {
  transform: translate(-50%, -50%) rotate(45deg) scale(1.2);
  filter: drop-shadow(0 0 15px rgba(201, 162, 39, 0.9)) 
          drop-shadow(0 0 30px rgba(255, 215, 0, 0.5));
}

body.sword-cursor-active.clicking .sword-cursor::before {
  border-bottom-color: #fff;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 1));
}

/* Sword attack animation - slash motion */
@keyframes sword-slash {
  0% {
    transform: translate(-50%, -50%) rotate(45deg);
  }
  25% {
    transform: translate(-50%, -50%) rotate(90deg) scale(1.1);
  }
  50% {
    transform: translate(-50%, -50%) rotate(135deg) scale(1.15);
  }
  75% {
    transform: translate(-50%, -50%) rotate(90deg) scale(1.1);
  }
  100% {
    transform: translate(-50%, -50%) rotate(45deg);
  }
}

body.sword-cursor-active.attacking .sword-cursor {
  animation: sword-slash 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

body.sword-cursor-active.attacking .sword-cursor::before {
  border-bottom-color: #fffacd;
}

/* Entrance animation */
.sword-cursor {
  opacity: 0;
  animation: swordFadeIn 0.4s ease forwards;
}

@keyframes swordFadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) rotate(45deg) scale(0.3);
    filter: blur(4px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) rotate(45deg) scale(1);
    filter: blur(0);
  }
}

/* Subtle idle animation */
@keyframes swordIdle {
  0%, 100% {
    transform: translate(-50%, -50%) rotate(45deg) translateY(0);
  }
  50% {
    transform: translate(-50%, -50%) rotate(45deg) translateY(-2px);
  }
}

body.sword-cursor-active .sword-cursor:not(.attacking):not(.clicking) {
  animation: swordIdle 2s ease-in-out infinite;
}
</style>
