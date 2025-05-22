// lib/api.js
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: localStorage.getItem('token')
    ? `Bearer ${localStorage.getItem('token')}`
    : '',
})

export const fetchCards = async () => {
  const response = await fetch(`${baseUrl}/api/cards`, {
    method: 'GET',
    headers: getHeaders(),
    credentials: 'include',
  })
  if (!response.ok) throw new Error('Failed to fetch cards')
  return response.json()
}

export const createCard = async (cardData) => {
  const response = await fetch(`${baseUrl}/api/cards`, {
    method: 'POST',
    headers: getHeaders(),
    credentials: 'include',
    body: JSON.stringify(cardData),
  })
  if (!response.ok) throw new Error('Failed to create card')
  return response.json()
}

export const updateCard = async (cardId, cardData) => {
  const response = await fetch(`${baseUrl}/api/cards/${cardId}`, {
    method: 'PUT',
    headers: getHeaders(),
    credentials: 'include',
    body: JSON.stringify(cardData),
  })
  if (!response.ok) throw new Error('Failed to update card')
  return response.json()
}

export const deleteCard = async (cardId) => {
  const response = await fetch(`${baseUrl}/api/cards/${cardId}`, {
    method: 'DELETE',
    headers: getHeaders(),
    credentials: 'include',
  })
  if (!response.ok) throw new Error('Failed to delete card')
  return response.json()
}
