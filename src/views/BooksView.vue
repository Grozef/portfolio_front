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
            <button class="add-btn" @click="openAddModal" data-cursor-hover>+ Add Book</button>
            <button class="add-btn" @click="goToAdminCarousel" data-cursor-hover>Carousel</button>
            <button class="logout-btn" @click="handleLogout" data-cursor-hover>Logout</button>
          </template>
          <button v-else class="login-btn" @click="goToLogin" data-cursor-hover>Admin</button>
        </div>
      </header>

      <!-- Carrousel d'images -->
      <div class="carousel-section" v-if="carouselImages.length > 0 && currentCarouselImage">
        <div class="carousel-container">
          <button class="carousel-arrow carousel-prev" @click="prevCarouselImage" data-cursor-hover>
            ←
          </button>

          <div class="carousel-content">
            <div class="carousel-image">
              <img :src="getImageUrl(currentCarouselImage.image_url)"
                :alt="currentCarouselImage.title || 'Carousel image'" />
            </div>
            <div class="carousel-info" v-if="currentCarouselImage.title">
              <h3>{{ currentCarouselImage.title }}</h3>
            </div>
          </div>

          <button class="carousel-arrow carousel-next" @click="nextCarouselImage" data-cursor-hover>
            →
          </button>
        </div>

        <div class="carousel-indicators">
          <button v-for="(image, index) in carouselImages" :key="image.id" class="carousel-dot"
            :class="{ active: index === carouselIndex % carouselImages.length }"
            @click="carouselIndex = index"></button>
        </div>
      </div>

      <div class="stats-bar" v-if="stats">
        <div class="stat-item"><span class="stat-value">{{ stats.read }}</span><span class="stat-label">Read</span>
        </div>
        <div class="stat-item"><span class="stat-value">{{ stats.reading }}</span><span
            class="stat-label">Reading</span>
        </div>
        <div class="stat-item"><span class="stat-value">{{ stats.to_read }}</span><span class="stat-label">To
            Read</span>
        </div>
      </div>

      <div class="filters">
        <button v-for="filter in filters" :key="filter.key" class="filter-btn"
          :class="{ active: activeFilter === filter.key }" @click="setFilter(filter.key)" data-cursor-hover>{{
            filter.label
          }}</button>
      </div>

      <div v-if="isLoading" class="loading-state">
        <div class="loader"></div>
        <p>Loading library...</p>
      </div>

      <main v-else class="books-main">
        <div class="books-grid">
          <article v-for="book in books" :key="book.id" class="book-card" @click="openBookModal(book)"
            data-cursor-hover>
            <div class="book-cover">
              <img v-if="book.display_cover_url" :src="book.display_cover_url" :alt="book.display_title"
                loading="lazy" />
              <div v-else class="cover-placeholder"><span>{{ book.display_title?.charAt(0) || '?' }}</span></div>
              <div class="book-status" :style="{ background: getStatusColor(book.status) }">{{
                getStatusLabel(book.status) }}
              </div>
              <div v-if="book.is_featured" class="book-featured">&#9733;</div>
            </div>
            <div class="book-info">
              <h3 class="book-title">{{ book.display_title }}</h3>
              <p class="book-author">{{ book.display_author }}</p>
              <div class="book-rating" v-if="book.rating"><span v-for="i in 5" :key="i" class="star"
                  :class="{ filled: i <= book.rating }">&#9733;</span></div>
            </div>
          </article>
        </div>
        <div v-if="books.length === 0" class="empty-state">
          <p>No books found.</p>
        </div>
      </main>

      <section class="quote-section">
        <blockquote class="quote">
          <p>" Tout ce qui arrive est nécessaire. "</p>
          <cite>&mdash; Un stoïcien</cite>
        </blockquote>

        <!-- Fleeing Button Easter Egg -->
        <FleeingButton />
      </section>

      <!-- Modals - unchanged -->
      <transition name="modal">
        <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
          <div class="modal-content book-modal">
            <button class="modal-close" @click="closeModal" data-cursor-hover>×</button>
            <div class="modal-body" v-if="selectedBook">
              <div class="book-modal-cover">
                <img v-if="selectedBook.display_cover_url" :src="selectedBook.display_cover_url"
                  :alt="selectedBook.display_title" />
                <div v-else class="cover-placeholder large"><span>{{ selectedBook.display_title?.charAt(0) || '?'
                    }}</span>
                </div>
              </div>
              <div class="book-modal-info">
                <h2>{{ selectedBook.display_title }}</h2>
                <p class="author">{{ selectedBook.display_author }}</p>
                <div class="isbn" v-if="selectedBook.isbn">ISBN: {{ selectedBook.isbn }}</div>
                <div class="form-group" v-if="!isEditMode"><label>Status</label>
                  <div class="status-badge" :style="{ background: getStatusColor(selectedBook.status) }">{{
                    getStatusLabel(selectedBook.status) }}</div>
                </div>
                <div class="form-group" v-else><label for="status">Status</label><select id="status"
                    v-model="selectedBook.status">
                    <option value="to-read">To Read</option>
                    <option value="reading">Reading</option>
                    <option value="read">Read</option>
                  </select></div>
                <div class="form-group" v-if="!isEditMode && selectedBook.rating"><label>Rating</label>
                  <div class="book-rating large"><span v-for="i in 5" :key="i" class="star"
                      :class="{ filled: i <= selectedBook.rating }">&#9733;</span></div>
                </div>
                <div class="form-group" v-else-if="isEditMode"><label for="rating">Rating</label><select id="rating"
                    v-model.number="selectedBook.rating">
                    <option :value="null">No rating</option>
                    <option v-for="i in 5" :key="i" :value="i">{{ i }} star{{ i > 1 ? 's' : '' }}</option>
                  </select></div>
                <div class="form-group" v-if="selectedBook.description && !isEditMode"><label>Description</label>
                  <p class="description">{{ selectedBook.description }}</p>
                </div>
                <div class="form-group" v-if="!isEditMode && selectedBook.review"><label>Review</label>
                  <p class="review">{{ selectedBook.review }}</p>
                </div>
                <div class="form-group" v-else-if="isEditMode"><label for="review">Review</label><textarea id="review"
                    v-model="selectedBook.review" rows="4" placeholder="Your thoughts..."></textarea></div>
                <div class="form-group checkbox" v-if="isEditMode && isAuthenticated"><label><input type="checkbox"
                      v-model="selectedBook.is_featured" /> Featured</label></div>
                <div class="modal-actions" v-if="isAuthenticated">
                  <button v-if="!isEditMode" class="btn-primary" @click="toggleEditMode" data-cursor-hover>Edit</button>
                  <template v-else>
                    <button class="btn-primary" @click="handleUpdateBook" data-cursor-hover>Save</button>
                    <button class="btn-secondary" @click="toggleEditMode" data-cursor-hover>Cancel</button>
                  </template>
                  <button class="btn-danger" @click="handleDeleteBook" data-cursor-hover>Delete</button>
                  <button v-if="selectedBook.isbn" class="btn-secondary" @click="handleRefreshCache"
                    data-cursor-hover>Refresh
                    Cache</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <transition name="modal">
        <div v-if="isAddModalOpen" class="modal-overlay" @click.self="closeAddModal">
          <div class="modal-content add-modal">
            <button class="modal-close" @click="closeAddModal" data-cursor-hover>×</button>
            <div class="modal-body">
              <h2>Add Book</h2>
              <form @submit.prevent="handleAddBook">
                <div class="form-group"><label for="isbn">ISBN</label><input id="isbn" v-model="newBook.isbn"
                    type="text" placeholder="978-0123456789" :disabled="requireManualEntry" /><small
                    v-if="!requireManualEntry">Leave
                    empty to enter manually</small></div>
                <div v-if="requireManualEntry || !newBook.isbn" class="manual-entry">
                  <div class="form-group"><label for="title">Title *</label><input id="title" v-model="newBook.title"
                      type="text" required /></div>
                  <div class="form-group"><label for="author">Author</label><input id="author" v-model="newBook.author"
                      type="text" /></div>
                  <div class="form-group"><label for="cover_url">Cover URL</label><input id="cover_url"
                      v-model="newBook.cover_url" type="url" placeholder="https://..." /></div>
                </div>
                <div class="form-group"><label for="status">Status</label><select id="status" v-model="newBook.status">
                    <option value="to-read">To Read</option>
                    <option value="reading">Reading</option>
                    <option value="read">Read</option>
                  </select></div>
                <div class="form-group"><label for="rating">Rating</label><select id="rating"
                    v-model.number="newBook.rating">
                    <option :value="null">No rating</option>
                    <option v-for="i in 5" :key="i" :value="i">{{ i }} star{{ i > 1 ? 's' : '' }}</option>
                  </select></div>
                <div class="form-group"><label for="review">Review</label><textarea id="review" v-model="newBook.review"
                    rows="3"></textarea></div>
                <div class="error-message" v-if="booksStore.error">{{ booksStore.error }}</div>
                <div class="modal-actions"><button type="submit" class="btn-primary" :disabled="booksStore.isLoading"
                    data-cursor-hover>{{ booksStore.isLoading ? 'Adding...' : 'Add Book' }}</button><button
                    type="button" class="btn-secondary" @click="closeAddModal" data-cursor-hover>Cancel</button></div>
              </form>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBooksStore } from '@/stores/books'
