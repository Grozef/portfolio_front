<template>
  <AdminLayout>
    <div class="security-page" v-if="!securityStore.isLoading">

      <!-- Header -->
      <div class="page-header">
        <div>
          <h1>◈ Security</h1>
          <span class="last-updated" v-if="securityStore.lastFetch">
            Last updated: {{ formatTime(securityStore.lastFetch) }}
          </span>
        </div>
        <button class="refresh-btn" @click="securityStore.fetchStats()" :disabled="securityStore.isLoading" data-cursor-hover>
          ↺ Refresh
        </button>
      </div>

      <!-- Error -->
      <div class="error-state" v-if="securityStore.error">
        <p>{{ securityStore.error }}</p>
        <button class="refresh-btn" @click="securityStore.fetchStats()" data-cursor-hover>Retry</button>
      </div>

      <template v-else>
        <!-- Metrics 24h -->
        <section>
          <h2 class="section-title">Last 24 hours</h2>
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-icon">◆</div>
              <div class="metric-info">
                <span class="metric-value">{{ securityStore.stats24h?.total ?? '—' }}</span>
                <span class="metric-label">Total Attempts</span>
              </div>
            </div>

            <div class="metric-card" :class="failureClass">
              <div class="metric-icon">✗</div>
              <div class="metric-info">
                <span class="metric-value">{{ securityStore.stats24h?.failures ?? '—' }}</span>
                <span class="metric-label">Failed Attempts</span>
              </div>
            </div>

            <div class="metric-card success">
              <div class="metric-icon">◎</div>
              <div class="metric-info">
                <span class="metric-value">{{ securityStore.stats24h?.success_rate ?? '—' }}</span>
                <span class="metric-label">Success Rate</span>
              </div>
            </div>

            <div class="metric-card" :class="blockedClass">
              <div class="metric-icon">⊘</div>
              <div class="metric-info">
                <span class="metric-value">{{ securityStore.metrics?.unique_ips_blocked ?? '—' }}</span>
                <span class="metric-label">IPs Blocked</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Active Alerts -->
        <section>
          <h2 class="section-title">Active Alerts (last 6h)</h2>
          <div class="alerts-list" v-if="securityStore.alerts?.length">
            <div class="alert-item" v-for="alert in securityStore.alerts" :key="alert.ip + alert.email">
              <div class="alert-dot"></div>
              <span class="alert-ip">{{ alert.ip }}</span>
              <span class="alert-email">{{ alert.email || '—' }}</span>
              <span class="alert-count">{{ alert.failures }} failures</span>
            </div>
          </div>
          <div class="no-alerts" v-else>
            ✓ No active threats detected
          </div>
        </section>

        <!-- Top Suspects -->
        <section v-if="securityStore.topSuspects?.length">
          <h2 class="section-title">Top Suspects</h2>
          <div class="suspects-table">
            <div class="table-header">
              <span>IP</span>
              <span class="col-email">Email</span>
              <span>Failures</span>
              <span>Total</span>
            </div>
            <div class="table-row" v-for="suspect in securityStore.topSuspects" :key="suspect.ip">
              <span>{{ suspect.ip }}</span>
              <span class="col-email">{{ suspect.email || '—' }}</span>
              <span class="failures">{{ suspect.failed_attempts }}</span>
              <span class="total">{{ suspect.total_attempts }}</span>
            </div>
          </div>
        </section>
      </template>
    </div>

    <!-- Loading -->
    <div class="loading-state" v-else>
      <div class="loader"></div>
      <p>Loading security data...</p>
    </div>
  </AdminLayout>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import AdminLayout from '@/components/AdminLayout.vue'
import { useSecurityStore } from '@/stores/security'

const securityStore = useSecurityStore()

const failureClass = computed(() => {
  const f = securityStore.stats24h?.failures ?? 0
  if (f >= 10) return 'danger'
  if (f >= 3) return 'warning'
  return ''
})

const blockedClass = computed(() => {
  const b = securityStore.metrics?.unique_ips_blocked ?? 0
  if (b >= 5) return 'danger'
  if (b >= 1) return 'warning'
  return ''
})

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

onMounted(() => {
  securityStore.fetchStats()
})
</script>

<style src="@/assets/styles/pagesScss/admin-security.scss" lang="scss" scoped></style>
