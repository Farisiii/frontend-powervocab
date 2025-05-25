// hooks/useCardManagement.js
import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'

// API Configuration - Synchronized with AuthPage
const baseUrl =
  import.meta.env.VITE_API_URL || 'https://web-production-6881.up.railway.app'
const API_URL = `${baseUrl}/api`

// Unified API Helper Function - Same as AuthPage
const apiRequest = async (endpoint, options = {}) => {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  // Add authorization header if token exists - Using 'token' key like AuthPage
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config)

    // Handle different response types
    let data
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      data = await response.json()
    } else {
      data = { message: await response.text() }
    }

    if (!response.ok) {
      // Handle different error status codes
      const errorMessage =
        data.error ||
        data.message ||
        `HTTP ${response.status}: ${response.statusText}`
      throw new Error(errorMessage)
    }

    return data
  } catch (error) {
    // Network errors or JSON parsing errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server')
    }
    throw error
  }
}

// API functions using the unified apiRequest
const fetchCards = () => apiRequest('/cards')

const createCard = (cardData) =>
  apiRequest('/cards', {
    method: 'POST',
    body: JSON.stringify(cardData),
  })

const updateCard = (cardId, cardData) =>
  apiRequest(`/cards/${cardId}`, {
    method: 'PUT',
    body: JSON.stringify(cardData),
  })

const deleteCard = (cardId) =>
  apiRequest(`/cards/${cardId}`, {
    method: 'DELETE',
  })

const updateCardProgress = (cardId, wordPairs) =>
  apiRequest(`/cards/${cardId}/progress`, {
    method: 'PUT',
    body: JSON.stringify({ wordPairs }),
  })

const resetCardProgress = (cardId) =>
  apiRequest(`/cards/${cardId}/reset-progress`, {
    method: 'PUT',
  })

// New API function to save individual word learned status
const saveWordLearnedStatus = (cardId, wordId, isLearned) =>
  apiRequest(`/cards/${cardId}/words/${wordId}/learned`, {
    method: 'PUT',
    body: JSON.stringify({ isLearned }),
  })

const toggleWordLearned = (cardId, wordId) =>
  apiRequest(`/cards/${cardId}/words/${wordId}/toggle`, {
    method: 'PUT',
  })

const getCardStats = (cardId) => apiRequest(`/cards/${cardId}/stats`)