import { useAuthStore } from '@/stores/auth'
import { useCarouselStore } from '@/stores/carousel'
import { BACKEND_URL } from '@/services/api'
import FleeingButton from '@/components/FleeingButton.vue'

const router = useRouter()
const booksStore = useBooksStore()
const authStore = useAuthStore()
const carouselStore = useCarouselStore()

const isLoading = ref(true)
const selectedBook = ref(null)
const isModalOpen = ref(false)
const isAddModalOpen = ref(false)
const isEditMode = ref(false)
const requireManualEntry = ref(false)

// Carrousel
const carouselIndex = ref(0)
let carouselInterval = null

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

// Images du carrousel depuis l'API
const carouselImages = computed(() => carouselStore.images)

const currentCarouselImage = computed(() => {
  if (carouselImages.value.length === 0) return null
  return carouselImages.value[carouselIndex.value % carouselImages.value.length]
})

const filters = [
  { key: 'all', label: 'All' },
  { key: 'read', label: 'Read' },
  { key: 'reading', label: 'Reading' },
  { key: 'to-read', label: 'To Read' },
]

const getImageUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return BACKEND_URL + url
}

const setFilter = (filter) => booksStore.setFilter(filter)

const nextCarouselImage = () => {
  if (carouselImages.value.length === 0) return
  carouselIndex.value = (carouselIndex.value + 1) % carouselImages.value.length
}

