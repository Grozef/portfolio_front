import api from './api'

const WEATHER_ENDPOINT = '/weather'

export const fetchWeather = async () => {
  try {
    const response = await api.get(WEATHER_ENDPOINT)
    return response.data
  } catch (error) {
    console.error('Weather fetch error:', error)
    throw error
  }
}