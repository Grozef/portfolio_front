/**
 * Store Pinia pour l'authentification.
 * @module stores/auth
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const retryAfter = ref(0)

  const isAuthenticated = computed(() => !!user.value)

  const login = async (email, password) => {
    isLoading.value = true
    error.value = null
    retryAfter.value = 0

    try {
      user.value = await authService.login(email, password)
      return true
    } catch (e) {
      if (e.response?.status === 429) {
        retryAfter.value = e.response.data.retry_after || 900
        error.value = e.response.data.message || 'Too many attempts.'
      } else {
        error.value = e.response?.data?.message || 'Login failed'
      }
      return false
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    isLoading.value = true
    try {
      await authService.logout()
    } finally {
      user.value = null
      isLoading.value = false
    }
  }

  const checkAuth = async () => {
    if (!authService.getToken()) {
      user.value = null
      return false
    }
    try {
      user.value = await authService.me()
      return true
    } catch {
      user.value = null
      localStorage.removeItem('auth_token')
      return false
    }
  }

  const clearError = () => {
    error.value = null
    retryAfter.value = 0
  }

  return {
    user, isLoading, error, retryAfter,
    isAuthenticated,
    login, logout, checkAuth, clearError
  }
})
