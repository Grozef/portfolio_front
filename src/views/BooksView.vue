<!--
  BooksView.vue - Page bibliotheque
  
  Fonctionnalites:
  - Affichage grid des livres
  - Filtres par statut (read, reading, to-read)
  - Modal ajout avec ISBN ou saisie manuelle (fallback)
  - Modal edition/suppression (auth requise)
-->
<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBooksStore } from '@/stores/books'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const booksStore = useBooksStore()
const authStore = useAuthStore()

const isLoading = ref(true)
const selectedBook = ref(null)
const isModalOpen = ref(false)
const isAddModalOpen = ref(false)
const isEditMode = ref(false)
const requireManualEntry = ref(false)

const newBook = ref({
  isbn: '',
  title: '',
  author: '',
  cover_url: '',
  status: 'to-read',
  rating: null,
  review: ''
})

const books = computed(() => booksStore.filteredBooks)
const stats = computed(() => booksStore.stats)
const activeFilter = computed(() => booksStore.activeFilter)
const isAuthenticated = computed(() => authStore.isAuthenticated)

const filters = [
  { key: 'all', label: 'All' },
  { key: 'read', label: 'Read' },
  { key: 'reading', label: 'Reading' },
  { key: 'to-read', label: 'To Read' },
]

const setFilter = (filter) => booksStore.setFilter(filter)

const openBookModal = (book) => {
  selectedBook.value = { ...book }
  isEditMode.value = false
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  isEditMode.value = false
  setTimeout(() => { selectedBook.value = null }, 300)
}

const openAddModal = () => {
  newBook.value = { isbn: '', title: '', author: '', cover_url: '', status: 'to-read', rating: null, review: '' }
  requireManualEntry.value = false
  booksStore.clearError()
  isAddModalOpen.value = true
}

const closeAddModal = () => {
  isAddModalOpen.value = false
  requireManualEntry.value = false
}

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

const toggleEditMode = () => { isEditMode.value = !isEditMode.value }

const handleUpdateBook = async () => {
  if (!selectedBook.value) return
  try {
    await booksStore.updateBook(selectedBook.value.id, {
      status: selectedBook.value.status,
      rating: selectedBook.value.rating,
      review: selectedBook.value.review,
      is_featured: selectedBook.value.is_featured
    })
    isEditMode.value = false
    await booksStore.fetchStats()
  } catch (e) {
    console.error('Failed to update:', e)
  }
}

const handleDeleteBook = async () => {
  if (!selectedBook.value || !confirm('Delete this book?')) return
  try {
    await booksStore.deleteBook(selectedBook.value.id)
    closeModal()
    await booksStore.fetchStats()
  } catch (e) {
    console.error('Failed to delete:', e)
  }
}

const handleRefreshCache = async () => {
  if (!selectedBook.value) return
  try {
    const updated = await booksStore.refreshBookCache(selectedBook.value.id)
    selectedBook.value = { ...updated }
  } catch (e) {
    console.error('Failed to refresh:', e)
  }
}

const getStatusColor = (status) => ({
  'read': 'var(--terminal-accent)',
  'reading': 'var(--terminal-accent-secondary)',
  'to-read': 'var(--terminal-text-dim)'
}[status] || 'var(--terminal-text-dim)')

const getStatusLabel = (status) => ({
  'read': 'Read', 'reading': 'Reading', 'to-read': 'To Read'
}[status] || status)

const goToTerminal = () => router.push('/')
const goToLogin = () => router.push('/login')
const handleLogout = async () => { await authStore.logout() }

onMounted(async () => {
  await authStore.checkAuth()
  await Promise.all([booksStore.fetchBooks(), booksStore.fetchStats()])
  isLoading.value = false
})
</script>

