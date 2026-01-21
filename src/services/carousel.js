/**
 * Service de gestion du carrousel d'images.
 * Utilise le service API centralise.
 * 
 * @module services/carousel
 */
import api from './api'

export const carouselService = {
  async getImages() {
    const response = await api.get('/carousel')
    return response.data.data
  },
  
  async getImage(id) {
    const response = await api.get(`/carousel/${id}`)
    return response.data.data
  },
  
  async uploadImage(file) {
    const formData = new FormData()
    formData.append('image', file)
    
    // Debug: vérifier que le fichier est bien dans le FormData
    console.log('📤 Upload - File:', file)
    console.log('📤 Upload - File name:', file?.name)
    console.log('📤 Upload - File size:', file?.size)
    console.log('📤 Upload - File type:', file?.type)
    
    // Ne pas définir Content-Type manuellement pour FormData
    // Axios gère automatiquement le boundary
    const response = await api.post('/carousel/upload', formData)
    return response.data.data
  },
  
  async createImage(data) {
    const response = await api.post('/carousel', data)
    return response.data.data
  },
  
  async updateImage(id, data) {
    const response = await api.put(`/carousel/${id}`, data)
    return response.data.data
  },
  
  async deleteImage(id) {
    const response = await api.delete(`/carousel/${id}`)
    return response.data
  },
  
  async reorderImages(order) {
    const response = await api.post('/carousel/reorder', { order })
    return response.data.data
  }
}

export default carouselService