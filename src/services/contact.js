import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
})

export const contactService = {
  async sendMessage(data) {
    const response = await api.post('/contact', data)
    return response.data
  }
}

export default contactService
