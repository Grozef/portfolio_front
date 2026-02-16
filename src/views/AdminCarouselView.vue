    <template>
      <AdminLayout>
        <div class="admin-carousel">
          <header class="page-header">
            <h1 class="page-title">Carousel Management</h1>
            <button class="add-btn" @click="openAddModal" data-cursor-hover>
              + Add Image
            </button>
          </header>

          <div v-if="isLoading" class="loading-state">
            <div class="loader"></div>
            <p>Loading images...</p>
          </div>

          <main v-else class="carousel-main">
            <div v-if="images.length === 0" class="empty-state">
              <p>No images in carousel yet.</p>
              <button class="btn-primary" @click="openAddModal">Add First Image</button>
            </div>

            <div v-else class="images-grid">
              <article v-for="image in images" :key="image.id" class="image-card"
                :class="{ inactive: !image.is_active }">
                <div class="image-preview">
                  <img :src="getImageUrl(image.image_url)" :alt="image.title || 'Carousel image'" />
                  <div class="image-overlay">
                    <button class="btn-edit" @click="openEditModal(image)" data-cursor-hover>
                      Edit
                    </button>
                    <button class="btn-delete" @click="handleDeleteImage(image.id)" data-cursor-hover>
                      Delete
                    </button>
                  </div>
                </div>
                <div class="image-info">
                  <h3 class="image-title">{{ image.title || 'Untitled' }}</h3>
                  <div class="image-meta">
                    <span class="meta-order">Order: {{ image.sort_order }}</span>
                    <button class="meta-status" :class="{ active: image.is_active }" @click="toggleActive(image)"
                      data-cursor-hover>
                      {{ image.is_active ? 'Active' : 'Inactive' }}
                    </button>
                  </div>
                </div>
              </article>
            </div>
          </main>

          <!-- Add Modal -->
          <transition name="modal">
            <div v-if="isAddModalOpen" class="modal-overlay" @click.self="closeAddModal">
              <div class="modal-content">
                <button class="modal-close" @click="closeAddModal" data-cursor-hover>×</button>
                <div class="modal-body">
                  <h2>Add Image</h2>

                  <!-- Mode selector -->
                  <div class="mode-tabs">
                    <button class="mode-tab" :class="{ active: uploadMode === 'url' }" @click="uploadMode = 'url'"
                      type="button">
                      URL
                    </button>
                    <button class="mode-tab" :class="{ active: uploadMode === 'file' }" @click="uploadMode = 'file'"
                      type="button">
                      Upload File
                    </button>
                  </div>

                  <form @submit.prevent="handleAddImage">
                    <!-- URL Mode -->
                    <div v-if="uploadMode === 'url'" class="form-group">
                      <label for="image_url">Image URL *</label>
                      <input id="image_url" v-model="newImage.image_url" type="url"
                        placeholder="https://example.com/image.jpg" :required="uploadMode === 'url'" />
                      <small>Direct link to image (jpg, png, gif, webp)</small>
                    </div>

                    <!-- File Upload Mode -->
                    <div v-if="uploadMode === 'file'" class="form-group">
                      <label for="image_file">Select Image *</label>
                      <input id="image_file" type="file" accept="image/*" @change="handleFileSelect"
                        :required="uploadMode === 'file' && !selectedFile" class="file-input"
                        :src="getImageUrl(newImage.image_url)" />
                      <small>Max 5MB (jpg, png, gif, webp)</small>

                      <!-- Preview -->
                      <div v-if="selectedFile" class="image-preview-container">
                        <img :src="newImage.image_url" alt="Preview" class="preview-image" />
                        <p class="file-name">{{ selectedFile.name }}</p>
                      </div>
                    </div>

                    <div class="form-group">
                      <label for="title">Title (optional)</label>
                      <input id="title" v-model="newImage.title" type="text" placeholder="Image description" />
                    </div>

                    <div class="form-group checkbox">
                      <label>
                        <input type="checkbox" v-model="newImage.is_active" />
                        Active
                      </label>
                    </div>

                    <div class="error-message" v-if="carouselStore.error">
                      {{ carouselStore.error }}
                    </div>

                    <div class="modal-actions">
                      <button type="submit" class="btn-primary" :disabled="carouselStore.isLoading || isUploading"
                        data-cursor-hover>
                        <span v-if="isUploading">Uploading...</span>
                        <span v-else-if="carouselStore.isLoading">Adding...</span>
                        <span v-else>Add Image</span>
                      </button>
                      <button type="button" class="btn-secondary" @click="closeAddModal" data-cursor-hover>
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </transition>

          <!-- Edit Modal -->
          <transition name="modal">
            <div v-if="isEditModalOpen && selectedImage" class="modal-overlay" @click.self="closeEditModal">
              <div class="modal-content">
                <button class="modal-close" @click="closeEditModal" data-cursor-hover>×</button>
                <div class="modal-body">
                  <h2>Edit Image</h2>
                  <form @submit.prevent="handleUpdateImage">
                    <div class="form-group">
                      <label for="edit_image_url">Image URL *</label>
                      <input id="edit_image_url" v-model="selectedImage.image_url" type="url" required />
                    </div>

                    <div class="form-group">
                      <label for="edit_title">Title</label>
                      <input id="edit_title" v-model="selectedImage.title" type="text" />
                    </div>

                    <div class="form-group">
                      <label for="edit_sort_order">Sort Order</label>
                      <input id="edit_sort_order" v-model.number="selectedImage.sort_order" type="number" />
                    </div>

                    <div class="form-group checkbox">
                      <label>
                        <input type="checkbox" v-model="selectedImage.is_active" />
                        Active
                      </label>
                    </div>

                    <div class="error-message" v-if="carouselStore.error">
                      {{ carouselStore.error }}
                    </div>

                    <div class="modal-actions">
                      <button type="submit" class="btn-primary" :disabled="carouselStore.isLoading" data-cursor-hover>
                        {{ carouselStore.isLoading ? 'Saving...' : 'Save Changes' }}
                      </button>
                      <button type="button" class="btn-secondary" @click="closeEditModal" data-cursor-hover>
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </AdminLayout>
    </template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCarouselStore } from '@/stores/carousel'
