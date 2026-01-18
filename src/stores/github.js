/**
 * Store Pinia pour GitHub.
 * Gere l'etat des repositories et du profil GitHub.
 * @module stores/github
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import githubService from '@/services/github'

export const useGitHubStore = defineStore('github', () => {
  const repositories = ref([])
  const pinnedRepos = ref([])
  const profile = ref(null)
  const selectedRepo = ref(null)
  const isLoading = ref(false)
  const isLoadingMore = ref(false)
  const error = ref(null)
  const currentPage = ref(1)
  const hasMoreRepos = ref(true)
  const perPage = 30

  const sortedRepositories = computed(() => {
    return [...repositories.value].sort((a, b) => 
      new Date(b.updated_at) - new Date(a.updated_at)
    )
  })

  const fetchRepositories = async () => {
    isLoading.value = true
    error.value = null
    currentPage.value = 1
    hasMoreRepos.value = true
    
    try {
      const data = await githubService.getRepositories(perPage, 1)
      repositories.value = data
      hasMoreRepos.value = data.length === perPage
    } catch (e) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  const fetchMoreRepositories = async () => {
    if (!hasMoreRepos.value || isLoadingMore.value) return
    
    isLoadingMore.value = true
    error.value = null
    
    try {
      currentPage.value++
      const newRepos = await githubService.getRepositories(perPage, currentPage.value)
      
      if (newRepos.length === 0) {
        hasMoreRepos.value = false
      } else {
        repositories.value = [...repositories.value, ...newRepos]
        hasMoreRepos.value = newRepos.length === perPage
      }
    } catch (e) {
      error.value = e.message
      currentPage.value--
    } finally {
      isLoadingMore.value = false
    }
  }

  const fetchPinnedRepos = async () => {
    isLoading.value = true
    error.value = null
    try {
      pinnedRepos.value = await githubService.getPinnedRepositories()
    } catch (e) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  const fetchRepository = async (name) => {
    isLoading.value = true
    error.value = null
    try {
      selectedRepo.value = await githubService.getRepository(name)
      return selectedRepo.value
    } catch (e) {
      error.value = e.message
      return null
    } finally {
      isLoading.value = false
    }
  }

  const fetchProfile = async () => {
    isLoading.value = true
    error.value = null
    try {
      profile.value = await githubService.getProfile()
    } catch (e) {
      error.value = e.message
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

  const resetPagination = () => {
    currentPage.value = 1
    hasMoreRepos.value = true
  }

  return {
    // State
    repositories, 
    pinnedRepos, 
    profile, 
    selectedRepo, 
    isLoading, 
    isLoadingMore,
    error,
    currentPage,
    hasMoreRepos,
    
    // Getters
    sortedRepositories,
    
    // Actions
    fetchRepositories, 
    fetchMoreRepositories,
    fetchPinnedRepos, 
    fetchRepository, 
    fetchProfile,
    selectRepository, 
    clearSelectedRepo,
    resetPagination
  }
})