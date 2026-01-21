/**
 * Service GitHub.
 * Utilise le service API centralise.
 * 
 * @module services/github
 */
import api from './api'

export const githubService = {
  async getRepositories(perPage = 30, page = 1) {
    const response = await api.get('/github/repositories', {
      params: { per_page: perPage, page }
    })
    return response.data.data
  },

  async getPinnedRepositories() {
    const response = await api.get('/github/repositories/pinned')
    return response.data.data
  },

  async getRepository(name) {
    const response = await api.get(`/github/repositories/${name}`)
    return response.data.data
  },

  async getLanguages(name) {
    const response = await api.get(`/github/repositories/${name}/languages`)
    return response.data.data
  },

  async getProfile() {
    const response = await api.get('/github/profile')
    return response.data.data
  }
}

export default githubService