const prevCarouselImage = () => {
  if (carouselImages.value.length === 0) return
  carouselIndex.value = (carouselIndex.value - 1 + carouselImages.value.length) % carouselImages.value.length
}

const startCarouselAutoplay = () => {
  carouselInterval = setInterval(() => {
    nextCarouselImage()
  }, 3600000) // 1 heure
}

const stopCarouselAutoplay = () => {
  if (carouselInterval) {
    clearInterval(carouselInterval)
    carouselInterval = null
  }
}

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
const goToAdminCarousel = () => router.push('/admin/carousel')
const handleLogout = async () => { await authStore.logout() }

onMounted(async () => {
  await authStore.checkAuth()
  await Promise.all([
    booksStore.fetchBooks(),
    booksStore.fetchStats(),
    carouselStore.fetchImages()
  ])
  isLoading.value = false
  startCarouselAutoplay()
})

onUnmounted(() => {
  stopCarouselAutoplay()
})
</script>

<style lang="scss" scoped>
.books-page {
  min-height: 100vh;
  background: var(--terminal-bg);
  padding-bottom: 4rem;
}

.page-header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  background: rgba(10, 10, 15, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--terminal-border);

  @media (max-width: 768px) {
    padding: 1rem;
    flex-wrap: wrap;
    gap: 1rem;
  }
}

.page-title {
  font-family: var(--font-display);
  font-size: 2rem;
  color: var(--terminal-accent);
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    order: 2;
    flex: 1;
    text-align: center;
  }
}

.back-btn,
.add-btn,
.logout-btn,
.login-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid var(--terminal-border);
  color: var(--terminal-text);
  font-family: var(--font-mono);
  font-size: 0.875rem;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: var(--terminal-accent);
    color: var(--terminal-accent);
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
  }
}

.header-actions {
  display: flex;
  gap: 0.5rem;

  @media (max-width: 768px) {
    order: 3;
    flex-wrap: wrap;
  }
}

