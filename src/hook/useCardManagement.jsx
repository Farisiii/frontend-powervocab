// hooks/useCardManagement.js
import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { fetchCards, createCard, updateCard, deleteCard } from '@/lib/api'

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
      const loadedCards = await fetchCards()
      const cardsWithLearnedStatus = loadedCards.map((card) => ({
        ...card,
        wordPairs: card.wordPairs.map((pair) => ({
          ...pair,
          learned: false,
        })),
      }))
      setCards(cardsWithLearnedStatus)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load cards. Please try again.',
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
        ...pair,
        learned: pair.learned || false,
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
          learned: pair.learned,
        })),
      }

      if (isEditing && newCardData.id) {
        const updatedCard = await updateCard(newCardData.id, cardData)
        setCards(
          cards.map((card) => (card.id === updatedCard.id ? updatedCard : card))
        )
        toast({
          title: 'Berhasil',
          description: 'Kartu berhasil diperbarui',
          className: 'bg-success-50 border-success-200',
        })
      } else {
        const newCard = await createCard(cardData)
        setCards([...cards, newCard])
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

  return {
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
  }
}
