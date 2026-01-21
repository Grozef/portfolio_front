/**
 * Service API centralise - Configuration axios partagee.
 * 
 * FIX UPLOAD: Ne pas définir Content-Type pour FormData
 * 
 * @module services/api
 */
import axios from 'axios'
import router from '@/router'

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: { 
    'Accept': 'application/json'
    // IMPORTANT: Ne PAS définir Content-Type ici
    // Pour FormData, le navigateur doit gérer le Content-Type avec boundary
  },
  timeout: 30000
})

// Intercepteur request: ajoute le token a toutes les requetes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // CRITICAL FIX: Définir Content-Type seulement pour non-FormData
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json'
    }
    // Si c'est du FormData, ne rien toucher - le navigateur gère tout
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Intercepteur response: gere les erreurs globalement
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Gestion des erreurs 401 (non authentifie ou token expire)
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      
      // Evite la boucle de redirection si deja sur la page login
      if (router.currentRoute.value.path !== '/login') {
        router.push('/login')
      }
    }

    // Gestion des erreurs 429 (rate limiting)
    if (error.response?.status === 429) {
      console.warn('Rate limit exceeded', error.response.data)
    }

    // Gestion des erreurs 500 (serveur)
    if (error.response?.status >= 500) {
      console.error('Server error', error.response.data)
    }

    return Promise.reject(error)
  }
)

export default api