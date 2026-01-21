/**
 * Service de contact.
 * Utilise le service API centralise.
 * 
 * @module services/contact
 */
import api from './api'

export const contactService = {
  async send(data) {
    const response = await api.post('/contact', data)
    return response.data
  }
}

export default contactService