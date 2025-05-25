// lib/api.js
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: localStorage.getItem('token')
    ? `Bearer ${localStorage.getItem('token')}`
    : '',
})

// Auth endpoints
export const signup = async (userData) => {
  const response = await fetch(`${baseUrl}/api/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(userData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to signup')
  }
  return response.json()
}

export const login = async (credentials) => {
  const response = await fetch(`${baseUrl}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to login')
  }
  return response.json()
}

// Card management endpoints
export const fetchCards = async () => {
  const response = await fetch(`${baseUrl}/api/cards`, {
    method: 'GET',
    headers: getHeaders(),
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch cards')
  }
  return response.json()
}

export const fetchCardDetail = async (cardId) => {
  const response = await fetch(`${baseUrl}/api/cards/${cardId}`, {
    method: 'GET',
    headers: getHeaders(),
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch card detail')
  }
  return response.json()
}

export const createCard = async (cardData) => {
  const response = await fetch(`${baseUrl}/api/cards`, {
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
}

export const updateCard = async (cardId, cardData) => {
  const response = await fetch(`${baseUrl}/api/cards/${cardId}`, {
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
}

export const deleteCard = async (cardId) => {
  const response = await fetch(`${baseUrl}/api/cards/${cardId}`, {
    method: 'DELETE',
    headers: getHeaders(),
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete card')
  }
  return response.json()
}

// Progress management endpoints
export const updateCardProgress = async (cardId, progressData) => {
  const response = await fetch(`${baseUrl}/api/cards/${cardId}/progress`, {
    method: 'PUT',
    headers: getHeaders(),
    credentials: 'include',
    body: JSON.stringify(progressData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update progress')
  }
  return response.json()
}

export const resetCardProgress = async (cardId) => {
  const response = await fetch(
    `${baseUrl}/api/cards/${cardId}/reset-progress`,
    {
      method: 'PUT',
      headers: getHeaders(),
      credentials: 'include',
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to reset progress')
  }
  return response.json()
}

// Individual word management
export const toggleWordLearned = async (cardId, wordId) => {
  const response = await fetch(
    `${baseUrl}/api/cards/${cardId}/words/${wordId}/toggle`,
    {
      method: 'PUT',
      headers: getHeaders(),
      credentials: 'include',
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to toggle word status')
  }
  return response.json()
}

// Statistics endpoint
export const fetchCardStats = async (cardId) => {
  const response = await fetch(`${baseUrl}/api/cards/${cardId}/stats`, {
    method: 'GET',
    headers: getHeaders(),
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch card statistics')
  }
  return response.json()
}

// Utility function to check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('token')
}

// Utility function to logout
export const logout = () => {
  localStorage.removeItem('token')
}

// Helper function to handle API errors consistently
export const handleApiError = (error) => {
  if (
    error.message.includes('Token has expired') ||
    error.message.includes('Invalid token') ||
    error.message.includes('Token is missing')
  ) {
    logout()
    window.location.href = '/login'
  }
  throw error
}
