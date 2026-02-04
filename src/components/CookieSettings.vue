<template>
  <div class="cookie-settings">
    <h3>{{ t.title }}</h3>
    <p>{{ t.description }}</p>

    <div class="settings-grid">
      <div class="setting-card">
        <div class="setting-header">
          <div class="setting-icon">🔒</div>
          <h4>{{ t.essential }}</h4>
        </div>
        <p>{{ t.essentialDesc }}</p>
        <label class="toggle-switch disabled">
          <input type="checkbox" checked disabled>
          <span class="slider"></span>
          <span class="toggle-label">{{ t.alwaysActive }}</span>
        </label>
      </div>

      <div class="setting-card">
        <div class="setting-header">
          <div class="setting-icon">⚙️</div>
          <h4>{{ t.functional }}</h4>
        </div>
        <p>{{ t.functionalDesc }}</p>
        <label class="toggle-switch">
          <input type="checkbox" v-model="localPrefs.functional">
          <span class="slider"></span>
          <span class="toggle-label">
            {{ localPrefs.functional ? t.enabled : t.disabled }}
          </span>
        </label>
      </div>

      <div class="setting-card">
        <div class="setting-header">
          <div class="setting-icon">📊</div>
          <h4>{{ t.analytics }}</h4>
        </div>
        <p>{{ t.analyticsDesc }}</p>
        <label class="toggle-switch">
          <input type="checkbox" v-model="localPrefs.analytics">
          <span class="slider"></span>
          <span class="toggle-label">
            {{ localPrefs.analytics ? t.enabled : t.disabled }}
          </span>
        </label>
      </div>
    </div>

    <div class="settings-actions">
      <button @click="saveSettings" class="btn btn-primary">
        {{ t.save }}
      </button>
      <button @click="resetSettings" class="btn btn-danger">
        {{ t.reset }}
      </button>
    </div>

    <div v-if="showSuccess" class="success-message">
      {{ t.successMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCookieConsentStore } from '@/stores/cookieConsent'

const cookieStore = useCookieConsentStore()
const currentLang = ref('fr')
const showSuccess = ref(false)

const localPrefs = ref({
  essential: true,
  functional: false,
  analytics: false
})

const translations = {
  fr: {
    title: 'Gérer les cookies',
    description: 'Personnalisez vos préférences de cookies. Les cookies essentiels sont toujours actifs.',
    essential: 'Cookies essentiels',
    essentialDesc: 'Nécessaires au bon fonctionnement du site. Ils ne peuvent pas être désactivés.',
    functional: 'Cookies fonctionnels',
    functionalDesc: 'Permettent de mémoriser vos préférences (langue, thème, etc.).',
    analytics: 'Cookies analytiques',
    analyticsDesc: 'Nous aident à comprendre comment vous utilisez le site pour l\'améliorer.',
    alwaysActive: 'Toujours actif',
    enabled: 'Activé',
    disabled: 'Désactivé',
    save: 'Enregistrer les préférences',
    reset: 'Réinitialiser',
    successMessage: 'Vos préférences ont été enregistrées !'
  },
  en: {
    title: 'Manage Cookies',
    description: 'Customize your cookie preferences. Essential cookies are always active.',
    essential: 'Essential Cookies',
    essentialDesc: 'Required for the site to function. They cannot be disabled.',
    functional: 'Functional Cookies',
    functionalDesc: 'Allow remembering your preferences (language, theme, etc.).',
    analytics: 'Analytics Cookies',
    analyticsDesc: 'Help us understand how you use the site to improve it.',
    alwaysActive: 'Always active',
    enabled: 'Enabled',
    disabled: 'Disabled',
    save: 'Save Preferences',
    reset: 'Reset',
    successMessage: 'Your preferences have been saved!'
  }
}

const t = computed(() => translations[currentLang.value])

const saveSettings = () => {
  cookieStore.saveConsent(localPrefs.value)
  showSuccess.value = true
  setTimeout(() => {
    showSuccess.value = false
  }, 3000)
}

const resetSettings = () => {
  if (confirm(currentLang.value === 'en' 
    ? 'Reset all cookie preferences?' 
    : 'Réinitialiser toutes les préférences ?')) {
    cookieStore.resetConsent()
    localPrefs.value = { ...cookieStore.preferences }
  }
}

onMounted(() => {
  cookieStore.loadConsent()
  localPrefs.value = { ...cookieStore.preferences }
  
  const savedLang = localStorage.getItem('language')
  if (savedLang) {
    currentLang.value = savedLang
  }
})
</script>

<style scoped lang="scss">
.cookie-settings {
  h3 {
    font-size: 1.8rem;
    color: #00ffff;
    margin-bottom: 1rem;
  }

  > p {
    color: rgba(255, 255, 255, 0.85);
    margin-bottom: 2rem;
    line-height: 1.6;
  }
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.setting-card {
  background: rgba(0, 255, 255, 0.05);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s;

  &:hover {
    background: rgba(0, 255, 255, 0.08);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 255, 255, 0.15);
  }
}

.setting-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;

  h4 {
    color: #00ffff;
    font-size: 1.2rem;
    margin: 0;
  }
}

.setting-icon {
  font-size: 2rem;
}

.setting-card > p {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.toggle-switch {
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;

  &.disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  input[type="checkbox"] {
    display: none;

    &:checked + .slider {
      background: #00ffff;

      &::before {
        transform: translateX(26px);
      }
    }
  }

  .slider {
    position: relative;
    width: 52px;
    height: 26px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 34px;
    transition: 0.3s;

    &::before {
      content: '';
      position: absolute;
      height: 20px;
      width: 20px;
      left: 3px;
      bottom: 3px;
      background: white;
      border-radius: 50%;
      transition: 0.3s;
    }
  }

  .toggle-label {
    color: rgba(255, 255, 255, 0.85);
    font-size: 0.9rem;
    font-weight: 500;
  }
}

.settings-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    .btn {
      flex: 1;
    }
  }
}

.btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1rem;

  &.btn-primary {
    background: #00ffff;
    color: #0a0a0f;

    &:hover {
      background: #00ccff;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 255, 255, 0.4);
    }
  }

  &.btn-danger {
    background: rgba(255, 50, 100, 0.2);
    color: #ff3264;
    border: 2px solid #ff3264;

    &:hover {
      background: rgba(255, 50, 100, 0.3);
      transform: translateY(-2px);
    }
  }

  &:active {
    transform: translateY(0);
  }
}

.success-message {
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(0, 255, 100, 0.1);
  border: 1px solid rgba(0, 255, 100, 0.3);
  border-radius: 8px;
  color: #00ff64;
  text-align: center;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>