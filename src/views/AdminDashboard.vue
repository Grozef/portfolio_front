    <template>
      <AdminLayout>
        <template #header-title>Dashboard</template>

        <div class="dashboard" v-if="!isLoading">
          <!-- Stats Cards -->
          <section class="stats-section">
            <div class="stat-card" role="region" aria-labelledby="stat-books">
              <div class="stat-icon">◈</div>
              <div class="stat-info">
                <span class="stat-value">{{ stats.total || 0 }}</span>
                <span class="stat-label">Total Books</span>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon success">✓</div>
              <div class="stat-info">
                <span class="stat-value">{{ stats.read || 0 }}</span>
                <span class="stat-label">Books Read</span>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon warning">◎</div>
              <div class="stat-info">
                <span class="stat-value">{{ stats.reading || 0 }}</span>
                <span class="stat-label">Currently Reading</span>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon accent">◇</div>
              <div class="stat-info">
                <span class="stat-value">{{ stats.to_read || 0 }}</span>
                <span class="stat-label">To Read</span>
              </div>
            </div>
          </section>

          <!-- Quick Actions -->
          <section class="actions-section">
            <h2 class="section-title">Quick Actions</h2>
            <div class="actions-grid">
              <button v-for="action in quickActions" :key="action.label" class="action-btn" @click="action.action"
                data-cursor-hover>
                <span class="action-icon">{{ action.icon }}</span>
                <span class="action-label">{{ action.label }}</span>
                <span class="action-label">{{ action.ariaLabel }}</span>
              </button>
            </div>
          </section>

          <!-- Recent Books -->
          <section class="recent-section">
            <div class="section-header">
              <h2 class="section-title">Recent Books</h2>
              <router-link to="/admin/books" class="view-all" data-cursor-hover>
                View All →
              </router-link>
            </div>

            <div class="recent-list" v-if="recentBooks.length">
              <div v-for="book in recentBooks" :key="book.id" class="recent-item">
                <div class="book-cover-mini">
                  <img v-if="book.display_cover_url" :src="book.display_cover_url" :alt="book.display_title" />
                  <span v-else class="cover-placeholder">{{ book.display_title?.charAt(0) || '?' }}</span>
                </div>
                <div class="book-info">
                  <span class="book-title">{{ book.display_title }}</span>
                  <span class="book-author">{{ book.display_author || 'Unknown' }}</span>
                </div>
                <div class="book-meta">
                  <span class="book-status" :style="{ color: getStatusColor(book.status) }">
                    {{ book.status }}
                  </span>
                  <span class="book-date">{{ formatDate(book.created_at) }}</span>
                </div>
              </div>
            </div>

            <div v-else class="empty-state">
              <p>No books yet. Start by adding your first book!</p>
              <button class="add-btn" @click="router.push('/admin/books?action=add')" data-cursor-hover>
                + Add Book
              </button>
            </div>
          </section>

          <!-- System Info -->
          <section class="info-section">
            <h2 class="section-title">System Info</h2>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">API Status</span>
                <span class="info-value success">● Online</span>
              </div>
              <div class="info-item">
                <span class="info-label">Cache</span>
                <span class="info-value">File-based</span>
              </div>
              <div class="info-item">
                <span class="info-label">Version</span>
                <span class="info-value">v1.0.0</span>
              </div>
            </div>
          </section>
        </div>

        <!-- Loading State -->
        <div v-else class="loading-state">
          <div class="loader"></div>
          <p>Loading dashboard...</p>
        </div>
      </AdminLayout>
    </template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBooksStore } from '@/stores/books'
import { useAuthStore } from '@/stores/auth'
import AdminLayout from '@/components/AdminLayout.vue'

const router = useRouter()
const booksStore = useBooksStore()
const authStore = useAuthStore()

const isLoading = ref(true)
const messagesCount = ref(0)
const recentBooks = ref([])

const stats = computed(() => booksStore.stats)

const quickActions = [
  { label: 'Add Book', icon: '+', action: () => router.push('/admin/books?action=add'), ariaLabel: 'Add a new book' },
  { label: 'View Messages', icon: '◇', action: () => router.push('/admin/messages'), ariaLabel: 'View messages' },
  { label: 'View Site', icon: '→', action: () => router.push('/'), ariaLabel: 'View the main site' },
]

onMounted(async () => {
  await authStore.checkAuth()
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  await booksStore.fetchBooks()
  await booksStore.fetchStats()
  recentBooks.value = booksStore.books.slice(0, 5)
  isLoading.value = false
})

const getStatusColor = (status) => {
  const colors = {
    'read': 'var(--terminal-success)',
    'reading': 'var(--terminal-warning)',
    'to-read': 'var(--terminal-accent)'
  }
  return colors[status] || 'var(--terminal-text-dim)'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}
</script>

<style src="@/assets/styles/pagesScss/admin-dashboard.scss" lang="scss" scoped></style>