export const useCardManagement = () => {
  const { toast } = useToast()
  const [cards, setCards] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFirstDialogOpen, setIsFirstDialogOpen] = useState(false)
  const [isSecondDialogOpen, setIsSecondDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [cardToDelete, setCardToDelete] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [newCardData, setNewCardData] = useState({
    id: null,
    wordPairs: [],
    title: '',
    targetDays: '',
    currentEnglish: '',
    currentIndonesian: '',
  })

  useEffect(() => {
    loadCards()
  }, [])

  // Reset form when dialogs are closed
  useEffect(() => {
    if (!isFirstDialogOpen && !isSecondDialogOpen) {
      resetForm()
    }
  }, [isFirstDialogOpen, isSecondDialogOpen])

  const resetForm = () => {
    setIsEditing(false)
    setNewCardData({
      id: null,
      wordPairs: [],
      title: '',
      targetDays: '',
      currentEnglish: '',
      currentIndonesian: '',
    })
  }

  const loadCards = async () => {
    try {
      setIsLoading(true)

      // Check if user is authenticated
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')

      if (!token || !user) {
        // User not authenticated, redirect to login
        window.location.href = '/auth'
        return
      }

      const loadedCards = await fetchCards()

      // Transform backend data to match frontend structure
      const transformedCards = loadedCards.map((card) => ({
        ...card,
        wordPairs: card.wordPairs.map((pair) => ({
          id: pair.id,
          english: pair.english,
          indonesian: pair.indonesian,
          learned: pair.isLearned, // Backend uses 'isLearned', frontend uses 'learned'
          orderIndex: pair.orderIndex,
          studyCount: pair.studyCount,
          lastStudied: pair.lastStudied,
        })),
      }))

      setCards(transformedCards)
    } catch (error) {
      console.error('Error loading cards:', error)

      // Handle authentication errors
      if (
        error.message.includes('401') ||
        error.message.includes('Unauthorized')
      ) {
        // Token expired or invalid, redirect to login
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/auth'
        return
      }

      let errorMessage = 'Failed to load cards. Please try again.'

      if (error.message.includes('Network error')) {
        errorMessage =
          'Unable to connect to server. Please check your internet connection.'
      } else if (error.message) {
        errorMessage = error.message
      }

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCard = (id) => {
    setCardToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    try {
      await deleteCard(cardToDelete)
      setCards(cards.filter((card) => card.id !== cardToDelete))
      toast({
        title: 'Berhasil',
        description: 'Kartu berhasil dihapus',
        className: 'bg-success-50 border-success-200',
      })
    } catch (error) {
      console.error('Error deleting card:', error)

      // Handle authentication errors
      if (
        error.message.includes('401') ||
        error.message.includes('Unauthorized')
      ) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/auth'
        return
      }

      toast({
        title: 'Error',
        description: 'Gagal menghapus kartu. Silakan coba lagi.',
        variant: 'destructive',
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setCardToDelete(null)
    }
  }

  const handleEditCard = (card) => {
    setIsEditing(true)
    setNewCardData({
      id: card.id,
      wordPairs: card.wordPairs.map((pair) => ({
        id: pair.id,
        english: pair.english,
        indonesian: pair.indonesian,
        learned: pair.learned || false,
        orderIndex: pair.orderIndex,
        studyCount: pair.studyCount,
        lastStudied: pair.lastStudied,
      })),
      title: card.title,
      targetDays: card.targetDays,
      currentEnglish: '',
      currentIndonesian: '',
    })
    setIsFirstDialogOpen(true)
  }

  const openAddCardDialog = () => {
    resetForm()
    setIsFirstDialogOpen(true)
  }

  const addWordPair = () => {
    if (
      newCardData.currentEnglish.trim() &&
      newCardData.currentIndonesian.trim()
    ) {
      const updatedWordPairs = [
        ...newCardData.wordPairs,
        {
          english: newCardData.currentEnglish.trim(),
          indonesian: newCardData.currentIndonesian.trim(),
          learned: false,
        },
      ]

      setNewCardData({
        ...newCardData,
        wordPairs: updatedWordPairs,
        currentEnglish: '',
        currentIndonesian: '',
      })
    }
  }

  const removeWordPair = (index) => {
    const updatedWordPairs = newCardData.wordPairs.filter((_, i) => i !== index)
    setNewCardData({
      ...newCardData,
      wordPairs: updatedWordPairs,
    })
  }

  const toggleWordLearned = (index) => {
    const updatedWordPairs = newCardData.wordPairs.map((pair, i) =>
      i === index ? { ...pair, learned: !pair.learned } : pair
    )
    setNewCardData({
      ...newCardData,
      wordPairs: updatedWordPairs,
    })
  }

  // New function to save word learned status to backend
  const saveWordLearnedStatusToBackend = async (cardId, wordId, isLearned) => {
    try {
      const result = await saveWordLearnedStatus(cardId, wordId, isLearned)

      // Update the cards state with the new learned status
      setCards((prevCards) =>
        prevCards.map((card) => {
          if (card.id === cardId) {
            return {
              ...card,
              wordPairs: card.wordPairs.map((pair) =>
                pair.id === wordId
                  ? {
                      ...pair,
                      learned: isLearned,
                      studyCount: result.studyCount || pair.studyCount,
                      lastStudied: result.lastStudied || pair.lastStudied,
                    }
                  : pair
              ),
              // Update card progress if provided in response
              progress:
                result.cardProgress !== undefined
                  ? result.cardProgress
                  : card.progress,
              learnedWords:
                result.learnedCount !== undefined
                  ? result.learnedCount
                  : card.learnedWords,
            }
          }
          return card
        })
      )

      // Also update newCardData if we're editing this card
      if (newCardData.id === cardId) {
        setNewCardData((prevData) => ({
          ...prevData,
          wordPairs: prevData.wordPairs.map((pair) =>
            pair.id === wordId
              ? {
                  ...pair,
                  learned: isLearned,
                  studyCount: result.studyCount || pair.studyCount,
                  lastStudied: result.lastStudied || pair.lastStudied,
                }
              : pair
          ),
        }))
      }

      return result
    } catch (error) {
      console.error('Error saving word learned status:', error)

      // Handle authentication errors
      if (
        error.message.includes('401') ||
        error.message.includes('Unauthorized')
      ) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/auth'
        return
      }

      // Show user-friendly error message
      toast({
        title: 'Error',
        description: 'Gagal menyimpan status kata. Silakan coba lagi.',
        variant: 'destructive',
      })

      throw error
    }
  }

  const handleFirstDialogSubmit = () => {
    if (newCardData.wordPairs.length > 0) {
      setIsFirstDialogOpen(false)
      setIsSecondDialogOpen(true)
    }
  }

  const handleSecondDialogSubmit = async () => {
    try {
      if (
        !newCardData.title.trim() ||
        !newCardData.targetDays ||
        Number(newCardData.targetDays) <= 0
      ) {
        toast({
          title: 'Error',
          description: 'Mohon lengkapi semua field yang diperlukan.',
          variant: 'destructive',
        })
        return
      }

      const cardData = {
        title: newCardData.title.trim(),
        targetDays: Number(newCardData.targetDays),
        wordPairs: newCardData.wordPairs.map((pair) => ({
          english: pair.english.trim(),
          indonesian: pair.indonesian.trim(),
          isLearned: pair.learned, // Transform 'learned' to 'isLearned' for backend
        })),
      }

      if (isEditing && newCardData.id) {
        const updatedCard = await updateCard(newCardData.id, cardData)

        // Transform response back to frontend format
        const transformedCard = {
          ...updatedCard,
          wordPairs: updatedCard.wordPairs.map((pair) => ({
            ...pair,
            learned: pair.isLearned,
          })),
        }

        setCards(
          cards.map((card) =>
            card.id === transformedCard.id ? transformedCard : card
          )
        )
        toast({
          title: 'Berhasil',
          description: 'Kartu berhasil diperbarui',
          className: 'bg-success-50 border-success-200',
        })
      } else {
        const newCard = await createCard(cardData)

        // Transform response back to frontend format
        const transformedCard = {
          ...newCard,
          wordPairs: newCard.wordPairs.map((pair) => ({
            ...pair,
            learned: pair.isLearned,
          })),
        }

        setCards([...cards, transformedCard])
        toast({
          title: 'Berhasil',
          description: 'Kartu baru berhasil dibuat',
          className: 'bg-success-50 border-success-200',
        })
      }

      setIsSecondDialogOpen(false)
      setIsFirstDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error saving card:', error)

      // Handle authentication errors
      if (
        error.message.includes('401') ||
        error.message.includes('Unauthorized')
      ) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/auth'
        return
      }

      toast({
        title: 'Error',
        description: `Gagal ${
          isEditing ? 'memperbarui' : 'membuat'
        } kartu. Silakan coba lagi.`,
        variant: 'destructive',
      })
    }
  }

  const handleDialogClose = () => {
    setIsFirstDialogOpen(false)
    setIsSecondDialogOpen(false)
    resetForm()
  }

  const handleEnterKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addWordPair()
    }
  }

  // Additional methods for backend-specific functionality
  const updateProgress = async (cardId, wordPairs) => {
    try {
      // Transform wordPairs to backend format
      const backendWordPairs = wordPairs.map((pair) => ({
        id: pair.id,
        isLearned: pair.learned,
      }))

      const result = await updateCardProgress(cardId, backendWordPairs)

      // Update local state
      setCards(
        cards.map((card) =>
          card.id === cardId
            ? {
                ...card,
                progress: result.progress,
                learnedWords: result.learnedCount,
              }
            : card
        )
      )

      return result
    } catch (error) {
      console.error('Error updating progress:', error)

      // Handle authentication errors
      if (
        error.message.includes('401') ||
        error.message.includes('Unauthorized')
      ) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/auth'
        return
      }

      toast({
        title: 'Error',
        description: 'Failed to update progress',
        variant: 'destructive',
      })
      throw error
    }
  }

  const resetProgress = async (cardId) => {
    try {
      const result = await resetCardProgress(cardId)

      // Transform response back to frontend format
      const transformedCard = {
        ...result,
        wordPairs: result.wordPairs.map((pair) => ({
          ...pair,
          learned: pair.isLearned,
        })),
      }

      setCards(
        cards.map((card) => (card.id === cardId ? transformedCard : card))
      )

      toast({
        title: 'Berhasil',
        description: 'Progress berhasil direset',
        className: 'bg-success-50 border-success-200',
      })

      return transformedCard
    } catch (error) {
      console.error('Error resetting progress:', error)

      // Handle authentication errors
      if (
        error.message.includes('401') ||
        error.message.includes('Unauthorized')
      ) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/auth'
        return
      }

      toast({
        title: 'Error',
        description: 'Failed to reset progress',
        variant: 'destructive',
      })
      throw error
    }
  }

  const toggleSingleWord = async (cardId, wordId) => {
    try {
      const result = await toggleWordLearned(cardId, wordId)

      // Update local state
      setCards(
        cards.map((card) => {
          if (card.id === cardId) {
            return {
              ...card,
              progress: result.cardProgress,
              learnedWords: result.learnedCount,
              wordPairs: card.wordPairs.map((pair) =>
                pair.id === wordId
                  ? {
                      ...pair,
                      learned: result.isLearned,
                      studyCount: result.studyCount,
                      lastStudied: result.lastStudied,
                    }
                  : pair
              ),
            }
          }
          return card
        })
      )

      return result
    } catch (error) {
      console.error('Error toggling word status:', error)

      // Handle authentication errors
      if (
        error.message.includes('401') ||
        error.message.includes('Unauthorized')
      ) {
        localStorage.removeItem('token')
        localStorage.removeUser('user')
        window.location.href = '/auth'
        return
      }

      toast({
        title: 'Error',
        description: 'Failed to toggle word status',
        variant: 'destructive',
      })
      throw error
    }
  }

  const getStats = async (cardId) => {
    try {
      return await getCardStats(cardId)
    } catch (error) {
      console.error('Error loading card statistics:', error)

      // Handle authentication errors
      if (
        error.message.includes('401') ||
        error.message.includes('Unauthorized')
      ) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/auth'
        return
      }

      toast({
        title: 'Error',
        description: 'Failed to load card statistics',
        variant: 'destructive',
      })
      throw error
    }
  }

  // Method to logout user
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/auth'
  }

  // Method to get current user info
  const getCurrentUser = () => {
    try {
      const userString = localStorage.getItem('user')
      return userString ? JSON.parse(userString) : null
    } catch (error) {
      console.error('Error parsing user data:', error)
      return null
    }
  }

  return {
    // Original properties and methods
    cards,
    isLoading,
    isFirstDialogOpen,
    isSecondDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    newCardData,
    setNewCardData,
    cardToDelete,
    isEditing,
    setIsFirstDialogOpen,
    setIsSecondDialogOpen,
    handleDeleteCard,
    confirmDelete,
    handleEditCard,
    openAddCardDialog,
    addWordPair,
    removeWordPair,
    toggleWordLearned,
    handleFirstDialogSubmit,
    handleSecondDialogSubmit,
    handleDialogClose,
    handleEnterKeyPress,

    // Backend-specific methods
    updateProgress,
    resetProgress,
    toggleSingleWord,
    getStats,
    loadCards,

    // New method for saving word learned status
    saveWordLearnedStatus: saveWordLearnedStatusToBackend,

    // Authentication-related methods
    logout,
    getCurrentUser,
  }
}
