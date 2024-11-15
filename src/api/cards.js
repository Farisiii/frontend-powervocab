// api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const getHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  }
}

export const fetchCards = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/cards`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch cards')
    }

    return response.json()
  } catch (error) {
    console.error('Error fetching cards:', error)
    throw error
  }
}

export const createCard = async (cardData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cards`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(cardData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create card')
    }

    return response.json()
  } catch (error) {
    console.error('Error creating card:', error)
    throw error
  }
}

export const updateCard = async (cardId, cardData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cards/${cardId}`, {
      method: 'PUT',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(cardData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update card')
    }

    return response.json()
  } catch (error) {
    console.error('Error updating card:', error)
    throw error
  }
}

export const deleteCard = async (cardId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cards/${cardId}`, {
      method: 'DELETE',
      headers: getHeaders(),
      credentials: 'include',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete card')
    }

    return response.json()
  } catch (error) {
    console.error('Error deleting card:', error)
    throw error
  }
}

export const fetchCardDetail = async (cardId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cards/${cardId}`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch card details')
    }

    return response.json()
  } catch (error) {
    console.error('Error fetching card details:', error)
    throw error
  }
}
