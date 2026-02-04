import { useCookieConsentStore } from '@/stores/cookieConsent'
import { cookieUtils } from '@/utils/cookies'

export const useCookies = () => {
  const cookieStore = useCookieConsentStore()

  const setCookie = (name, value, days = 365, type = 'functional') => {
    if (cookieStore.canUseCookie(type)) {
      cookieUtils.set(name, value, days)
      return true
    }
    return false
  }

  const getCookie = (name) => {
    return cookieUtils.get(name)
  }

  const deleteCookie = (name) => {
    cookieUtils.delete(name)
  }

  const setPreference = (key, value) => {
    if (cookieStore.canUseCookie('functional')) {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    }
    return false
  }

  const getPreference = (key, defaultValue = null) => {
    if (cookieStore.canUseCookie('functional')) {
      const stored = localStorage.getItem(key)
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch {
          return defaultValue
        }
      }
    }
    return defaultValue
  }

  const removePreference = (key) => {
    localStorage.removeItem(key)
  }

  const canUse = (type) => {
    return cookieStore.canUseCookie(type)
  }

  return {
    setCookie,
    getCookie,
    deleteCookie,
    setPreference,
    getPreference,
    removePreference,
    canUse,
    hasConsented: cookieStore.hasConsented,
    preferences: cookieStore.preferences
  }
}