/**
 * Service de gestion des livres.
 * Utilise le service API centralise.
 * 
 * @module services/books
 */
import api from './api'

export const booksService = {
  // async getBooks(params = {}) {
  //   const response = await api.get('/books', { params })
  //   return response.data.data
  // },
  
  async getFeaturedBooks() {
    const response = await api.get('/books/featured')
    return response.data.data
  },
  
getBooks: async (params = {}) => {
  const response = await api.get('/books', { 
    params: { 
      ...params,
      per_page: 50
    } 
  })
  return {
    data: response.data.data,
    meta: response.data.meta
  }
},
  
  async getStats() {
    const response = await api.get('/books/stats')
    return response.data.data
  },
  
  async createBook(data) {
    const response = await api.post('/books', data)
    return response.data.data
  },
  
  async updateBook(id, data) {
    const response = await api.put(`/books/${id}`, data)
    return response.data.data
  },
  
  async deleteBook(id) {
    const response = await api.delete(`/books/${id}`)
    return response.data
  },
  
  async refreshBookCache(id) {
    const response = await api.post(`/books/${id}/refresh`)
    return response.data.data
  }
}

export default booksService