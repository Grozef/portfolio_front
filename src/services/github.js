import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { githubService } from '@/services/github'

export const useGitHubStore = defineStore('github', () => {
  const repositories = ref([])
  const pinnedRepos = ref([])
  const profile = ref(null)
  const selectedRepo = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const currentPage = ref(1)
  const hasMoreRepos = ref(true)
  const isLoadingMore = ref(false)

  const fetchRepositories = async (reset = true) => {
    if (reset) {
      currentPage.value = 1
      repositories.value = []
      hasMoreRepos.value = true
    }
    
    isLoading.value = true
    error.value = null

    try {
      const data = await githubService.getRepositories(30, currentPage.value)
      if (reset) {
        repositories.value = data
      } else {
        repositories.value = [...repositories.value, ...data]
      }
      hasMoreRepos.value = data.length === 30
    } catch (e) {
      error.value = e.message
      console.error('Failed to fetch repositories:', e)
    } finally {
      isLoading.value = false
    }
  }

  const fetchMoreRepositories = async () => {
    if (isLoadingMore.value || !hasMoreRepos.value) return
    
    isLoadingMore.value = true
    currentPage.value++
    
    try {
      const data = await githubService.getRepositories(30, currentPage.value)
      repositories.value = [...repositories.value, ...data]
      hasMoreRepos.value = data.length === 30
    } catch (e) {
      error.value = e.message
      currentPage.value--
      console.error('Failed to fetch more repositories:', e)
    } finally {
      isLoadingMore.value = false
    }
  }

  const fetchPinnedRepos = async () => {
    isLoading.value = true
    error.value = null

    try {
      const data = await githubService.getPinnedRepositories()
      pinnedRepos.value = data
    } catch (e) {
      error.value = e.message
      console.error('Failed to fetch pinned repos:', e)
    } finally {
      isLoading.value = false
    }
  }

  const fetchRepository = async (name) => {
    isLoading.value = true
    error.value = null

    try {
      const data = await githubService.getRepository(name)
      selectedRepo.value = data
      return data
    } catch (e) {
      error.value = e.message
      console.error('Failed to fetch repository:', e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const fetchProfile = async () => {
    isLoading.value = true
    error.value = null

    try {
      const data = await githubService.getProfile()
      profile.value = data
    } catch (e) {
      error.value = e.message
      console.error('Failed to fetch profile:', e)
    } finally {
      isLoading.value = false
    }
  }

  const selectRepository = async (repo) => {
    if (typeof repo === 'string') {
      await fetchRepository(repo)
    } else {
      selectedRepo.value = repo
      if (!repo.readme || !repo.languages) {
        await fetchRepository(repo.name)
      }
    }
  }

  const clearSelectedRepo = () => {
    selectedRepo.value = null
  }

  const sortedRepositories = computed(() => {
    return [...repositories.value].sort((a, b) => {
      return new Date(b.updated_at) - new Date(a.updated_at)
    })
  })

  const topRepositories = computed(() => {
    return [...repositories.value]
      .sort((a, b) => b.stars - a.stars)
      .slice(0, 6)
  })

  const languageStats = computed(() => {
    const stats = {}
    repositories.value.forEach(repo => {
      if (repo.language) {
        stats[repo.language] = (stats[repo.language] || 0) + 1
      }
    })
    return Object.entries(stats)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  })

  return {
    repositories,
    pinnedRepos,
    profile,
    selectedRepo,
    isLoading,
    error,
    currentPage,
    hasMoreRepos,
    isLoadingMore,
    fetchRepositories,
    fetchMoreRepositories,
    fetchPinnedRepos,
    fetchRepository,
    fetchProfile,
    selectRepository,
    clearSelectedRepo,
    sortedRepositories,
    topRepositories,
    languageStats
  }
})