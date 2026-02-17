/**
 * Store Pinia pour les livres.
 * @module stores/books
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { booksService } from '@/services/books'

export const useBooksStore = defineStore('books', () => {
  const books = ref([])
  const featuredBooks = ref([])
  const selectedBook = ref(null)
  const stats = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const activeFilter = ref('all')

  const filteredBooks = computed(() => {
    if (activeFilter.value === 'all') return books.value
    return books.value.filter(book => book.status === activeFilter.value)
  })

  const fetchBooks = async (params = {}) => {
    isLoading.value = true
    error.value = null
    try {
    const result = await booksService.getBooks(params)
    books.value = result.data      //  Les livres
    pagination.value = result.meta  //  Les métadonnées
    } catch (e) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  const fetchStats = async () => {
    try {
      stats.value = await booksService.getStats()
    } catch (e) {
      console.error('Failed to fetch stats:', e)
    }
  }

  const createBook = async (data) => {
    isLoading.value = true
    error.value = null
    try {
      const book = await booksService.createBook(data)
      books.value.push(book)
      return book
    } catch (e) {
      error.value = e.response?.data?.message || 'Failed to create book'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const updateBook = async (id, data) => {
    isLoading.value = true
    error.value = null
    try {
      const book = await booksService.updateBook(id, data)
      const index = books.value.findIndex(b => b.id === id)
      if (index !== -1) books.value[index] = book
      return book
    } catch (e) {
      error.value = e.response?.data?.message || 'Failed to update book'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const deleteBook = async (id) => {
    isLoading.value = true
    error.value = null
    try {
      await booksService.deleteBook(id)
      books.value = books.value.filter(b => b.id !== id)
    } catch (e) {
      error.value = e.response?.data?.message || 'Failed to delete book'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const refreshBookCache = async (id) => {
    try {
      const book = await booksService.refreshBookCache(id)
      const index = books.value.findIndex(b => b.id === id)
      if (index !== -1) books.value[index] = book
      if (selectedBook.value?.id === id) selectedBook.value = book
      return book
    } catch (e) {
      throw e
    }
  }

  const setFilter = (filter) => { activeFilter.value = filter }
  const clearSelectedBook = () => { selectedBook.value = null }
  const clearError = () => { error.value = null }

  return {
    books, featuredBooks, selectedBook, stats, isLoading, error, activeFilter,
    filteredBooks,
    fetchBooks, fetchStats, createBook, updateBook, deleteBook, refreshBookCache,
    setFilter, clearSelectedBook, clearError
  }
})
