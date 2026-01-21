/**
 * Service d'authentification.
 * Utilise le service API centralise.
 * 
 * @module services/auth
 */
import api from './api'

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password })
    const { token, user } = response.data.data
    localStorage.setItem('auth_token', token)
    return user
  },

  async logout() {
    try {
      await api.post('/auth/logout')
    } finally {
      localStorage.removeItem('auth_token')
    }
  },

  async me() {
    const response = await api.get('/auth/me')
    return response.data.data
  },

  getToken() {
    return localStorage.getItem('auth_token')
  },

  isAuthenticated() {
    return !!this.getToken()
  }
}

export default authService