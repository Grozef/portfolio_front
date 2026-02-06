<template>
  <Teleport to="body">
    <div 
      v-if="swordCursorActive" 
      class="sword-cursor-container" 
      ref="swordRef"
    >
      <div class="sword-assembly">
        <div class="sword-blade"></div>
        <div class="sword-crossguard"></div>
        <div class="sword-handle"></div>
        <div class="sword-pommel"></div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useSwordCursor } from '@/composables/useSwordCursor'

const { swordCursorActive } = useSwordCursor()
const swordRef = ref(null)

let cursorX = 0
let cursorY = 0
let rafId = null

const updateCursorPosition = (e) => {
  cursorX = e.clientX
  cursorY = e.clientY
  
  if (rafId) cancelAnimationFrame(rafId)
  
  rafId = requestAnimationFrame(() => {
    if (swordRef.value) {
      // On centre l'épée et on lui donne son inclinaison de base
      swordRef.value.style.transform = `translate(${cursorX}px, ${cursorY}px) rotate(45deg)`
    }
  })
}

const handleAction = (className, duration) => {
  if (swordRef.value) {
    swordRef.value.classList.add(className)
    setTimeout(() => {
      swordRef.value?.classList.remove(className)
    }, duration)
  }
}

const handleMouseDown = () => handleAction('clicking', 100)
const handleClick = () => handleAction('attacking', 400)

const setupListeners = () => {
  document.body.classList.add('sword-cursor-active')
  document.addEventListener('mousemove', updateCursorPosition)
  document.addEventListener('mousedown', handleMouseDown)
  document.addEventListener('click', handleClick)
}

const removeListeners = () => {
  document.body.classList.remove('sword-cursor-active')
  document.removeEventListener('mousemove', updateCursorPosition)
  document.removeEventListener('mousedown', handleMouseDown)
  document.removeEventListener('click', handleClick)
}

watch(swordCursorActive, (isActive) => {
  isActive ? setupListeners() : removeListeners()
})

onMounted(() => {
  if (swordCursorActive.value) setupListeners()
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
  removeListeners()
})
</script>

<style>
/* Cacher le vrai curseur */
body.sword-cursor-active,
body.sword-cursor-active * {
  cursor: none !important;
}

.sword-cursor-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 0; /* On part d'un point 0,0 */
  height: 0;
  pointer-events: none;
  z-index: 999999;
  will-change: transform;
  transition: filter 0.2s ease;
}

/* Conteneur interne pour l'alignement et l'animation */
.sword-assembly {
  position: absolute;
  top: -0px; /* Ajuste la pointe sur le curseur */
  left: -2px; 
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: swordFadeIn 0.3s ease-out forwards;
}

/* La Lame */
.sword-blade {
  width: 6px;
  height: 35px;
  background: linear-gradient(90deg, #e0e0e0, #ffffff, #b0b0b0);
  clip-path: polygon(50% 0%, 100% 15%, 100% 100%, 0% 100%, 0% 15%);
  filter: drop-shadow(0 0 2px rgba(255,255,255,0.5));
}

/* La Garde (le truc qui manquait pour la solidité) */
.sword-crossguard {
  width: 18px;
  height: 4px;
  background: #8b7520;
  border-radius: 2px;
  margin-top: -1px;
}

/* La Poignée */
.sword-handle {
  width: 4px;
  height: 10px;
  background: #b91313;
}

/* Le Pommeau */
.sword-pommel {
  width: 8px;
  height: 8px;
  background: radial-gradient(circle at 30% 30%, #ffd700, #8b7520);
  border-radius: 50%;
  margin-top: -2px;
}

/* États et Animations */
.sword-cursor-container.clicking {
  filter: brightness(1.5) drop-shadow(0 0 5px gold);
}

.sword-cursor-container.attacking .sword-assembly {
  animation: sword-slash 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes sword-slash {
  0% { transform: rotate(0deg); }
  30% { transform: rotate(-20deg) scale(1.2); }
  60% { transform: rotate(70deg) scale(1.1); }
  100% { transform: rotate(0deg); }
}

@keyframes swordFadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>