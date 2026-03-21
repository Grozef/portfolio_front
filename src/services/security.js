import api from './api'

export const securityService = {
  async getStats() {
    const response = await api.get('/admin/security-stats')
    return response.data
  }
}

export default securityService