<template>
  <div class="books-page">
    <header class="page-header">
      <button class="back-btn" @click="goToTerminal" data-cursor-hover>
        <span class="back-icon">&larr;</span>
        <span class="back-text">Terminal</span>
      </button>
      <h1 class="page-title">Library</h1>
      <div class="header-actions">
        <template v-if="isAuthenticated">
          <button class="add-btn" @click="openAddModal" data-cursor-hover>+ Add</button>
          <button class="logout-btn" @click="handleLogout" data-cursor-hover>Logout</button>
        </template>
        <button v-else class="login-btn" @click="goToLogin" data-cursor-hover>Admin</button>
      </div>
    </header>

    <div class="stats-bar" v-if="stats">
      <div class="stat-item"><span class="stat-value">{{ stats.read }}</span><span class="stat-label">Read</span></div>
      <div class="stat-item"><span class="stat-value">{{ stats.reading }}</span><span class="stat-label">Reading</span></div>
      <div class="stat-item"><span class="stat-value">{{ stats.to_read }}</span><span class="stat-label">To Read</span></div>
    </div>

    <div class="filters">
      <button v-for="filter in filters" :key="filter.key" class="filter-btn" :class="{ active: activeFilter === filter.key }" @click="setFilter(filter.key)" data-cursor-hover>{{ filter.label }}</button>
    </div>

    <div v-if="isLoading" class="loading-state"><div class="loader"></div><p>Loading library...</p></div>

    <main v-else class="books-main">
      <div class="books-grid">
        <article v-for="book in books" :key="book.id" class="book-card" @click="openBookModal(book)" data-cursor-hover>
          <div class="book-cover">
            <img v-if="book.display_cover_url" :src="book.display_cover_url" :alt="book.display_title" loading="lazy" />
            <div v-else class="cover-placeholder"><span>{{ book.display_title?.charAt(0) || '?' }}</span></div>
            <div class="book-status" :style="{ background: getStatusColor(book.status) }">{{ getStatusLabel(book.status) }}</div>
            <div v-if="book.is_featured" class="book-featured">&#9733;</div>
          </div>
          <div class="book-info">
            <h3 class="book-title">{{ book.display_title }}</h3>
            <p class="book-author">{{ book.display_author }}</p>
            <div class="book-rating" v-if="book.rating"><span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= book.rating }">&#9733;</span></div>
          </div>
        </article>
      </div>
      <div v-if="books.length === 0" class="empty-state"><p>No books found.</p></div>
    </main>

    <section class="quote-section">
      <blockquote class="quote">
        <p>"A reader lives a thousand lives before he dies."</p>
        <cite>&mdash; George R.R. Martin</cite>
      </blockquote>
    </section>

    <footer class="page-footer">
      <div class="footer-nav">
        <router-link to="/" data-cursor-hover>Terminal</router-link>
        <router-link to="/projects" data-cursor-hover>Projects</router-link>
        <router-link to="/about" data-cursor-hover>About</router-link>
        <router-link to="/contact" data-cursor-hover>Contact</router-link>
      </div>
    </footer>

    <!-- Book Detail Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
          <div class="modal-content">
            <button class="modal-close" @click="closeModal" data-cursor-hover>&times;</button>
            <div class="modal-body" v-if="selectedBook">
              <div class="modal-cover">
                <img v-if="selectedBook.display_cover_url" :src="selectedBook.display_cover_url" :alt="selectedBook.display_title" />
                <div v-else class="cover-placeholder large"><span>{{ selectedBook.display_title?.charAt(0) || '?' }}</span></div>
              </div>
              <div class="modal-info">
                <template v-if="!isEditMode">
                  <div class="modal-status" :style="{ color: getStatusColor(selectedBook.status) }">{{ getStatusLabel(selectedBook.status) }}<span v-if="selectedBook.is_featured" class="featured-badge">&#9733; Featured</span></div>
                  <h2 class="modal-title">{{ selectedBook.display_title }}</h2>
                  <p class="modal-author">by {{ selectedBook.display_author }}</p>
                  <div class="modal-rating" v-if="selectedBook.rating"><span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= selectedBook.rating }">&#9733;</span></div>
                  <p class="modal-description" v-if="selectedBook.description">{{ selectedBook.description }}</p>
                  <div class="modal-review" v-if="selectedBook.review"><h4>My Review</h4><p>{{ selectedBook.review }}</p></div>
                  <div class="modal-meta"><span class="meta-isbn">ISBN: {{ selectedBook.isbn || 'N/A' }}</span></div>
                </template>
                <template v-else>
                  <h2 class="modal-title">Edit Book</h2>
                  <div class="edit-form">
                    <div class="form-group"><label>Status</label><select v-model="selectedBook.status"><option value="to-read">To Read</option><option value="reading">Reading</option><option value="read">Read</option></select></div>
                    <div class="form-group"><label>Rating</label><div class="rating-input"><button v-for="i in 5" :key="i" type="button" class="star-btn" :class="{ filled: i <= (selectedBook.rating || 0) }" @click="selectedBook.rating = i">&#9733;</button><button type="button" class="clear-rating" @click="selectedBook.rating = null">Clear</button></div></div>
                    <div class="form-group"><label>Review</label><textarea v-model="selectedBook.review" rows="4" placeholder="Your review..."></textarea></div>
                    <div class="form-group checkbox"><label><input type="checkbox" v-model="selectedBook.is_featured" /> Featured</label></div>
                  </div>
                </template>
                <div class="modal-actions" v-if="isAuthenticated">
                  <template v-if="!isEditMode">
                    <button class="action-btn edit" @click="toggleEditMode" data-cursor-hover>Edit</button>
                    <button class="action-btn refresh" @click="handleRefreshCache" data-cursor-hover v-if="selectedBook.isbn">Refresh</button>
                    <button class="action-btn delete" @click="handleDeleteBook" data-cursor-hover>Delete</button>
                  </template>
                  <template v-else>
                    <button class="action-btn save" @click="handleUpdateBook" data-cursor-hover>Save</button>
                    <button class="action-btn cancel" @click="toggleEditMode" data-cursor-hover>Cancel</button>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Add Book Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="isAddModalOpen" class="modal-overlay" @click.self="closeAddModal">
          <div class="modal-content add-modal">
            <button class="modal-close" @click="closeAddModal" data-cursor-hover>&times;</button>
            <div class="modal-body">
              <h2 class="modal-title">Add Book</h2>
              <form @submit.prevent="handleAddBook" class="add-form">
                <div class="form-group">
                  <label>ISBN</label>
                  <input v-model="newBook.isbn" type="text" placeholder="9780132350884" :disabled="requireManualEntry" />
                  <span class="form-hint">{{ requireManualEntry ? 'ISBN not found - enter details manually' : 'Book data will be fetched from Open Library' }}</span>
                </div>
                <template v-if="requireManualEntry || !newBook.isbn">
                  <div class="form-group"><label>Title *</label><input v-model="newBook.title" type="text" placeholder="Clean Code" :required="requireManualEntry || !newBook.isbn" /></div>
                  <div class="form-group"><label>Author</label><input v-model="newBook.author" type="text" placeholder="Robert C. Martin" /></div>
                  <div class="form-group"><label>Cover URL</label><input v-model="newBook.cover_url" type="url" placeholder="https://..." /></div>
                </template>
                <div class="form-group"><label>Status</label><select v-model="newBook.status"><option value="to-read">To Read</option><option value="reading">Reading</option><option value="read">Read</option></select></div>
                <div class="form-group"><label>Rating</label><div class="rating-input"><button v-for="i in 5" :key="i" type="button" class="star-btn" :class="{ filled: i <= (newBook.rating || 0) }" @click="newBook.rating = i">&#9733;</button><button type="button" class="clear-rating" @click="newBook.rating = null">Clear</button></div></div>
                <div class="form-group"><label>Review</label><textarea v-model="newBook.review" rows="3" placeholder="Your review..."></textarea></div>
                <div v-if="booksStore.error && !requireManualEntry" class="error-message">{{ booksStore.error }}</div>
                <button type="submit" class="submit-btn" :disabled="booksStore.isLoading" data-cursor-hover>{{ booksStore.isLoading ? 'Adding...' : 'Add Book' }}</button>
              </form>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
