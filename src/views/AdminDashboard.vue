<!--
  AdminDashboard.vue - Dashboard principal admin
  
  Fonctionnalites:
  - Stats overview (books, messages)
  - Quick actions
  - Recent activity
-->
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
      { label: 'Add Book', icon: '+', action: () => router.push('/admin/books?action=add') },
      { label: 'View Messages', icon: '◇', action: () => router.push('/admin/messages') },
      { label: 'View Site', icon: '→', action: () => router.push('/') },
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
    
    <template>
      <AdminLayout>
        <template #header-title>Dashboard</template>
    
        <div class="dashboard" v-if="!isLoading">
          <!-- Stats Cards -->
          <section class="stats-section">
            <div class="stat-card">
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
              <button
                v-for="action in quickActions"
                :key="action.label"
                class="action-btn"
                @click="action.action"
                data-cursor-hover
              >
                <span class="action-icon">{{ action.icon }}</span>
                <span class="action-label">{{ action.label }}</span>
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
              <div
                v-for="book in recentBooks"
                :key="book.id"
                class="recent-item"
              >
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
    
    <style lang="scss" scoped>
    .dashboard {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    
    .stats-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }
    
    .stat-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      background: var(--terminal-bg-secondary);
      border: 1px solid var(--terminal-border);
      border-radius: 8px;
      transition: all 0.2s ease;
    
      &:hover {
        border-color: var(--terminal-accent);
      }
    }
    
    .stat-icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--terminal-bg);
      border-radius: 8px;
      font-size: 1.25rem;
      color: var(--terminal-text-dim);
    
      &.success { color: var(--terminal-success); }
      &.warning { color: var(--terminal-warning); }
      &.accent { color: var(--terminal-accent); }
    }
    
    .stat-info {
      display: flex;
      flex-direction: column;
    }
    
    .stat-value {
      font-family: var(--font-display);
      font-size: 2rem;
      font-weight: 500;
      color: var(--terminal-text);
      line-height: 1;
    }
    
    .stat-label {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--terminal-text-dim);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-top: 0.25rem;
    }
    
    .section-title {
      font-family: var(--font-display);
      font-size: 1.125rem;
      font-weight: 500;
      color: var(--terminal-text);
      margin-bottom: 1rem;
    }
    
    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    
      .section-title {
        margin-bottom: 0;
      }
    }
    
    .view-all {
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: var(--terminal-accent);
      transition: opacity 0.2s ease;
    
      &:hover {
        opacity: 0.8;
      }
    }
    
    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }
    
    .action-btn {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.25rem;
      background: var(--terminal-bg-secondary);
      border: 1px solid var(--terminal-border);
      border-radius: 8px;
      color: var(--terminal-text);
      font-family: var(--font-mono);
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
    
      &:hover {
        border-color: var(--terminal-accent);
        color: var(--terminal-accent);
      }
    
      .action-icon {
        font-size: 1.25rem;
      }
    }
    
    .recent-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .recent-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: var(--terminal-bg-secondary);
      border: 1px solid var(--terminal-border);
      border-radius: 8px;
      transition: all 0.2s ease;
    
      &:hover {
        border-color: var(--terminal-accent);
      }
    }
    
    .book-cover-mini {
      width: 40px;
      height: 56px;
      border-radius: 4px;
      overflow: hidden;
      background: var(--terminal-bg);
      flex-shrink: 0;
    
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    
      .cover-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: var(--font-serif);
        font-size: 1.25rem;
        color: var(--terminal-border);
      }
    }
    
    .book-info {
      flex: 1;
      min-width: 0;
    
      .book-title {
        display: block;
        font-family: var(--font-display);
        font-size: 0.95rem;
        color: var(--terminal-text);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    
      .book-author {
        display: block;
        font-family: var(--font-mono);
        font-size: 0.75rem;
        color: var(--terminal-text-dim);
      }
    }
    
    .book-meta {
      text-align: right;
      flex-shrink: 0;
    
      .book-status {
        display: block;
        font-family: var(--font-mono);
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    
      .book-date {
        display: block;
        font-family: var(--font-mono);
        font-size: 0.7rem;
        color: var(--terminal-text-dim);
        margin-top: 0.125rem;
      }
    }
    
    .empty-state {
      text-align: center;
      padding: 3rem 2rem;
      background: var(--terminal-bg-secondary);
      border: 1px dashed var(--terminal-border);
      border-radius: 8px;
    
      p {
        font-family: var(--font-mono);
        font-size: 0.9rem;
        color: var(--terminal-text-dim);
        margin-bottom: 1rem;
      }
    }
    
    .add-btn {
      padding: 0.75rem 1.5rem;
      background: var(--terminal-accent);
      border: none;
      border-radius: 6px;
      color: var(--terminal-bg);
      font-family: var(--font-mono);
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s ease;
    
      &:hover {
        opacity: 0.9;
      }
    }
    
    .info-section {
      padding: 1.5rem;
      background: var(--terminal-bg-secondary);
      border: 1px solid var(--terminal-border);
      border-radius: 8px;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }
    
    .info-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    
      .info-label {
        font-family: var(--font-mono);
        font-size: 0.7rem;
        color: var(--terminal-text-dim);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    
      .info-value {
        font-family: var(--font-mono);
        font-size: 0.875rem;
        color: var(--terminal-text);
    
        &.success {
          color: var(--terminal-success);
        }
      }
    }
    
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      gap: 1rem;
      color: var(--terminal-text-dim);
    
      .loader {
        width: 40px;
        height: 40px;
        border: 2px solid var(--terminal-border);
        border-top-color: var(--terminal-accent);
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    </style>