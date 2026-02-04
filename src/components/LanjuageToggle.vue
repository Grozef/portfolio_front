<template>
  <button @click="toggleLanguage" class="lang-toggle">
    {{ currentLang === 'fr' ? '🇬🇧 English' : '🇫🇷 Français' }}
  </button>
</template>

<script setup>
import { ref, watch, defineEmits } from 'vue'

const emit = defineEmits(['language-changed'])
const currentLang = ref('fr')

const toggleLanguage = () => {
  currentLang.value = currentLang.value === 'fr' ? 'en' : 'fr'
  emit('language-changed', currentLang.value)
}

watch(currentLang, (newLang) => {
  emit('language-changed', newLang)
})
</script>

<style scoped lang="scss">
.lang-toggle {
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  background: rgba(0, 255, 255, 0.1);
  border: 2px solid #00ffff;
  border-radius: 25px;
  color: #00ffff;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 255, 255, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
}
</style>