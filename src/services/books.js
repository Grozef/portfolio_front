/**
 * Service de gestion des livres avec token Authorization.
 * @module services/books
 */
import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1/books',
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const booksService = {
  async getBooks(params = {}) {
    const response = await api.get('/', { params })
    return response.data.data
  },
  async getFeaturedBooks() {
    const response = await api.get('/featured')
    return response.data.data
  },
  async getBook(id) {
    const response = await api.get(`/${id}`)
    return response.data.data
  },
  async getStats() {
    const response = await api.get('/stats')
    return response.data.data
  },
  async createBook(data) {
    const response = await api.post('/', data)
    return response.data.data
  },
  async updateBook(id, data) {
    const response = await api.put(`/${id}`, data)
    return response.data.data
  },
  async deleteBook(id) {
    const response = await api.delete(`/${id}`)
    return response.data
  },
  async refreshBookCache(id) {
    const response = await api.post(`/${id}/refresh`)
    return response.data.data
  }
}

export default booksService
