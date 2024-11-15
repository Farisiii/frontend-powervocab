import React, { useState, useEffect } from 'react'
import LearningCard from '../components/LearningCard'
import AddCardDialog from '../components/AddCardDialog'
import { Button } from '@/components/ui/button'
import { Plus, LogOut } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { fetchCards, createCard, updateCard, deleteCard } from '../api/cards'
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'

const LearningCardsPage = () => {
  const navigate = useNavigate()
  const [cards, setCards] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFirstDialogOpen, setIsFirstDialogOpen] = useState(false)
  const [isSecondDialogOpen, setIsSecondDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [cardToDelete, setCardToDelete] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const { toast } = useToast()

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
        title: 'Success',
        description: 'Card deleted successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete card. Please try again.',
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
        learned: pair.learned || false, // Ensure learned status is preserved
      })),
      title: card.title,
      targetDays: card.targetDays,
      currentEnglish: '',
      currentIndonesian: '',
    })
    setIsFirstDialogOpen(true)
  }

  const calculateProgress = (wordPairs) => {
    if (!wordPairs || wordPairs.length === 0) return 0
    const learnedWords = wordPairs.filter((pair) => pair.learned).length
    return Math.round((learnedWords / wordPairs.length) * 100)
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
          learned: false, // New words start as unlearned
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
          description: 'Please fill in all required fields correctly.',
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
        })),
      }

      if (isEditing && newCardData.id) {
        const updatedCard = await updateCard(newCardData.id, cardData)
        setCards(
          cards.map((card) => (card.id === updatedCard.id ? updatedCard : card))
        )
      } else {
        const newCard = await createCard(cardData)
        setCards([...cards, newCard])
      }

      toast({
        title: 'Success',
        description: isEditing
          ? 'Card updated successfully'
          : 'Card created successfully',
      })

      // Reset form and close dialogs
      setIsSecondDialogOpen(false)
      setIsFirstDialogOpen(false)
      setIsEditing(false)
      setNewCardData({
        id: null,
        wordPairs: [],
        title: '',
        targetDays: '',
        currentEnglish: '',
        currentIndonesian: '',
      })
    } catch (error) {
      console.error('Error submitting card:', error)
      toast({
        title: 'Error',
        description: `Failed to ${
          isEditing ? 'update' : 'create'
        } card. Please try again.`,
        variant: 'destructive',
      })
    }
  }

  const handleEnterKeyPress = (e) => {
    if (e.key === 'Enter') {
      addWordPair()
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent-50 to-white">
      <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm shadow-sm z-20">
        <div className="px-6 mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-4">
            <div className="flex items-center justify-between w-full sm:w-auto">
              <div>
                <h1 className="text-2xl font-bold text-primary-400">
                  Kartu Pembelajaran
                </h1>
                <p className="text-base text-primary-300 mt-1">
                  {cards.length} kartu tersedia
                </p>
              </div>
              <Button
                onClick={handleLogout}
                className="sm:hidden flex items-center gap-2 bg-error-600 hover:bg-error-700 text-white"
              >
                <LogOut size={20} />
              </Button>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <AddCardDialog
                isFirstDialogOpen={isFirstDialogOpen}
                isSecondDialogOpen={isSecondDialogOpen}
                setIsFirstDialogOpen={setIsFirstDialogOpen}
                setIsSecondDialogOpen={setIsSecondDialogOpen}
                newCardData={newCardData}
                setNewCardData={setNewCardData}
                addWordPair={addWordPair}
                removeWordPair={removeWordPair}
                handleFirstDialogSubmit={handleFirstDialogSubmit}
                handleSecondDialogSubmit={handleSecondDialogSubmit}
                handleEnterKeyPress={handleEnterKeyPress}
                isEditing={isEditing}
              >
                <Button className="w-full sm:w-auto flex items-center gap-2 bg-primary-400 hover:bg-primary-500 text-white">
                  <Plus size={20} />
                  Tambah Kartu
                </Button>
              </AddCardDialog>
              <Button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2 bg-error-600 hover:bg-error-700 text-white"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 mx-auto pt-32 pb-12">
        {cards.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-primary-300 mb-4">
              Belum ada kartu pembelajaran
            </p>
            <Button
              onClick={() => setIsFirstDialogOpen(true)}
              className="bg-primary-400 hover:bg-primary-500"
            >
              Buat Kartu Pertama
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 py-8 md:py-0 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cards.map((card) => (
              <LearningCard
                key={card.id}
                card={card}
                onDelete={handleDeleteCard}
                onEdit={handleEditCard}
              />
            ))}
          </div>
        )}
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kartu Pembelajaran?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Kartu pembelajaran ini akan
              dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-[#DC2626] hover:bg-[#B91C1C]"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default LearningCardsPage
