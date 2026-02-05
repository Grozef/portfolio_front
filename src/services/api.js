/**
 * Centralized API service - Shared axios configuration
 * 
 * IMPROVEMENTS:
 * - Uses environment variables for API URL
 * - Fixed FormData Content-Type handling
 * 
 * @module services/api
 */
import axios from 'axios'
import router from '@/router'

// Get backend URL from environment variable
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1'
// const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: `${BACKEND_URL}/api/${API_VERSION}`,
  headers: { 
    'Accept': 'application/json'
    // IMPORTANT: Do NOT set Content-Type here
    // For FormData, browser must handle Content-Type with boundary
  },
  timeout: 30000
})

// Request interceptor: add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // CRITICAL FIX: Set Content-Type only for non-FormData
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json'
    }
    // If FormData, browser handles everything
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor: handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 errors (unauthenticated or expired token)
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      
      // Avoid redirect loop if already on login page
      if (router.currentRoute.value.path !== '/login') {
        router.push('/login')
      }
    }

    // Handle 429 errors (rate limiting)
    if (error.response?.status === 429) {
      console.warn('Rate limit exceeded', error.response.data)
    }

    // Handle 500+ errors (server errors)
    if (error.response?.status >= 500) {
      console.error('Server error', error.response.data)
    }

    return Promise.reject(error)
  }
)

export default api

// Export backend URL for direct file access (images, etc.)
export { BACKEND_URL }