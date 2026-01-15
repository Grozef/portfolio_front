/**
 * Store Pinia pour GitHub.
 * Gere l'etat des repositories et du profil GitHub.
 * @module stores/github
 */
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

  const sortedRepositories = computed(() => {
    return [...repositories.value].sort((a, b) => 
      new Date(b.updated_at) - new Date(a.updated_at)
    )
  })

  const fetchRepositories = async () => {
    isLoading.value = true
    error.value = null
    try {
      repositories.value = await githubService.getRepositories()
    } catch (e) {
      error.value = e.message
    } finally {
      isLoading.value = false
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

  const clearSelectedRepo = () => { selectedRepo.value = null }

  return {
    repositories, pinnedRepos, profile, selectedRepo, isLoading, error,
    sortedRepositories,
    fetchRepositories, fetchPinnedRepos, fetchRepository, fetchProfile,
    selectRepository, clearSelectedRepo
  }
})
