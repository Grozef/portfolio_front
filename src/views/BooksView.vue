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

    <!-- Portfolio Context Section - Only shown to visitors -->
    <section class="portfolio-intro" v-if="!isAuthenticated">
      <div class="intro-content">
        <h2>Why This Page Exists</h2>
        <p>Because coding isn't just about writing code. </p>

        <div class="technical-showcase">
          <div class="tech-point">
            <span class="tech-icon"></span>
            <div class="tech-detail">
              <h3>Optimistic UI Updates</h3>
              <p class="https://www.croissantage.com/">Pinia state management with instant feedback and background sync.
                Because everyone deserve to see what i can do with a few photos of myself and a little bit of help by
                gemini
                and nano banana.</p>
            </div>
          </div>

          <div class="tech-point">
            <span class="tech-icon"></span>
            <div class="tech-detail">
              <h3>Multi-Provider ISBN Lookup</h3>
              <p class="https://www.youtube.com/playlist?list=PLjwdMgw5TTLVDv-ceONHM_C19dPW1MAMD">Cascading fallback
                between
                OpenLibrary and Google Books APIs with intelligent caching. You can't just read documentation. Foo and
                bar
                are gonna make you insane. Read some fantasy, it works for me...</p>
            </div>
          </div>

          <div class="tech-point">
            <span class="tech-icon"></span>
            <div class="tech-detail">
              <h3>Mobile-First Responsive</h3>
              <p class="https://gitlab.com/DeveloppeurMuscle/symrecipe">Because let's be honest, you're reading this on
                your
                phone right now. Probably in bed. Grid adapts from 2 to 5 columns so book covers look good whether
                you're on
                a phone or looking for eastereggs in the inspector on desktop. Or you can be brave, go out and do some
                sport
                !</p>
            </div>
          </div>
          <div class="tech-point">
            <span class="tech-icon"></span>
            <div class="tech-detail">
              <h3>Design System Consistency</h3>
              <p class="https://fr.wikipedia.org/wiki/DNS_over_HTTPS">CSS custom properties, terminal aesthetic,
                reusable
                component patterns that I'll probably refactor into clean architecture... someday. For now, SCSS
                variables
                keep the chaos organized.</p>
            </div>
          </div>
        </div>

        <p class="intro-note">This isn't just a side project — Some ideas are meant to be shared.</p>
      </div>
    </section>

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
          :class="{ active: index === carouselIndex % carouselImages.length }" @click="carouselIndex = index"></button>
      </div>
    </div>

    <div class="stats-bar" v-if="stats">
      <div class="stat-item"><span class="stat-value">{{ stats.to_read }}</span><span class="stat-label">To
          Read</span>
      </div>
      <div class="stat-item"><span class="stat-value">{{ stats.read }}</span><span class="stat-label">Read</span>
      </div>
      <div class="stat-item"><span class="stat-value">{{ stats.reading }}</span><span class="stat-label">Reading</span>
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
        <article v-for="book in books" :key="book.id" class="book-card" @click="openBookModal(book)" data-cursor-hover>
          <div class="book-cover">
            <img v-if="book.display_cover_url" :src="book.display_cover_url" :alt="book.display_title" loading="lazy" />
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

    <!-- Reading Insights Stats -->
    <div class="stats-bar" v-if="readingInsights">
      <div class="stat-item">
        <span class="stat-value">{{ readingInsights.totalRead }}</span>
        <span class="stat-label">Total Read - All Time</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ readingInsights.booksThisYear }}</span>
        <span class="stat-label">Books Read This Year</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ readingInsights.fiveStarCount }}</span>
        <span class="stat-label">5★ Rated</span>
      </div>
        <div class="stat-item" v-if="topGenre">
    <span class="stat-value">{{ topGenre.name }}</span>
    <span class="stat-label">Top Genre ({{ topGenre.count }})</span>
  </div>
  <div class="stat-item" v-else>
    <span class="stat-value">—</span>
    <span class="stat-label">Top Genre</span>
  </div>
    </div>


    <section class="quote-section">
      <blockquote class="quote">
        <p>" Tout ce qui arrive est nécessaire. "</p>
        <cite>&mdash; Un stoïcien</cite>
      </blockquote>

      <!-- Fleeing Button Easter Egg -->
      <FleeingButton />
    </section>

    <!-- Modals -->
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

                <div class="form-group" v-if="!isEditMode && selectedBook.genre">
    <label>Genre</label>
    <p class="description">{{ selectedBook.genre }}</p>
  </div>
  <div class="form-group" v-if="isEditMode">
    <label for="edit-genre">Genre</label>
    <select id="edit-genre" v-model="selectedBook.genre">
      <option value="">Select genre...</option>
      <option value="Fantasy">Fantasy</option>
      <option value="Sci-Fi">Sci-Fi</option>
      <option value="Mystery">Mystery</option>
      <option value="Romance">Romance</option>
      <option value="History">History</option>
      <option value="Biography">Biography</option>
      <option value="Technical">Technical</option>
      <option value="Other">Other</option>
    </select>
  </div>

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
              <div class="form-group"><label for="isbn">ISBN</label><input id="isbn" v-model="newBook.isbn" type="text"
                  placeholder="978-0123456789" :disabled="requireManualEntry" /><small v-if="!requireManualEntry">Leave
                  empty to enter manually</small></div>
              <div v-if="requireManualEntry || !newBook.isbn" class="manual-entry">
                <div class="form-group"><label for="title">Title *</label><input id="title" v-model="newBook.title"
                    type="text" required /></div>
                <div class="form-group"><label for="author">Author</label><input id="author" v-model="newBook.author"
                    type="text" /></div>
                    <div class="form-group">
  <label for="genre">Genre</label>
  <select id="genre" v-model="newBook.genre">
    <option value="">Select genre...</option>
    <option value="Fantasy">Fantasy</option>
    <option value="Sci-Fi">Sci-Fi</option>
    <option value="Mystery">Mystery</option>
    <option value="Romance">Romance</option>
    <option value="History">History</option>
    <option value="Biography">Biography</option>
    <option value="Technical">Technical</option>
    <option value="Other">Other</option>
  </select>
