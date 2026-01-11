import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1/github',
  headers: {
    'Content-Type': 'application/json'
  }
})

export const githubService = {
  async getRepositories(perPage = 30, page = 1) {
    const response = await api.get('/repositories', {
      params: { per_page: perPage, page }
    })
    return response.data.data
  },

  async getPinnedRepositories() {
    const response = await api.get('/repositories/pinned')
    return response.data.data
  },

  async getRepository(name) {
    const response = await api.get(`/repositories/${name}`)
    return response.data.data
  },

  async getLanguages(name) {
    const response = await api.get(`/repositories/${name}/languages`)
    return response.data.data
  },

  async getProfile() {
    const response = await api.get('/profile')
    return response.data.data
  }
}

export default githubService