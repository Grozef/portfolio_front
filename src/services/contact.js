import api from './api'

/**
 * Submit contact form
 * @param {Object} formData - Contact form data
 * @returns {Promise} API response
 */
export const submitContactForm = async (formData) => {
  try {
    const response = await api.post('/contact', formData)
    return {
      success: true,
      message: 'Message sent successfully',
      data: response.data
    }
  } catch (error) {
    console.error('Contact form submission error:', error)
    
    if (error.response) {
      return {
        success: false,
        message: error.response.data.message || 'Failed to send message',
        errors: error.response.data.errors || {}
      }
    }
    
    return {
      success: false,
      message: 'Network error. Please try again later.'
    }
  }
}

/**
 * Get contact messages (admin only)
 * @returns {Promise} List of messages
 */
export const getMessages = async () => {
  try {
    const response = await api.get('/messages')
    return response.data
  } catch (error) {
    console.error('Failed to fetch messages:', error)
    throw error
  }
}

/**
 * Mark message as read
 * @param {number} messageId - Message ID
 * @returns {Promise} API response
 */
export const markMessageAsRead = async (messageId) => {
  try {
    const response = await api.patch(`/messages/${messageId}/read`)
    return response.data
  } catch (error) {
    console.error('Failed to mark message as read:', error)
    throw error
  }
}

/**
 * Delete message
 * @param {number} messageId - Message ID
 * @returns {Promise} API response
 */
export const deleteMessage = async (messageId) => {
  try {
    const response = await api.delete(`/messages/${messageId}`)
    return response.data
  } catch (error) {
    console.error('Failed to delete message:', error)
    throw error
  }
}