</div>

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
                  data-cursor-hover>{{ booksStore.isLoading ? 'Adding...' : 'Add Book' }}</button><button type="button"
                  class="btn-secondary" @click="closeAddModal" data-cursor-hover>Cancel</button></div>
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
// import EyeTrackingPortrait from '@/components/EyeTrackingPortrait.vue'

const BOOK_GENRES = [
  'Fantasy',
  'Sci-Fi',
  'Mystery',
  'Thriller',
  'Romance',
  'History',
  'Biography',
  'Philosophy',
  'Technical',
  'Business',
  'Self-Help',
  'Other'
]

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
  genre: '',
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
  }, 20000)
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
  newBook.value = { isbn: '', title: '', author: '', genre: '', cover_url: '', status: 'to-read', rating: null, review: '' }
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
      genre: selectedBook.value.genre,
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

const readingInsights = computed(() => {
  const allBooks = booksStore.books
  if (!allBooks.length) return null
  
  const currentYear = new Date().getFullYear()
  const readBooks = allBooks.filter(b => b.status === 'read')
  
  const booksThisYear = readBooks.filter(b => {
    if (!b.created_at) return false
    const bookDate = new Date(b.created_at)
    return bookDate.getFullYear() === currentYear
  }).length
  
  const currentMonth = new Date().getMonth() + 1
  const averagePerMonth = currentMonth > 0 
    ? Math.round((booksThisYear / currentMonth) * 10) / 10 
    : 0
  
  const fiveStarCount = readBooks.filter(b => b.rating === 5).length
  
  return {
    booksThisYear,
    averagePerMonth,
    fiveStarCount,
    totalRead: readBooks.length,
    currentYear 
  }
})

const topGenre = computed(() => {
  const allBooks = booksStore.books
  if (!allBooks.length) return null
  
  const readBooks = allBooks.filter(b => b.status === 'read' && b.genre)
  if (!readBooks.length) return null
  
  // Compte les genres
  const genreCounts = {}
  readBooks.forEach(book => {
    genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1
  })
  
  // Trouve le plus fréquent
  const sorted = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
  
  return sorted.length > 0 
    ? { name: sorted[0][0], count: sorted[0][1] } 
    : null
})

const goToTerminal = () => router.push('/')
const goToLogin = () => router.push('/login')
const goToAdminCarousel = () => router.push('/Moi/carousel')
const handleLogout = async () => { await authStore.logout() }

onMounted(async () => {
  await authStore.checkAuth()

  booksStore.setFilter('to-read')

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

<style lang="scss" src="@/assets/styles/pagesScss/books.scss" scoped></style>