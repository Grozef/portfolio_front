<template>
  <Transition name="slide-up">
    <div v-if="cookieStore.showBanner" class="cookie-banner">
      <div class="cookie-container">
        <div class="cookie-content">
          <div class="cookie-icon">🍪</div>
          <div class="cookie-text">
            <h3>{{ currentLang === 'en' ? 'Cookie Settings' : 'Paramètres des cookies' }}</h3>
            <p v-if="!showDetails">
              {{ currentLang === 'en' 
                ? 'We use cookies to improve your experience. You can accept all cookies or customize your preferences.'
                : 'Nous utilisons des cookies pour améliorer votre expérience. Vous pouvez accepter tous les cookies ou personnaliser vos préférences.'
              }}
            </p>

            <!-- Detailed preferences -->
            <div v-if="showDetails" class="cookie-preferences">
              <div class="preference-item">
                <label class="preference-label">
                  <input type="checkbox" v-model="localPreferences.essential" disabled>
                  <span class="checkbox-custom"></span>
                  <div class="preference-info">
                    <strong>{{ currentLang === 'en' ? 'Essential' : 'Essentiels' }}</strong>
                    <small>{{ currentLang === 'en' 
                      ? 'Required for the site to function'
                      : 'Nécessaires au fonctionnement du site'
                    }}</small>
                  </div>
                </label>
              </div>

              <div class="preference-item">
                <label class="preference-label">
                  <input type="checkbox" v-model="localPreferences.functional">
                  <span class="checkbox-custom"></span>
                  <div class="preference-info">
                    <strong>{{ currentLang === 'en' ? 'Functional' : 'Fonctionnels' }}</strong>
                    <small>{{ currentLang === 'en' 
                      ? 'Remember your preferences'
                      : 'Mémoriser vos préférences'
                    }}</small>
                  </div>
                </label>
              </div>

              <div class="preference-item">
                <label class="preference-label">
                  <input type="checkbox" v-model="localPreferences.analytics">
                  <span class="checkbox-custom"></span>
                  <div class="preference-info">
                    <strong>{{ currentLang === 'en' ? 'Analytics' : 'Analytiques' }}</strong>
                    <small>{{ currentLang === 'en' 
                      ? 'Help us improve our site'
                      : 'Nous aider à améliorer notre site'
                    }}</small>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="cookie-actions">
          <button v-if="!showDetails" @click="toggleDetails" class="btn btn-secondary">
            {{ currentLang === 'en' ? 'Customize' : 'Personnaliser' }}
          </button>
          
          <button v-if="showDetails" @click="savePreferences" class="btn btn-primary">
            {{ currentLang === 'en' ? 'Save preferences' : 'Enregistrer' }}
          </button>
          
          <button v-if="showDetails" @click="toggleDetails" class="btn btn-secondary">
            {{ currentLang === 'en' ? 'Back' : 'Retour' }}
          </button>

          <button v-if="!showDetails" @click="acceptEssential" class="btn btn-secondary">
            {{ currentLang === 'en' ? 'Essential only' : 'Essentiels seulement' }}
          </button>

          <button @click="acceptAll" class="btn btn-primary">
            {{ currentLang === 'en' ? 'Accept all' : 'Tout accepter' }}
          </button>
        </div>

        <router-link to="/cookies" class="cookie-link">
          {{ currentLang === 'en' ? 'Learn more about cookies' : 'En savoir plus sur les cookies' }}
        </router-link>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCookieConsentStore } from '@/stores/cookieConsent'

const cookieStore = useCookieConsentStore()
const showDetails = ref(false)
const currentLang = ref('fr')

const localPreferences = ref({
  essential: true,
  functional: false,
  analytics: false
})

const toggleDetails = () => {
  showDetails.value = !showDetails.value
}

const acceptAll = () => {
  cookieStore.acceptAll()
  showDetails.value = false
}

const acceptEssential = () => {
  cookieStore.acceptEssential()
  showDetails.value = false
}

