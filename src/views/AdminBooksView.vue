<template>
  <AdminLayout>
    <template #header-title>Books Management</template>

    <div class="books-admin" v-if="!isLoading">
      <!-- Stats Bar -->
      <div class="stats-bar">
        <div class="stat-item">
          <span class="stat-value">{{ stats.total || 0 }}</span>
          <span class="stat-label">Total</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ stats.read || 0 }}</span>
          <span class="stat-label">Read</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ stats.reading || 0 }}</span>
          <span class="stat-label">Reading</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ stats.to_read || 0 }}</span>
          <span class="stat-label">To Read</span>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="toolbar">
        <div class="search-box">
          <span class="search-icon">⌕</span>
          <input v-model="searchQuery" type="text" placeholder="Search by title, author, or ISBN..."
            aria-label="Search books by title, author or ISBN" />
        </div>

        <div class="filters">
          <button v-for="filter in filters" :key="filter.key" class="filter-btn"
            :class="{ active: selectedFilter === filter.key }" @click="selectedFilter = filter.key" data-cursor-hover
            :aria-label="`Filter by ${filter.label}`" :aria-pressed="selectedFilter === filter.key">
            {{ filter.label }}
          </button>
        </div>

        <button class="add-btn" @click="openAddModal" data-cursor-hover>
          + Add Book
        </button>
      </div>

      <!-- Books Table -->
      <div class="books-table" v-if="books.length">
        <table>
          <thead>
            <tr>
              <th class="col-cover">Cover</th>
              <th class="col-title">Title / Author</th>
              <th class="col-isbn">ISBN</th>
              <th class="col-status">Status</th>
              <th class="col-rating">Rating</th>
              <th class="col-featured">Featured</th>
              <th class="col-date">Added</th>
              <th class="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="book in books" :key="book.id">
              <td class="col-cover">
                <div class="cover-thumb">
                  <img v-if="book.display_cover_url" :src="book.display_cover_url" :alt="book.display_title" />
                  <span v-else class="cover-placeholder">{{ book.display_title?.charAt(0) || '?' }}</span>
                </div>
              </td>
              <td class="col-title">
                <span class="book-title">{{ book.display_title }}</span>
                <span class="book-author">{{ book.display_author || 'Unknown' }}</span>
              </td>
              <td class="col-isbn">
                <span class="isbn-text">{{ book.isbn || '-' }}</span>
              </td>
              <td class="col-status">
                <span class="status-badge" :style="{ color: getStatusColor(book.status) }">
                  {{ book.status }}
                </span>
              </td>
              <td class="col-rating">
                <span class="rating-stars">
                  <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= (book.rating || 0) }">★</span>
                </span>
              </td>
              <td class="col-featured">
                <button class="featured-toggle" :class="{ active: book.is_featured }" @click="toggleFeatured(book)"
                  data-cursor-hover>
                  {{ book.is_featured ? '★' : '☆' }}
                </button>
              </td>
              <td class="col-date">
                <span class="date-text">{{ formatDate(book.created_at) }}</span>
              </td>
              <td class="col-actions">
                <button class="action-btn edit" @click="openEditModal(book)" data-cursor-hover>Edit</button>
                <button class="action-btn delete" @click="openDeleteModal(book)" data-cursor-hover>Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <p v-if="searchQuery">No books found matching "{{ searchQuery }}"</p>
        <p v-else>No books yet. Start by adding your first book!</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else class="loading-state">
      <div class="loader"></div>
      <p>Loading books...</p>
    </div>

    <!-- Add Book Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="isAddModalOpen" class="modal-overlay" @click.self="closeAddModal" aria-labelledby="modal-title" aria-modal="true" role="dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h2 id="modal-title">Add New Book</h2>
              <button aria-label="Close modal" class="modal-close" @click="closeAddModal" data-cursor-hover>&times;</button>
            </div>
            <form @submit.prevent="handleAddBook" class="modal-form">
              <div class="form-group">
                <label>ISBN</label>
                <input v-model="newBook.isbn" type="text" placeholder="9780132350884" :disabled="requireManualEntry" />
                <span class="form-hint">
                  {{ requireManualEntry ? 'ISBN not found - enter details manually' : 'Book data will be fetched from' }}
                  Open
                  Library' 
                </span>
              </div>

              <template v-if="requireManualEntry || !newBook.isbn">
                <div class="form-group">
                  <label>Title *</label>
                  <input v-model="newBook.title" type="text" placeholder="Clean Code"
                    :required="requireManualEntry || !newBook.isbn" />
                </div>
                <div class="form-group">
                  <label>Author</label>
                  <input v-model="newBook.author" type="text" placeholder="Robert C. Martin" />
                </div>
                <div class="form-group">
                  <label>Cover URL</label>
                  <input v-model="newBook.cover_url" type="url" placeholder="https://..." />
                </div>
              </template>

              <div class="form-row">
                <div class="form-group">
                  <label>Status</label>
                  <select v-model="newBook.status">
                    <option value="to-read">To Read</option>
                    <option value="reading">Reading</option>
                    <option value="read">Read</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Rating</label>
                  <div class="rating-input">
                    <button v-for="i in 5" :key="i" type="button" class="star-btn"
                      :class="{ filled: i <= (newBook.rating || 0) }"
                      @click="newBook.rating = newBook.rating === i ? null : i">★</button>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label>Review</label>
                <textarea v-model="newBook.review" rows="3" placeholder="Your thoughts..."></textarea>
              </div>

              <div class="form-group checkbox">
                <label>
                  <input type="checkbox" v-model="newBook.is_featured" />
                  Featured on homepage
                </label>
              </div>

              <div v-if="booksStore.error" class="error-message">{{ booksStore.error }}</div>

              <div class="modal-actions">
                <button type="button" class="btn-cancel" @click="closeAddModal" data-cursor-hover>Cancel</button>
                <button type="submit" class="btn-submit" :disabled="booksStore.isLoading" data-cursor-hover>
                  {{ booksStore.isLoading ? 'Adding...' : 'Add Book' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Edit Book Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="isEditModalOpen && selectedBook" class="modal-overlay" @click.self="closeEditModal">
          <div class="modal-content">
            <div class="modal-header">
              <h2>Edit Book</h2>
              <button class="modal-close" @click="closeEditModal" data-cursor-hover>&times;</button>
            </div>
            <form @submit.prevent="handleUpdateBook" class="modal-form">
              <div class="form-group">
                <label>Title</label>
                <input v-model="selectedBook.display_title" type="text" />
              </div>
              <div class="form-group">
                <label>Author</label>
                <input v-model="selectedBook.display_author" type="text" />
              </div>
              <div class="form-group">
                <label>Cover URL</label>
                <input v-model="selectedBook.display_cover_url" type="url" />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Status</label>
                  <select v-model="selectedBook.status">
                    <option value="to-read">To Read</option>
                    <option value="reading">Reading</option>
                    <option value="read">Read</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Rating</label>
                  <div class="rating-input">
                    <button v-for="i in 5" :key="i" type="button" class="star-btn"
                      :class="{ filled: i <= (selectedBook.rating || 0) }"
                      @click="selectedBook.rating = selectedBook.rating === i ? null : i">★</button>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label>Review</label>
                <textarea v-model="selectedBook.review" rows="3"></textarea>
              </div>

              <div class="form-group checkbox">
                <label>
                  <input type="checkbox" v-model="selectedBook.is_featured" />
                  Featured on homepage
                </label>
              </div>

              <div v-if="booksStore.error" class="error-message">{{ booksStore.error }}</div>

              <div class="modal-actions">
                <button type="button" class="btn-cancel" @click="closeEditModal" data-cursor-hover>Cancel</button>
                <button type="submit" class="btn-submit" :disabled="booksStore.isLoading" data-cursor-hover>
                  {{ booksStore.isLoading ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="isDeleteModalOpen && selectedBook" class="modal-overlay" @click.self="closeDeleteModal">
          <div class="modal-content modal-small">
            <div class="modal-header">
              <h2>Delete Book</h2>
              <button class="modal-close" @click="closeDeleteModal" data-cursor-hover>&times;</button>
            </div>
            <div class="modal-body">
              <p>Are you sure you want to delete <strong>{{ selectedBook.display_title }}</strong>?</p>
              <p class="warning-text">This action cannot be undone.</p>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn-cancel" @click="closeDeleteModal" data-cursor-hover>Cancel</button>
              <button type="button" class="btn-delete" @click="handleDeleteBook" :disabled="booksStore.isLoading"
                data-cursor-hover>
                {{ booksStore.isLoading ? 'Deleting...' : 'Delete' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBooksStore } from '@/stores/books'
import { useAuthStore } from '@/stores/auth'
import AdminLayout from '@/components/AdminLayout.vue'

const router = useRouter()
const route = useRoute()
const booksStore = useBooksStore()
const authStore = useAuthStore()

const isLoading = ref(true)
const searchQuery = ref('')
const selectedFilter = ref('all')
const isAddModalOpen = ref(false)
const isEditModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const selectedBook = ref(null)
const requireManualEntry = ref(false)

const newBook = ref({
  isbn: '',
  title: '',
  author: '',
  cover_url: '',
  status: 'to-read',
  rating: null,
  review: '',
  is_featured: false
})

const filters = [
  { key: 'all', label: 'All' },
  { key: 'read', label: 'Read' },
  { key: 'reading', label: 'Reading' },
  { key: 'to-read', label: 'To Read' },
  { key: 'featured', label: 'Featured' },
]

const books = computed(() => {
  let result = booksStore.books

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(book =>
      book.display_title?.toLowerCase().includes(query) ||
      book.display_author?.toLowerCase().includes(query) ||
      book.isbn?.includes(query)
    )
  }

  if (selectedFilter.value !== 'all') {
    if (selectedFilter.value === 'featured') {
      result = result.filter(book => book.is_featured)
    } else {
      result = result.filter(book => book.status === selectedFilter.value)
    }
  }

  return result
})

const stats = computed(() => booksStore.stats)

watch(() => route.query.action, (action) => {
  if (action === 'add') {
    openAddModal()
  }
})

const openAddModal = () => {
  newBook.value = {
    isbn: '',
    title: '',
    author: '',
    cover_url: '',
    status: 'to-read',
    rating: null,
    review: '',
    is_featured: false
  }
  requireManualEntry.value = false
  booksStore.clearError()
  isAddModalOpen.value = true
}

const closeAddModal = () => {
  isAddModalOpen.value = false
  requireManualEntry.value = false
  router.replace({ query: {} })
}

const openEditModal = (book) => {
  selectedBook.value = { ...book }
  isEditModalOpen.value = true
}

const closeEditModal = () => {
  isEditModalOpen.value = false
  selectedBook.value = null
}

const openDeleteModal = (book) => {
  selectedBook.value = book
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  selectedBook.value = null
}

const handleAdminEsc = (e) => {
  if (e.key !== 'Escape') return
  if (isDeleteModalOpen.value) { closeDeleteModal(); return }
  if (isEditModalOpen.value) { closeEditModal(); return }
  if (isAddModalOpen.value) { closeAddModal(); return }
}

onMounted(async () => {
  await authStore.checkAuth()
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  await booksStore.fetchBooks()
  await booksStore.fetchStats()
  isLoading.value = false

  if (route.query.action === 'add') {
    openAddModal()
  }

  document.addEventListener('keydown', handleAdminEsc)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleAdminEsc)
})

const handleAddBook = async () => {
  try {
    await booksStore.createBook(newBook.value)
    closeAddModal()
    await booksStore.fetchStats()
  } catch (e) {
    if (e.response?.data?.require_manual) {
      requireManualEntry.value = true
    }
  }
}

const handleUpdateBook = async () => {
  if (!selectedBook.value) return
  try {
    await booksStore.updateBook(selectedBook.value.id, {
      title: selectedBook.value.title,
      author: selectedBook.value.author,
      cover_url: selectedBook.value.cover_url,
      status: selectedBook.value.status,
      rating: selectedBook.value.rating,
      review: selectedBook.value.review,
      is_featured: selectedBook.value.is_featured
    })
    closeEditModal()
    await booksStore.fetchStats()
  } catch (e) {
    console.error('Update failed:', e)
  }
}

const handleDeleteBook = async () => {
  if (!selectedBook.value) return
  try {
    await booksStore.deleteBook(selectedBook.value.id)
    closeDeleteModal()
    await booksStore.fetchStats()
  } catch (e) {
    console.error('Delete failed:', e)
  }
}

const toggleFeatured = async (book) => {
  try {
    await booksStore.updateBook(book.id, { is_featured: !book.is_featured })
  } catch (e) {
    console.error('Toggle featured failed:', e)
  }
}

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

<style src="@/assets/styles/pagesScss/admin-books.scss" lang="scss" scoped></style>