.carousel-section {
  margin: 2rem auto;
  max-width: 1200px;
  padding: 0 2rem;

  @media (max-width: 768px) {
    padding: 0 1rem;
    margin: 1rem auto;
  }
}

.carousel-container {
  display: flex;
  align-items: center;
  gap: 2rem;
  background: var(--terminal-bg-secondary);
  border: 1px solid var(--terminal-border);
  border-radius: 8px;
  padding: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
}

.carousel-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border: 1px solid var(--terminal-border);
  border-radius: 50%;
  background: transparent;
  color: var(--terminal-text);
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;

  &:hover {
    border-color: var(--terminal-accent);
    background: var(--terminal-accent);
    color: var(--terminal-bg);
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
}

.carousel-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
}

.carousel-image {
  flex-shrink: 0;
  max-width: 600px;
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);

  img {
    width: 100%;
    height: auto;
    display: block;
  }

  @media (max-width: 768px) {
    max-width: 100%;
  }
}

.carousel-info {
  flex: 1;

  h3 {
    font-family: var(--font-display);
    font-size: 1.5rem;
    color: var(--terminal-accent);
    margin: 0;

    @media (max-width: 768px) {
      font-size: 1.2rem;
      text-align: center;
    }
  }
}

.carousel-indicators {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.carousel-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid var(--terminal-border);
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;

  &.active {
    background: var(--terminal-accent);
    border-color: var(--terminal-accent);
  }

  &:hover {
    border-color: var(--terminal-accent);
  }
}

.stats-bar {
  display: flex;
  justify-content: center;
  gap: 3rem;
  padding: 2rem;
  border-bottom: 1px solid var(--terminal-border);

  @media (max-width: 768px) {
    gap: 1.5rem;
    padding: 1rem;
  }
}

.stat-item {
  text-align: center;

  .stat-value {
    display: block;
    font-family: var(--font-display);
    font-size: 2.5rem;
    color: var(--terminal-accent);

    @media (max-width: 768px) {
      font-size: 1.8rem;
    }
  }

  .stat-label {
    font-size: 0.875rem;
    color: var(--terminal-text-dim);
    text-transform: uppercase;
    letter-spacing: 0.05em;

    @media (max-width: 768px) {
      font-size: 0.75rem;
    }
  }
}

.filters {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid var(--terminal-border);
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 0.5rem;
    padding: 1rem;
  }
}

.filter-btn {
  padding: 0.5rem 1.5rem;
  background: transparent;
  border: 1px solid var(--terminal-border);
  color: var(--terminal-text);
  font-family: var(--font-mono);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--terminal-accent);
    color: var(--terminal-accent);
  }

  &.active {
    background: var(--terminal-accent);
    border-color: var(--terminal-accent);
    color: var(--terminal-bg);
  }

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
}

.books-main {
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 1rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

.book-card {
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-8px);

    .book-cover img {
      filter: brightness(1.1);
    }
  }
}

.book-cover {
  position: relative;
  aspect-ratio: 2/3;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  margin-bottom: 0.75rem;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: filter 0.3s ease;
  }
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  background: var(--terminal-bg-secondary);
  border: 1px solid var(--terminal-border);
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    font-family: var(--font-display);
    font-size: 4rem;
    color: var(--terminal-accent);

    @media (max-width: 768px) {
      font-size: 3rem;
    }
  }

  &.large {
    font-size: 8rem;

    @media (max-width: 768px) {
      font-size: 5rem;
    }
  }
}

.book-status {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
  border-radius: 2px;
  color: var(--terminal-bg);

  @media (max-width: 768px) {
    font-size: 0.6rem;
    padding: 0.2rem 0.4rem;
  }
}

.book-featured {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  font-size: 1.5rem;
  color: var(--terminal-accent);
  filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.5));
}

.book-info {
  .book-title {
    font-family: var(--font-serif);
    font-size: 1rem;
    color: var(--terminal-text);
    margin-bottom: 0.25rem;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;

    @media (max-width: 768px) {
      font-size: 0.9rem;
    }
  }

  .book-author {
    font-size: 0.875rem;
    color: var(--terminal-text-dim);
    margin-bottom: 0.5rem;

    @media (max-width: 768px) {
      font-size: 0.8rem;
    }
  }
}

