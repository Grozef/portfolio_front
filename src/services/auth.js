/**
 * Service d'authentification.
 * Le token est envoye via le header Authorization: Bearer <token>
 * @module services/auth
 */
import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1/auth',
  headers: { 'Content-Type': 'application/json' }
})

// Intercepteur: ajoute le token a chaque requete
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authService = {
  async login(email, password) {
    const response = await api.post('/login', { email, password })
    const { token, user } = response.data.data
    localStorage.setItem('auth_token', token)
    return user
  },

  async logout() {
    try {
      await api.post('/logout')
    } finally {
      localStorage.removeItem('auth_token')
    }
  },

  async me() {
    const response = await api.get('/me')
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
