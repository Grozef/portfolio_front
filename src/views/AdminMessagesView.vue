<!--
  AdminMessagesView.vue - Gestion des messages de contact
  
  Fonctionnalites:
  - Liste des messages
  - Filtres (all, unread, read)
  - Detail message
  - Marquer comme lu/non lu
  - Supprimer
-->
<script setup>
    import { ref, onMounted, computed } from 'vue'
    import { useRouter } from 'vue-router'
    import { useAuthStore } from '@/stores/auth'
    import AdminLayout from '@/components/AdminLayout.vue'
    import axios from 'axios'
    
    const router = useRouter()
    const authStore = useAuthStore()
    
    const isLoading = ref(true)
    const messages = ref([])
    const selectedMessage = ref(null)
    const selectedFilter = ref('all')
    const isDetailOpen = ref(false)
    const isDeleteModalOpen = ref(false)
    const error = ref(null)
    
    const api = axios.create({
      baseURL: '/api/v1',
      headers: { 'Content-Type': 'application/json' }
    })
    
    api.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })
    
    const filters = [
      { key: 'all', label: 'All' },
      { key: 'unread', label: 'Unread' },
      { key: 'read', label: 'Read' },
    ]
    
    const filteredMessages = computed(() => {
      if (selectedFilter.value === 'all') return messages.value
      if (selectedFilter.value === 'unread') return messages.value.filter(m => !m.read_at)
      if (selectedFilter.value === 'read') return messages.value.filter(m => m.read_at)
      return messages.value
    })
    
    const unreadCount = computed(() => messages.value.filter(m => !m.read_at).length)
    
    const fetchMessages = async () => {
      try {
        const response = await api.get('/messages')
        messages.value = response.data.data || []
      } catch (e) {
        error.value = 'Failed to load messages'
        messages.value = []
      }
    }
    
    onMounted(async () => {
      await authStore.checkAuth()
      if (!authStore.isAuthenticated) {
        router.push('/login')
        return
      }
    
      await fetchMessages()
      isLoading.value = false
    })
    
    const openDetail = async (message) => {
      selectedMessage.value = message
      isDetailOpen.value = true
      
      if (!message.read_at) {
        await markAsRead(message)
      }
    }
    
    const closeDetail = () => {
      isDetailOpen.value = false
      selectedMessage.value = null
    }
    
    const markAsRead = async (message) => {
      try {
        await api.patch(`/messages/${message.id}/read`)
        message.read_at = new Date().toISOString()
      } catch (e) {
        console.error('Failed to mark as read:', e)
      }
    }
    
    const markAsUnread = async (message) => {
      try {
        await api.patch(`/messages/${message.id}/unread`)
        message.read_at = null
      } catch (e) {
        console.error('Failed to mark as unread:', e)
      }
    }
    
    const openDeleteModal = (message) => {
      selectedMessage.value = message
      isDeleteModalOpen.value = true
    }
    
    const closeDeleteModal = () => {
      isDeleteModalOpen.value = false
      if (!isDetailOpen.value) {
        selectedMessage.value = null
      }
    }
    
    const handleDelete = async () => {
      if (!selectedMessage.value) return
      try {
        await api.delete(`/messages/${selectedMessage.value.id}`)
        messages.value = messages.value.filter(m => m.id !== selectedMessage.value.id)
        closeDeleteModal()
        closeDetail()
      } catch (e) {
        console.error('Failed to delete message:', e)
      }
    }
    
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    
    const formatRelativeDate = (date) => {
      const now = new Date()
      const msgDate = new Date(date)
      const diffMs = now - msgDate
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)
    
      if (diffMins < 1) return 'Just now'
      if (diffMins < 60) return `${diffMins}m ago`
      if (diffHours < 24) return `${diffHours}h ago`
      if (diffDays < 7) return `${diffDays}d ago`
      return formatDate(date)
    }
    </script>
    
    <template>
      <AdminLayout>
        <template #header-title>Messages</template>
    
        <div class="messages-admin" v-if="!isLoading">
          <!-- Stats Bar -->
          <div class="stats-bar">
            <div class="stat-item">
              <span class="stat-value">{{ messages.length }}</span>
              <span class="stat-label">Total</span>
            </div>
            <div class="stat-item">
              <span class="stat-value unread">{{ unreadCount }}</span>
              <span class="stat-label">Unread</span>
            </div>
          </div>
    
          <!-- Toolbar -->
          <div class="toolbar">
            <div class="filters">
              <button
                v-for="filter in filters"
                :key="filter.key"
                class="filter-btn"
                :class="{ active: selectedFilter === filter.key }"
                @click="selectedFilter = filter.key"
                data-cursor-hover
              >
                {{ filter.label }}
                <span v-if="filter.key === 'unread' && unreadCount > 0" class="badge">{{ unreadCount }}</span>
              </button>
            </div>
          </div>
    
          <!-- Messages List -->
          <div class="messages-list" v-if="filteredMessages.length">
            <div
              v-for="message in filteredMessages"
              :key="message.id"
              class="message-item"
              :class="{ unread: !message.read_at }"
              @click="openDetail(message)"
              data-cursor-hover
            >
              <div class="message-indicator">
                <span class="dot" :class="{ active: !message.read_at }"></span>
              </div>
              <div class="message-content">
                <div class="message-header">
                  <span class="message-from">{{ message.name }}</span>
                  <span class="message-date">{{ formatRelativeDate(message.created_at) }}</span>
                </div>
                <div class="message-subject">{{ message.subject || 'No subject' }}</div>
                <div class="message-preview">{{ message.message }}</div>
              </div>
              <div class="message-email">{{ message.email }}</div>
            </div>
          </div>
    
          <!-- Empty State -->
          <div v-else class="empty-state">
            <p v-if="selectedFilter !== 'all'">No {{ selectedFilter }} messages</p>
            <p v-else>No messages yet</p>
          </div>
    
          <!-- Error State -->
          <div v-if="error" class="error-state">
            <p>{{ error }}</p>
            <p class="hint">Make sure the messages API endpoint is configured in the backend.</p>
          </div>
        </div>
    
        <!-- Loading State -->
        <div v-else class="loading-state">
          <div class="loader"></div>
          <p>Loading messages...</p>
        </div>
    
        <!-- Message Detail Modal -->
        <Teleport to="body">
          <Transition name="modal">
            <div v-if="isDetailOpen && selectedMessage" class="modal-overlay" @click.self="closeDetail">
              <div class="modal-content modal-detail">
                <div class="modal-header">
                  <h2>Message</h2>
                  <button class="modal-close" @click="closeDetail" data-cursor-hover>&times;</button>
                </div>
                <div class="modal-body">
                  <div class="detail-meta">
                    <div class="meta-row">
                      <span class="meta-label">From:</span>
                      <span class="meta-value">{{ selectedMessage.name }} &lt;{{ selectedMessage.email }}&gt;</span>
                    </div>
                    <div class="meta-row">
                      <span class="meta-label">Subject:</span>
                      <span class="meta-value">{{ selectedMessage.subject || 'No subject' }}</span>
                    </div>
                    <div class="meta-row">
                      <span class="meta-label">Date:</span>
                      <span class="meta-value">{{ formatDate(selectedMessage.created_at) }}</span>
                    </div>
                  </div>
                  <div class="detail-message">
                    {{ selectedMessage.message }}
                  </div>
                </div>
                <div class="modal-actions">
                  <button
                    class="action-btn"
                    @click="selectedMessage.read_at ? markAsUnread(selectedMessage) : markAsRead(selectedMessage)"
                    data-cursor-hover
                  >
                    {{ selectedMessage.read_at ? 'Mark as Unread' : 'Mark as Read' }}
                  </button>
                  <a :href="`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || ''}`" class="action-btn reply" data-cursor-hover>
                    Reply
                  </a>
                  <button class="action-btn delete" @click="openDeleteModal(selectedMessage)" data-cursor-hover>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </Teleport>
    
        <!-- Delete Confirmation Modal -->
        <Teleport to="body">
          <Transition name="modal">
            <div v-if="isDeleteModalOpen && selectedMessage" class="modal-overlay" @click.self="closeDeleteModal">
              <div class="modal-content modal-small">
                <div class="modal-header">
                  <h2>Delete Message</h2>
                  <button class="modal-close" @click="closeDeleteModal" data-cursor-hover>&times;</button>
                </div>
                <div class="modal-body">
                  <p>Are you sure you want to delete this message from <strong>{{ selectedMessage.name }}</strong>?</p>
                  <p class="warning-text">This action cannot be undone.</p>
                </div>
                <div class="modal-actions">
                  <button type="button" class="btn-cancel" @click="closeDeleteModal" data-cursor-hover>Cancel</button>
                  <button type="button" class="btn-delete" @click="handleDelete" data-cursor-hover>Delete</button>
                </div>
              </div>
            </div>
          </Transition>
        </Teleport>
      </AdminLayout>
    </template>
    
    <style lang="scss" scoped>
    .messages-admin {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .stats-bar {
      display: flex;
      gap: 2rem;
      padding: 1rem 1.5rem;
      background: var(--terminal-bg-secondary);
      border: 1px solid var(--terminal-border);
      border-radius: 8px;
    }
    
    .stat-item {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
    
      .stat-value {
        font-family: var(--font-display);
        font-size: 1.5rem;
        font-weight: 500;
        color: var(--terminal-accent);
    
        &.unread {
          color: var(--terminal-warning);
        }
      }
    
      .stat-label {
        font-family: var(--font-mono);
        font-size: 0.75rem;
        color: var(--terminal-text-dim);
        text-transform: uppercase;
      }
    }
    
    .toolbar {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .filters {
      display: flex;
      gap: 0.25rem;
    }
    
    .filter-btn {
      padding: 0.5rem 0.75rem;
      background: transparent;
      border: 1px solid var(--terminal-border);
      color: var(--terminal-text-dim);
      font-family: var(--font-mono);
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    
      &:hover {
        border-color: var(--terminal-accent);
        color: var(--terminal-text);
      }
    
      &.active {
        background: var(--terminal-accent);
        border-color: var(--terminal-accent);
        color: var(--terminal-bg);
      }
    
      .badge {
        background: var(--terminal-warning);
        color: var(--terminal-bg);
        padding: 0.125rem 0.375rem;
        border-radius: 10px;
        font-size: 0.65rem;
        font-weight: 600;
      }
    
      &.active .badge {
        background: var(--terminal-bg);
        color: var(--terminal-accent);
      }
    }
    
    .messages-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .message-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem 1.25rem;
      background: var(--terminal-bg-secondary);
      border: 1px solid var(--terminal-border);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
    
      &:hover {
        border-color: var(--terminal-accent);
      }
    
      &.unread {
        background: rgba(255, 255, 255, 0.02);
        border-left: 3px solid var(--terminal-warning);
    
        .message-from,
        .message-subject {
          font-weight: 600;
        }
      }
    }
    
    .message-indicator {
      padding-top: 0.25rem;
    
      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--terminal-border);
        display: block;
    
        &.active {
          background: var(--terminal-warning);
        }
      }
    }
    
    .message-content {
      flex: 1;
      min-width: 0;
    }
    
    .message-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 0.25rem;
    }
    
    .message-from {
      font-family: var(--font-display);
      font-size: 0.95rem;
      color: var(--terminal-text);
    }
    
    .message-date {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      color: var(--terminal-text-dim);
      flex-shrink: 0;
    }
    
    .message-subject {
      font-family: var(--font-mono);
      font-size: 0.85rem;
      color: var(--terminal-text);
      margin-bottom: 0.25rem;
    }
    
    .message-preview {
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: var(--terminal-text-dim);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .message-email {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--terminal-text-dim);
      flex-shrink: 0;
    }
    
    .empty-state,
    .error-state {
      text-align: center;
      padding: 4rem 2rem;
      background: var(--terminal-bg-secondary);
      border: 1px dashed var(--terminal-border);
      border-radius: 8px;
    
      p {
        font-family: var(--font-mono);
        font-size: 0.9rem;
        color: var(--terminal-text-dim);
      }
    
      .hint {
        font-size: 0.8rem;
        margin-top: 0.5rem;
        opacity: 0.7;
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
    
    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      z-index: 1000;
    }
    
    .modal-content {
      background: var(--terminal-bg);
      border: 1px solid var(--terminal-border);
      border-radius: 12px;
      width: 100%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
    
      &.modal-small {
        max-width: 400px;
      }
    
      &.modal-detail {
        max-width: 700px;
      }
    }
    
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem;
      border-bottom: 1px solid var(--terminal-border);
    
      h2 {
        font-family: var(--font-display);
        font-size: 1.25rem;
        font-weight: 500;
        color: var(--terminal-text);
      }
    }
    
    .modal-close {
      width: 32px;
      height: 32px;
      background: transparent;
      border: 1px solid var(--terminal-border);
      border-radius: 50%;
      color: var(--terminal-text-dim);
      font-size: 1.25rem;
      line-height: 1;
      cursor: pointer;
      transition: all 0.2s ease;
    
      &:hover {
        border-color: var(--terminal-accent);
        color: var(--terminal-accent);
      }
    }
    
    .modal-body {
      padding: 1.5rem;
    
      p {
        font-family: var(--font-mono);
        font-size: 0.9rem;
        color: var(--terminal-text);
        margin-bottom: 0.5rem;
      }
    
      .warning-text {
        color: #ff6464;
        font-size: 0.8rem;
      }
    }
    
    .detail-meta {
      background: var(--terminal-bg-secondary);
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1.5rem;
    }
    
    .meta-row {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 0.5rem;
      font-family: var(--font-mono);
      font-size: 0.85rem;
    
      &:last-child {
        margin-bottom: 0;
      }
    
      .meta-label {
        color: var(--terminal-text-dim);
        min-width: 60px;
      }
    
      .meta-value {
        color: var(--terminal-text);
      }
    }
    
    .detail-message {
      font-family: var(--font-mono);
      font-size: 0.9rem;
      color: var(--terminal-text);
      line-height: 1.7;
      white-space: pre-wrap;
    }
    
    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 1.5rem;
      border-top: 1px solid var(--terminal-border);
    }
    
    .action-btn {
      padding: 0.5rem 1rem;
      background: transparent;
      border: 1px solid var(--terminal-border);
      color: var(--terminal-text-dim);
      font-family: var(--font-mono);
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
    
      &:hover {
        border-color: var(--terminal-accent);
        color: var(--terminal-accent);
      }
    
      &.reply {
        background: var(--terminal-accent);
        border-color: var(--terminal-accent);
        color: var(--terminal-bg);
    
        &:hover {
          opacity: 0.9;
        }
      }
    
      &.delete:hover {
        border-color: #ff6464;
        color: #ff6464;
      }
    }
    
    .btn-cancel {
      padding: 0.75rem 1.25rem;
      background: transparent;
      border: 1px solid var(--terminal-border);
      color: var(--terminal-text-dim);
      font-family: var(--font-mono);
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.2s ease;
    
      &:hover {
        border-color: var(--terminal-text);
        color: var(--terminal-text);
      }
    }
    
    .btn-delete {
      padding: 0.75rem 1.25rem;
      background: #ff6464;
      border: none;
      border-radius: 6px;
      color: white;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s ease;
    
      &:hover {
        opacity: 0.9;
      }
    }
    
    /* Modal Transitions */
    .modal-enter-active,
    .modal-leave-active {
      transition: opacity 0.3s ease;
    
      .modal-content {
        transition: transform 0.3s ease;
      }
    }
    
    .modal-enter-from,
    .modal-leave-to {
      opacity: 0;
    
      .modal-content {
        transform: scale(0.95) translateY(20px);
      }
    }
    
    @media (max-width: 768px) {
      .message-item {
        flex-wrap: wrap;
      }
    
      .message-email {
        width: 100%;
        margin-top: 0.5rem;
        padding-left: 1.5rem;
      }
    }
    </style>