export const cookieUtils = {
  set(name, value, days = 365) {
    let expires = ''
    if (days) {
      const date = new Date()
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
      expires = `; expires=${date.toUTCString()}`
    }
    document.cookie = `${name}=${value || ''}${expires}; path=/; SameSite=Lax`
  },

  get(name) {
    const nameEQ = `${name}=`
    const ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
    return null
  },

  delete(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  },

  deleteAll() {
    const cookies = document.cookie.split(';')
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i]
      const eqPos = cookie.indexOf('=')
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
      if (name !== 'cookie_consent') {
        this.delete(name)
      }
    }
  }
}

export const setCookie = (name, value, days, type = 'essential') => {
  const cookieStore = useCookieConsentStore()
  if (cookieStore.canUseCookie(type)) {
    cookieUtils.set(name, value, days)
  }
}

export const getCookie = (name) => {
  return cookieUtils.get(name)
}

export const deleteCookie = (name) => {
  cookieUtils.delete(name)
}

import { useCookieConsentStore } from '@/stores/cookieConsent'