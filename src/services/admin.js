import api from './api'

export const getMessages = async () => {
  try {
    const response = await api.get('/messages')
    return response.data
  } catch (error) {
    console.error('Failed to fetch messages:', error)
    throw error
  }
}

export const markMessageAsRead = async (messageId) => {
  try {
    const response = await api.patch(`/messages/${messageId}/read`)
    return response.data
  } catch (error) {
    console.error('Failed to mark message as read:', error)
    throw error
  }
}

export const deleteMessage = async (messageId) => {
  try {
    const response = await api.delete(`/messages/${messageId}`)
    return response.data
  } catch (error) {
    console.error('Failed to delete message:', error)
    throw error
  }
}