import { useAuthStore } from '@/stores/auth'
import AdminLayout from '@/components/AdminLayout.vue'
const BACKEND_URL = 'http://localhost/portfolios/dev_portfolio/backend/public'
const router = useRouter()
const carouselStore = useCarouselStore()
const authStore = useAuthStore()

const isLoading = ref(true)
const isAddModalOpen = ref(false)
const isEditModalOpen = ref(false)
const selectedImage = ref(null)
const uploadMode = ref('url') // 'url' or 'file'
const selectedFile = ref(null)
const isUploading = ref(false)

const newImage = ref({
  title: '',
  image_url: '',
  is_active: true
})

const images = computed(() => carouselStore.images)
const getImageUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return BACKEND_URL + url
}

onMounted(async () => {
  await authStore.checkAuth()
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  await carouselStore.fetchImages()
  isLoading.value = false
})

const openAddModal = () => {
  newImage.value = { title: '', image_url: '', is_active: true }
  uploadMode.value = 'url'
  selectedFile.value = null
  carouselStore.clearError()
  isAddModalOpen.value = true
}

const closeAddModal = () => {
  isAddModalOpen.value = false
  selectedFile.value = null
}

const openEditModal = (image) => {
  selectedImage.value = { ...image }
  isEditModalOpen.value = true
}

const closeEditModal = () => {
  isEditModalOpen.value = false
  selectedImage.value = null
}

const handleFileSelect = (event) => {
  console.log(' handleFileSelect - Event:', event)
  console.log(' Files:', event.target.files)

  const file = event.target.files[0]
  console.log(' Selected file:', file)

  if (file) {
    selectedFile.value = file
    console.log(' File stored in selectedFile.value:', selectedFile.value)

    // Prévisualisation
    const reader = new FileReader()
    reader.onload = (e) => {
      newImage.value.image_url = e.target.result
      console.log(' Preview URL generated')
    }
    reader.readAsDataURL(file)
  } else {
    console.error(' No file selected')
  }
}

const handleAddImage = async () => {
  try {
    console.log(' handleAddImage - Start')
    console.log(' Upload mode:', uploadMode.value)
    console.log(' Selected file:', selectedFile.value)
    console.log(' New image:', newImage.value)

    let imageUrl = newImage.value.image_url

    // Si mode upload, uploader d'abord le fichier
    if (uploadMode.value === 'file' && selectedFile.value) {
      console.log(' Uploading file...')
      isUploading.value = true
      imageUrl = await carouselStore.uploadImage(selectedFile.value)
      console.log(' File uploaded, URL:', imageUrl)
    } else if (uploadMode.value === 'file' && !selectedFile.value) {
      console.error(' Upload mode is "file" but no file selected!')
      carouselStore.error = 'Please select a file to upload'
      return
    }

    // Créer l'entrée en BDD
    console.log(' Creating image entry with URL:', imageUrl)
    await carouselStore.createImage({
      title: newImage.value.title,
      image_url: imageUrl,
      is_active: newImage.value.is_active
    })

    console.log(' Image created successfully')
    closeAddModal()
  } catch (e) {
    console.error('Failed to add image:', e)
  } finally {
    isUploading.value = false
  }
}

const handleUpdateImage = async () => {
  if (!selectedImage.value) return
  try {
    await carouselStore.updateImage(selectedImage.value.id, {
      title: selectedImage.value.title,
      image_url: selectedImage.value.image_url,
      is_active: selectedImage.value.is_active,
      sort_order: selectedImage.value.sort_order
    })
    closeEditModal()
  } catch (e) {
    console.error('Failed to update image:', e)
  }
}

const handleDeleteImage = async (id) => {
  if (!confirm('Delete this image?')) return
  try {
    await carouselStore.deleteImage(id)
  } catch (e) {
    console.error('Failed to delete image:', e)
  }
}

const toggleActive = async (image) => {
  try {
    await carouselStore.updateImage(image.id, {
      ...image,
      is_active: !image.is_active
    })
  } catch (e) {
    console.error('Failed to toggle active:', e)
  }
}
</script>



<style src="@/assets/styles/pagesScss/admin-carousel.scss" lang="scss" scoped></style>