const savePreferences = () => {
  cookieStore.saveConsent(localPreferences.value)
  showDetails.value = false
}

onMounted(() => {
  cookieStore.loadConsent()
  localPreferences.value = { ...cookieStore.preferences }
  
  const savedLang = localStorage.getItem('language')
  if (savedLang) {
    currentLang.value = savedLang
  }
})
</script>

<style scoped lang="scss">

.slide-up-enter-active,
.slide-up-leave-active {
    cursor: pointer !important;
  transition: transform 0.4s ease, opacity 0.4s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.cookie-banner {
    cursor: pointer !important;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(180deg, rgba(10, 10, 15, 0.98) 0%, rgba(5, 5, 10, 0.98) 100%);
  backdrop-filter: blur(10px);
  border-top: 2px solid rgba(0, 255, 255, 0.3);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.5);
  z-index: 10000;
  padding: 1.5rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
}

.cookie-container {
    cursor: pointer !important;
  max-width: 1200px;
  margin: 0 auto;
}

.cookie-content {
    cursor: pointer !important;
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
  align-items: flex-start;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
}

.cookie-icon {
    cursor: pointer !important;
  font-size: 3rem;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
}

.cookie-text {
    cursor: pointer !important;
  flex: 1;
  
  h3 {
      cursor: pointer !important;
    color: #00ffff;
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
    
    @media (max-width: 768px) {
      font-size: 1.1rem;
    }
  }
  
  p {
      cursor: pointer !important;
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.6;
    margin: 0;
    font-size: 0.95rem;
  }
}

.cookie-preferences {
    cursor: pointer !important;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.preference-item {
    cursor: pointer !important;
  background: rgba(0, 255, 255, 0.05);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 8px;
  padding: 1rem;
  transition: background 0.2s;
  
  &:hover {
    background: rgba(0, 255, 255, 0.08);
  }
}

.preference-label {
    cursor: pointer !important;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  
  input[type="checkbox"] {
    display: none;
    
    &:checked + .checkbox-custom::after {
      opacity: 1;
      transform: scale(1);
    }
    
    &:disabled + .checkbox-custom {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  
  .checkbox-custom {
      cursor: pointer !important;
    width: 24px;
    height: 24px;
    border: 2px solid #00ffff;
    border-radius: 4px;
    position: relative;
    flex-shrink: 0;
    transition: all 0.2s;
    
    &::after {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0);
      color: #00ffff;
      font-size: 16px;
      font-weight: bold;
      opacity: 0;
      transition: all 0.2s;
    }
  }
}

.preference-info {
    cursor: pointer !important;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  
  strong {
    color: #00ffff;
    font-size: 1rem;
  }
  
  small {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.85rem;
  }
}

.cookie-actions {
    cursor: pointer !important;
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: flex-end;
  
  @media (max-width: 768px) {
    justify-content: stretch;
    
    .btn {
      flex: 1;
      min-width: 0;
    }
  }
}

.btn {
    cursor: pointer !important;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.95rem;
  white-space: nowrap;
  
  @media (max-width: 768px) {
    padding: 0.65rem 1rem;
    font-size: 0.9rem;
  }
  
  &.btn-primary {
      cursor: pointer !important;
    background: #00ffff;
    color: #0a0a0f;
    
    &:hover {
      background: #00ccff;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 255, 255, 0.4);
    }
  }
  
  &.btn-secondary {
      cursor: pointer !important;
    background: rgba(0, 255, 255, 0.1);
    color: #00ffff;
    border: 2px solid #00ffff;
    
    &:hover {
        cursor: pointer !important;
      background: rgba(0, 255, 255, 0.2);
      transform: translateY(-2px);
    }
  }
  
  &:active {
      cursor: pointer !important;
    transform: translateY(0);
  }
}

.cookie-link {
    cursor: pointer !important;
  display: block;
  text-align: center;
  margin-top: 1rem;
  color: rgba(0, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
  
  &:hover {
      cursor: pointer !important;
    color: #00ffff;
    text-decoration: underline;
  }
}
</style>