.book-rating {
  display: flex;
  gap: 0.25rem;

  .star {
    font-size: 0.875rem;
    color: var(--terminal-text-dim);

    &.filled {
      color: var(--terminal-accent);
    }

    @media (max-width: 768px) {
      font-size: 0.75rem;
    }
  }

  &.large .star {
    font-size: 1.5rem;
  }
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
}

.loader {
  width: 40px;
  height: 40px;
  border: 3px solid var(--terminal-border);
  border-top-color: var(--terminal-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.quote-section {
  padding: 4rem 2rem;
  text-align: center;
  border-top: 1px solid var(--terminal-border);

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
}

.quote {
  max-width: 600px;
  margin: 0 auto;

  p {
    font-family: var(--font-serif);
    font-size: 1.5rem;
    font-style: italic;
    color: var(--terminal-text);
    margin-bottom: 1rem;

    @media (max-width: 768px) {
      font-size: 1.2rem;
    }
  }

  cite {
    font-size: 0.875rem;
    color: var(--terminal-text-dim);
    font-style: normal;
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: var(--terminal-bg-secondary);
  border: 1px solid var(--terminal-border);
  border-radius: 8px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;

  @media (max-width: 768px) {
    max-width: 100%;
    max-height: 95vh;
  }
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--terminal-text);
  font-size: 2rem;
  cursor: pointer;
  z-index: 10;

  &:hover {
    color: var(--terminal-accent);
  }
}

.modal-body {
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
}

.book-modal {
  .modal-body {
    display: flex;
    gap: 2rem;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 1rem;
    }
  }
}

.book-modal-cover {
  flex-shrink: 0;
  width: 200px;

  @media (max-width: 768px) {
    width: 150px;
    margin: 0 auto;
  }

  img {
    width: 100%;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  }
}

.book-modal-info {
  flex: 1;

  h2 {
    font-family: var(--font-display);
    font-size: 1.5rem;
    color: var(--terminal-accent);
    margin-bottom: 0.5rem;
  }

  .author {
    font-size: 1rem;
    color: var(--terminal-text-dim);
    margin-bottom: 1rem;
  }

  .isbn {
    font-family: var(--font-mono);
    font-size: 0.875rem;
    color: var(--terminal-text-dim);
    margin-bottom: 1rem;
  }
}

.form-group {
  margin-bottom: 1.5rem;

  label {
    display: block;
    font-size: 0.875rem;
    color: var(--terminal-text-dim);
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  input,
  select,
  textarea {
    width: 100%;
    padding: 0.75rem;
    background: var(--terminal-bg);
    border: 1px solid var(--terminal-border);
    color: var(--terminal-text);
    font-family: var(--font-mono);
    font-size: 0.875rem;

    &:focus {
      outline: none;
      border-color: var(--terminal-accent);
    }
  }

  small {
    display: block;
    margin-top: 0.25rem;
    font-size: 0.75rem;
    color: var(--terminal-text-dim);
  }

  &.checkbox {
    label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-transform: none;
    }

    input[type="checkbox"] {
      width: auto;
    }
  }
}

.status-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  color: var(--terminal-bg);
  font-weight: 500;
  text-transform: uppercase;
  font-size: 0.875rem;
}

.description,
.review {
  line-height: 1.6;
  color: var(--terminal-text);
}

.modal-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary,
.btn-danger {
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--terminal-border);
  font-family: var(--font-mono);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.8rem;
  }
}

.btn-primary {
  background: var(--terminal-accent);
  border-color: var(--terminal-accent);
  color: var(--terminal-bg);

  &:hover {
    background: transparent;
    color: var(--terminal-accent);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.btn-secondary {
  background: transparent;
  color: var(--terminal-text);

  &:hover {
    border-color: var(--terminal-accent);
    color: var(--terminal-accent);
  }
}

.btn-danger {
  background: transparent;
  border-color: #ff4444;
  color: #ff4444;

  &:hover {
    background: #ff4444;
    color: var(--terminal-bg);
  }
}

.error-message {
  padding: 0.75rem;
  background: rgba(255, 68, 68, 0.1);
  border: 1px solid #ff4444;
  color: #ff4444;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

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
    transform: scale(0.9);
  }
}
</style>