.books-page { min-height: 100vh; background: var(--terminal-bg); display: flex; flex-direction: column; }
.page-header { display: flex; align-items: center; justify-content: space-between; padding: 2rem; border-bottom: 1px solid var(--terminal-border); }
.back-btn { display: flex; align-items: center; gap: 0.5rem; background: transparent; border: 1px solid var(--terminal-border); color: var(--terminal-text); padding: 0.75rem 1.5rem; font-family: var(--font-mono); font-size: 0.875rem; transition: all 0.3s ease; &:hover { border-color: var(--terminal-accent); color: var(--terminal-accent); } }
.page-title { font-family: var(--font-display); font-size: 1.5rem; font-weight: 500; color: var(--terminal-text); }
.header-actions { display: flex; gap: 0.75rem; }
.add-btn, .login-btn, .logout-btn { background: transparent; border: 1px solid var(--terminal-border); color: var(--terminal-text); padding: 0.5rem 1rem; font-family: var(--font-mono); font-size: 0.75rem; transition: all 0.3s ease; &:hover { border-color: var(--terminal-accent); color: var(--terminal-accent); } }
.add-btn { border-color: var(--terminal-accent); color: var(--terminal-accent); }
.stats-bar { display: flex; justify-content: center; gap: 3rem; padding: 1.5rem 2rem; border-bottom: 1px solid var(--terminal-border); background: var(--terminal-bg-secondary); }
.stat-item { text-align: center; .stat-value { display: block; font-family: var(--font-serif); font-size: 2rem; font-weight: 300; color: var(--terminal-accent); } .stat-label { font-family: var(--font-mono); font-size: 0.75rem; color: var(--terminal-text-dim); text-transform: uppercase; letter-spacing: 0.1em; } }
.filters { display: flex; justify-content: center; gap: 0.5rem; padding: 1rem 2rem; border-bottom: 1px solid var(--terminal-border); }
.filter-btn { background: transparent; border: 1px solid var(--terminal-border); color: var(--terminal-text-dim); padding: 0.5rem 1rem; font-family: var(--font-mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; transition: all 0.3s ease; &:hover { border-color: var(--terminal-accent); color: var(--terminal-text); } &.active { background: var(--terminal-accent); border-color: var(--terminal-accent); color: var(--terminal-bg); } }
.loading-state { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; color: var(--terminal-text-dim); .loader { width: 40px; height: 40px; border: 2px solid var(--terminal-border); border-top-color: var(--terminal-accent); border-radius: 50%; animation: spin 1s linear infinite; } }
@keyframes spin { to { transform: rotate(360deg); } }
.books-main { flex: 1; padding: 2rem; }
.books-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 2rem; }
.book-card { background: var(--terminal-bg-secondary); border: 1px solid var(--terminal-border); border-radius: 8px; overflow: hidden; transition: all 0.3s ease; cursor: pointer; &:hover { border-color: var(--terminal-accent); transform: translateY(-4px); } }
.book-cover { position: relative; aspect-ratio: 2/3; overflow: hidden; background: var(--terminal-bg); img { width: 100%; height: 100%; object-fit: cover; } }
.cover-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--terminal-bg) 0%, var(--terminal-bg-secondary) 100%); span { font-family: var(--font-serif); font-size: 4rem; font-weight: 300; color: var(--terminal-border); } &.large span { font-size: 6rem; } }
.book-status { position: absolute; top: 0.5rem; right: 0.5rem; padding: 0.25rem 0.5rem; font-family: var(--font-mono); font-size: 0.625rem; text-transform: uppercase; color: var(--terminal-bg); border-radius: 4px; }
.book-featured { position: absolute; top: 0.5rem; left: 0.5rem; color: gold; font-size: 1rem; }
.book-info { padding: 1rem; }
.book-title { font-family: var(--font-display); font-size: 0.95rem; font-weight: 500; color: var(--terminal-text); margin-bottom: 0.25rem; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.book-author { font-family: var(--font-mono); font-size: 0.7rem; color: var(--terminal-text-dim); margin-bottom: 0.5rem; }
.book-rating .star { color: var(--terminal-border); font-size: 0.8rem; &.filled { color: var(--terminal-accent); } }
.empty-state { text-align: center; padding: 4rem 2rem; color: var(--terminal-text-dim); font-family: var(--font-mono); }
.quote-section { padding: 4rem 2rem; text-align: center; border-top: 1px solid var(--terminal-border); }
.quote { max-width: 600px; margin: 0 auto; p { font-family: var(--font-serif); font-size: 1.5rem; font-style: italic; color: var(--terminal-text-dim); line-height: 1.6; margin-bottom: 1rem; } cite { font-family: var(--font-mono); font-size: 0.875rem; color: var(--terminal-text-dim); font-style: normal; } }
.page-footer { display: flex; justify-content: center; padding: 1.5rem 2rem; border-top: 1px solid var(--terminal-border); }
.footer-nav { display: flex; gap: 2rem; a { font-family: var(--font-mono); font-size: 0.75rem; color: var(--terminal-text-dim); text-transform: uppercase; letter-spacing: 0.1em; transition: color 0.3s ease; &:hover { color: var(--terminal-accent); } } }
.modal-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 2rem; z-index: 1000; }
.modal-content { position: relative; background: var(--terminal-bg); border: 1px solid var(--terminal-border); border-radius: 12px; max-width: 800px; width: 100%; max-height: 90vh; overflow-y: auto; &.add-modal { max-width: 500px; } }
.modal-close { position: absolute; top: 1rem; right: 1rem; background: transparent; border: 1px solid var(--terminal-border); color: var(--terminal-text); width: 40px; height: 40px; border-radius: 50%; font-size: 1.5rem; line-height: 1; transition: all 0.3s ease; z-index: 10; &:hover { border-color: var(--terminal-accent); color: var(--terminal-accent); } }
.modal-body { display: grid; grid-template-columns: 220px 1fr; gap: 2rem; padding: 2rem; .add-modal & { display: block; } @media (max-width: 768px) { grid-template-columns: 1fr; } }
.modal-cover { aspect-ratio: 2/3; border-radius: 8px; overflow: hidden; background: var(--terminal-bg-secondary); img { width: 100%; height: 100%; object-fit: cover; } }
.modal-info { padding-top: 1rem; }
.modal-status { font-family: var(--font-mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.75rem; }
.featured-badge { color: gold; }
.modal-title { font-family: var(--font-display); font-size: 1.75rem; font-weight: 500; color: var(--terminal-text); margin-bottom: 0.5rem; line-height: 1.2; }
.modal-author { font-family: var(--font-mono); font-size: 0.95rem; color: var(--terminal-text-dim); margin-bottom: 1rem; }
.modal-rating .star { color: var(--terminal-border); font-size: 1.25rem; &.filled { color: var(--terminal-accent); } }
.modal-description { font-size: 0.95rem; color: var(--terminal-text); line-height: 1.7; margin: 1.5rem 0; }
.modal-review { background: var(--terminal-bg-secondary); border-left: 3px solid var(--terminal-accent); padding: 1rem 1.5rem; margin: 1.5rem 0; h4 { font-family: var(--font-mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--terminal-accent); margin-bottom: 0.5rem; } p { font-family: var(--font-serif); font-style: italic; color: var(--terminal-text-dim); line-height: 1.6; } }
.modal-meta { font-family: var(--font-mono); font-size: 0.75rem; color: var(--terminal-text-dim); margin: 1rem 0; }
.modal-actions { display: flex; gap: 0.75rem; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--terminal-border); }
.action-btn { padding: 0.5rem 1rem; font-family: var(--font-mono); font-size: 0.75rem; border: 1px solid var(--terminal-border); background: transparent; color: var(--terminal-text); transition: all 0.3s ease; &:hover { border-color: var(--terminal-accent); color: var(--terminal-accent); } &.save { background: var(--terminal-accent); border-color: var(--terminal-accent); color: var(--terminal-bg); } &.delete { border-color: #ff6464; color: #ff6464; &:hover { background: #ff6464; color: var(--terminal-bg); } } }
.edit-form, .add-form { display: flex; flex-direction: column; gap: 1.25rem; margin-top: 1.5rem; }
.form-group { display: flex; flex-direction: column; gap: 0.5rem; label { font-family: var(--font-mono); font-size: 0.75rem; color: var(--terminal-text-dim); text-transform: uppercase; letter-spacing: 0.1em; } input, select, textarea { background: var(--terminal-bg); border: 1px solid var(--terminal-border); color: var(--terminal-text); padding: 0.75rem 1rem; font-family: var(--font-mono); font-size: 0.875rem; border-radius: 6px; &:focus { outline: none; border-color: var(--terminal-accent); } &:disabled { opacity: 0.5; } } textarea { resize: vertical; min-height: 80px; } &.checkbox { flex-direction: row; align-items: center; label { display: flex; align-items: center; gap: 0.5rem; text-transform: none; } input[type="checkbox"] { width: 18px; height: 18px; padding: 0; } } }
.form-hint { font-family: var(--font-mono); font-size: 0.7rem; color: var(--terminal-text-dim); font-style: italic; }
.rating-input { display: flex; align-items: center; gap: 0.25rem; }
.star-btn { background: none; border: none; font-size: 1.5rem; color: var(--terminal-border); cursor: pointer; padding: 0; &.filled { color: var(--terminal-accent); } &:hover { color: var(--terminal-accent); } }
.clear-rating { background: none; border: 1px solid var(--terminal-border); color: var(--terminal-text-dim); font-size: 0.7rem; padding: 0.25rem 0.5rem; margin-left: 0.5rem; cursor: pointer; &:hover { border-color: var(--terminal-accent); color: var(--terminal-accent); } }
.error-message { background: rgba(255, 100, 100, 0.1); border: 1px solid rgba(255, 100, 100, 0.3); color: #ff6464; padding: 0.75rem 1rem; border-radius: 6px; font-family: var(--font-mono); font-size: 0.8rem; }
.submit-btn { background: var(--terminal-accent); border: none; color: var(--terminal-bg); padding: 1rem; font-family: var(--font-mono); font-size: 0.875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; border-radius: 6px; cursor: pointer; transition: all 0.3s ease; &:hover:not(:disabled) { opacity: 0.9; } &:disabled { opacity: 0.5; cursor: not-allowed; } }
.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; .modal-content { transition: transform 0.3s ease; } }
.modal-enter-from, .modal-leave-to { opacity: 0; .modal-content { transform: scale(0.95) translateY(20px); } }
</style>
