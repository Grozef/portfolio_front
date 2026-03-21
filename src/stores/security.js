import { defineStore } from 'pinia'
import { ref } from 'vue'
import securityService from '@/services/security'

export const useSecurityStore = defineStore('security', () => {
  const metrics = ref(null)
  const alerts = ref([])
  const stats24h = ref(null)
  const topSuspects = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const lastFetch = ref(null)

  async function fetchStats() {
    isLoading.value = true
    error.value = null
    try {
      const data = await securityService.getStats()
      metrics.value = data.metrics
      alerts.value = data.alerts
      stats24h.value = data.stats_24h
      topSuspects.value = data.top_suspects
      lastFetch.value = new Date()
    } catch (e) {
      error.value = e.response?.data?.message || 'Failed to load security stats'
    } finally {
      isLoading.value = false
    }
  }

  return { metrics, alerts, stats24h, topSuspects, isLoading, error, lastFetch, fetchStats }
})
