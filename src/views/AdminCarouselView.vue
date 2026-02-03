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
      console.log('📁 handleFileSelect - Event:', event)
      console.log('📁 Files:', event.target.files)
      
      const file = event.target.files[0]
      console.log('📁 Selected file:', file)
      
      if (file) {
        selectedFile.value = file
        console.log('✅ File stored in selectedFile.value:', selectedFile.value)
        
        // Prévisualisation
        const reader = new FileReader()
        reader.onload = (e) => {
          newImage.value.image_url = e.target.result
          console.log('🖼️ Preview URL generated')
        }
        reader.readAsDataURL(file)
      } else {
        console.error('❌ No file selected')
      }
    }
    
    const handleAddImage = async () => {
      try {
        console.log('🎬 handleAddImage - Start')
        console.log('📋 Upload mode:', uploadMode.value)
        console.log('📋 Selected file:', selectedFile.value)
        console.log('📋 New image:', newImage.value)
        
        let imageUrl = newImage.value.image_url
    
        // Si mode upload, uploader d'abord le fichier
        if (uploadMode.value === 'file' && selectedFile.value) {
          console.log('✅ Uploading file...')
          isUploading.value = true
          imageUrl = await carouselStore.uploadImage(selectedFile.value)
          console.log('✅ File uploaded, URL:', imageUrl)
        } else if (uploadMode.value === 'file' && !selectedFile.value) {
          console.error('❌ Upload mode is "file" but no file selected!')
          carouselStore.error = 'Please select a file to upload'
          return
        }
    
        // Créer l'entrée en BDD
        console.log('💾 Creating image entry with URL:', imageUrl)
        await carouselStore.createImage({
          title: newImage.value.title,
          image_url: imageUrl,
          is_active: newImage.value.is_active
        })
    
        console.log('✅ Image created successfully')
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
              <article 
                v-for="image in images" 
                :key="image.id" 
                class="image-card"
                :class="{ inactive: !image.is_active }"
              >
                <div class="image-preview">
                  <img :src="getImageUrl(image.image_url)" :alt="image.title || 'Carousel image'" />
                  <div class="image-overlay">
                    <button 
                      class="btn-edit" 
                      @click="openEditModal(image)"
                      data-cursor-hover
                    >
                      Edit
                    </button>
                    <button 
                      class="btn-delete" 
                      @click="handleDeleteImage(image.id)"
                      data-cursor-hover
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div class="image-info">
                  <h3 class="image-title">{{ image.title || 'Untitled' }}</h3>
                  <div class="image-meta">
                    <span class="meta-order">Order: {{ image.sort_order }}</span>
                    <button 
                      class="meta-status"
                      :class="{ active: image.is_active }"
                      @click="toggleActive(image)"
                      data-cursor-hover
                    >
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
                    <button 
                      class="mode-tab" 
                      :class="{ active: uploadMode === 'url' }"
                      @click="uploadMode = 'url'"
                      type="button"
                    >
                      URL
                    </button>
                    <button 
                      class="mode-tab" 
                      :class="{ active: uploadMode === 'file' }"
                      @click="uploadMode = 'file'"
                      type="button"
                    >
                      Upload File
                    </button>
                  </div>
    
                  <form @submit.prevent="handleAddImage">
                    <!-- URL Mode -->
                    <div v-if="uploadMode === 'url'" class="form-group">
                      <label for="image_url">Image URL *</label>
                      <input 
                        id="image_url" 
                        v-model="newImage.image_url" 
                        type="url" 
                        placeholder="https://example.com/image.jpg"
                        :required="uploadMode === 'url'"
                      />
                      <small>Direct link to image (jpg, png, gif, webp)</small>
                    </div>
    
                    <!-- File Upload Mode -->
                    <div v-if="uploadMode === 'file'" class="form-group">
                      <label for="image_file">Select Image *</label>
                      <input 
                        id="image_file" 
                        type="file" 
                        accept="image/*"
                        @change="handleFileSelect"
                        :required="uploadMode === 'file' && !selectedFile"
                        class="file-input"
                        :src="getImageUrl(newImage.image_url)"
                      />
                      <small>Max 5MB (jpg, png, gif, webp)</small>
                      
                      <!-- Preview -->
                      <div v-if="selectedFile" class="image-preview-container">
                        <img :src="newImage.image_url" alt="Preview" class="preview-image" />
                        <p class="file-name">{{ selectedFile.name }}</p>
                      </div>
                    </div>
    
                    <div class="form-group">
                      <label for="title">Title (optional)</label>
                      <input 
                        id="title" 
                        v-model="newImage.title" 
                        type="text"
                        placeholder="Image description"
                      />
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
                      <button 
                        type="submit" 
                        class="btn-primary" 
                        :disabled="carouselStore.isLoading || isUploading"
                        data-cursor-hover
                      >
                        <span v-if="isUploading">Uploading...</span>
                        <span v-else-if="carouselStore.isLoading">Adding...</span>
                        <span v-else>Add Image</span>
                      </button>
                      <button 
                        type="button" 
                        class="btn-secondary" 
                        @click="closeAddModal"
                        data-cursor-hover
                      >
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
                      <input 
                        id="edit_image_url" 
                        v-model="selectedImage.image_url" 
                        type="url" 
                        required 
                      />
                    </div>
    
                    <div class="form-group">
                      <label for="edit_title">Title</label>
                      <input 
                        id="edit_title" 
                        v-model="selectedImage.title" 
                        type="text"
                      />
                    </div>
    
                    <div class="form-group">
                      <label for="edit_sort_order">Sort Order</label>
                      <input 
                        id="edit_sort_order" 
                        v-model.number="selectedImage.sort_order" 
                        type="number"
                      />
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
                      <button 
                        type="submit" 
                        class="btn-primary" 
                        :disabled="carouselStore.isLoading"
                        data-cursor-hover
                      >
                        {{ carouselStore.isLoading ? 'Saving...' : 'Save Changes' }}
                      </button>
                      <button 
                        type="button" 
                        class="btn-secondary" 
                        @click="closeEditModal"
                        data-cursor-hover
                      >
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
    
    <style lang="scss" scoped>
    .admin-carousel {
      min-height: 100vh;
      padding: 2rem;
    }
    
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--terminal-border);
    }
    
    .page-title {
      font-family: var(--font-display);
      font-size: 2rem;
      color: var(--terminal-accent);
    }
    
    .add-btn {
      padding: 0.75rem 1.5rem;
      background: var(--terminal-accent);
      border: 1px solid var(--terminal-accent);
      color: var(--terminal-bg);
      font-family: var(--font-mono);
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        background: transparent;
        color: var(--terminal-accent);
      }
    }
    
    .loading-state, .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      text-align: center;
    }
    
    .loader {
      width: 40px;
      height: 40px;
      border: 3px solid var(--terminal-border);
      border-top-color: var(--terminal-accent);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-bottom: 1rem;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .images-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }
    
    .image-card {
      background: var(--terminal-bg-secondary);
      border: 1px solid var(--terminal-border);
      border-radius: 8px;
      overflow: hidden;
      transition: all 0.3s ease;
      
      &.inactive {
        opacity: 0.5;
      }
      
      &:hover {
        transform: translateY(-4px);
        border-color: var(--terminal-accent);
      }
    }
    
    .image-preview {
      position: relative;
      aspect-ratio: 16/9;
      overflow: hidden;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .image-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      &:hover .image-overlay {
        opacity: 1;
      }
    }
    
    .btn-edit, .btn-delete {
      padding: 0.5rem 1rem;
      border: 1px solid var(--terminal-border);
      background: transparent;
      color: var(--terminal-text);
      font-family: var(--font-mono);
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        border-color: var(--terminal-accent);
        color: var(--terminal-accent);
      }
    }
    
    .btn-delete:hover {
      border-color: #ff4444;
      color: #ff4444;
    }
    
    .image-info {
      padding: 1rem;
    }
    
    .image-title {
      font-family: var(--font-mono);
      font-size: 1rem;
      color: var(--terminal-text);
      margin-bottom: 0.5rem;
    }
    
    .image-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.875rem;
      color: var(--terminal-text-dim);
    }
    
    .meta-status {
      padding: 0.25rem 0.75rem;
      border: 1px solid var(--terminal-border);
      background: transparent;
      color: var(--terminal-text-dim);
      font-family: var(--font-mono);
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &.active {
        border-color: var(--terminal-accent);
        color: var(--terminal-accent);
      }
      
      &:hover {
        border-color: var(--terminal-accent);
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
      max-width: 600px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
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
      
      h2 {
        font-family: var(--font-display);
        font-size: 1.5rem;
        color: var(--terminal-accent);
        margin-bottom: 1.5rem;
      }
    }
    
    .mode-tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid var(--terminal-border);
    }
    
    .mode-tab {
      padding: 0.75rem 1.5rem;
      background: transparent;
      border: none;
      border-bottom: 2px solid transparent;
      color: var(--terminal-text-dim);
      font-family: var(--font-mono);
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        color: var(--terminal-text);
      }
      
      &.active {
        color: var(--terminal-accent);
        border-bottom-color: var(--terminal-accent);
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
      
      input:not([type="checkbox"]) {
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
      
      .file-input {
        cursor: pointer;
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
    
    .image-preview-container {
      margin-top: 1rem;
      padding: 1rem;
      border: 1px solid var(--terminal-border);
      border-radius: 4px;
      text-align: center;
    }
    
    .preview-image {
      max-width: 100%;
      max-height: 200px;
      object-fit: contain;
      margin-bottom: 0.5rem;
    }
    
    .file-name {
      font-size: 0.875rem;
      color: var(--terminal-text-dim);
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
    
    .modal-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 2rem;
    }
    
    .btn-primary, .btn-secondary {
      padding: 0.75rem 1.5rem;
      border: 1px solid var(--terminal-border);
      font-family: var(--font-mono);
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.3s ease;
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
    
    .modal-enter-active, .modal-leave-active {
      transition: opacity 0.3s ease;
      
      .modal-content {
        transition: transform 0.3s ease;
      }
    }
    
    .modal-enter-from, .modal-leave-to {
      opacity: 0;
      
      .modal-content {
        transform: scale(0.9);
      }
    }
    </style>