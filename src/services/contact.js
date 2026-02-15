import api from './api'

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