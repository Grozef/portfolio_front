/**
 * Store Pinia pour le carrousel d'images.
 * @module stores/carousel
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { carouselService } from '@/services/carousel'

export const useCarouselStore = defineStore('carousel', () => {
  const images = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  const fetchImages = async () => {
    isLoading.value = true
    error.value = null
    try {
      images.value = await carouselService.getImages()
    } catch (e) {
      error.value = e.response?.data?.message || 'Failed to fetch carousel images'
      console.error('Failed to fetch carousel images:', e)
    } finally {
      isLoading.value = false
    }
  }

  const uploadImage = async (file) => {
    isLoading.value = true
    error.value = null
    try {
      const result = await carouselService.uploadImage(file)
      return result.url
    } catch (e) {
      // Gérer les erreurs de validation Laravel
      if (e.response?.data?.errors) {
        const validationErrors = Object.values(e.response.data.errors).flat()
        error.value = validationErrors.join(', ')
      } else {
        error.value = e.response?.data?.message || 'Failed to upload image'
      }
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const createImage = async (data) => {
    isLoading.value = true
    error.value = null
    try {
      const image = await carouselService.createImage(data)
      images.value.push(image)
      return image
    } catch (e) {
      error.value = e.response?.data?.message || 'Failed to create image'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const updateImage = async (id, data) => {
    isLoading.value = true
    error.value = null
    try {
      const image = await carouselService.updateImage(id, data)
      const index = images.value.findIndex(img => img.id === id)
      if (index !== -1) images.value[index] = image
      return image
    } catch (e) {
      error.value = e.response?.data?.message || 'Failed to update image'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const deleteImage = async (id) => {
    isLoading.value = true
    error.value = null
    try {
      await carouselService.deleteImage(id)
      images.value = images.value.filter(img => img.id !== id)
    } catch (e) {
      error.value = e.response?.data?.message || 'Failed to delete image'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const reorderImages = async (order) => {
    isLoading.value = true
    error.value = null
    try {
      const reordered = await carouselService.reorderImages(order)
      images.value = reordered
      return reordered
    } catch (e) {
      error.value = e.response?.data?.message || 'Failed to reorder images'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    images,
    isLoading,
    error,
    fetchImages,
    uploadImage,
    createImage,
    updateImage,
    deleteImage,
    reorderImages,
    clearError
  }
})