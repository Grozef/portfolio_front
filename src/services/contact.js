/**
 * Service de contact.
 * @module services/contact
 */
import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' }
})

export const contactService = {
  async send(data) {
    const response = await api.post('/contact', data)
    return response.data
  }
}

export default contactService
