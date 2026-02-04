import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCookieConsentStore = defineStore('cookieConsent', () => {
  const hasConsented = ref(false)
  const showBanner = ref(false)
  const preferences = ref({
    essential: true,
    functional: false,
    analytics: false
  })

  const loadConsent = () => {
    const stored = localStorage.getItem('cookie_consent')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        hasConsented.value = true
        preferences.value = { ...preferences.value, ...data.preferences }
        showBanner.value = false
      } catch (e) {
        showBanner.value = true
      }
    } else {
      showBanner.value = true
    }
  }

  const saveConsent = (prefs) => {
    const consentData = {
      timestamp: new Date().toISOString(),
      preferences: prefs
    }
    localStorage.setItem('cookie_consent', JSON.stringify(consentData))
    preferences.value = prefs
    hasConsented.value = true
    showBanner.value = false
    
    applyPreferences(prefs)
  }

  const acceptAll = () => {
    saveConsent({
      essential: true,
      functional: true,
      analytics: true
    })
  }

  const acceptEssential = () => {
    saveConsent({
      essential: true,
      functional: false,
      analytics: false
    })
  }

  const applyPreferences = (prefs) => {
    if (!prefs.functional) {
      localStorage.removeItem('user_preferences')
      localStorage.removeItem('theme')
      localStorage.removeItem('language')
    }

    if (!prefs.analytics) {
      // Remove analytics cookies if implemented
    }
  }

  const resetConsent = () => {
    localStorage.removeItem('cookie_consent')
    hasConsented.value = false
    showBanner.value = true
    preferences.value = {
      essential: true,
      functional: false,
      analytics: false
    }
  }

  const canUseCookie = (type) => {
    return preferences.value[type] === true
  }

  return {
    hasConsented,
    showBanner,
    preferences,
    loadConsent,
    saveConsent,
    acceptAll,
    acceptEssential,
    resetConsent,
    canUseCookie
  }
})