import React, { useState, useEffect } from 'react'
import {
  Plus,
  LogOut,
  Edit2,
  Trash2,
  Book,
  Calendar,
  ArrowRight,
  Check,
  AlertCircle,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api'
const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: localStorage.getItem('token')
    ? `Bearer ${localStorage.getItem('token')}`
    : '',
})

// API Functions
const fetchCards = async () => {
  const response = await fetch(`${API_BASE_URL}/cards`, {
    method: 'GET',
    headers: getHeaders(),
    credentials: 'include',
  })
  if (!response.ok) throw new Error('Failed to fetch cards')
  return response.json()
}

const createCard = async (cardData) => {
  const response = await fetch(`${API_BASE_URL}/cards`, {
    method: 'POST',
    headers: getHeaders(),
    credentials: 'include',
    body: JSON.stringify(cardData),
  })
  if (!response.ok) throw new Error('Failed to create card')
  return response.json()
}

const updateCard = async (cardId, cardData) => {
  const response = await fetch(`${API_BASE_URL}/cards/${cardId}`, {
    method: 'PUT',
    headers: getHeaders(),
    credentials: 'include',
    body: JSON.stringify(cardData),
  })
  if (!response.ok) throw new Error('Failed to update card')
  return response.json()
}

const deleteCard = async (cardId) => {
  const response = await fetch(`${API_BASE_URL}/cards/${cardId}`, {
    method: 'DELETE',
    headers: getHeaders(),
    credentials: 'include',
  })
  if (!response.ok) throw new Error('Failed to delete card')
  return response.json()
}

// Learning Card Component
const LearningCard = ({ card, onDelete, onEdit }) => {
  const navigate = useNavigate()

  const getProgressColor = (progress) => {
    if (progress < 30) return 'bg-error-600'
    if (progress < 70) return 'bg-warning-500'
    return 'bg-success-600'
  }

  const handleCardClick = (e) => {
    if (e.target.closest('button')) return
    navigate(`/cards/${card.id}`)
  }

  return (
    <Card
      className="relative group border-accent-200 hover:border-primary-400 transition-all duration-200 hover:shadow-lg cursor-pointer h-full"
      onClick={handleCardClick}
    >
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary-400 hover:text-primary-500 hover:bg-primary-50"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(card)
            }}
          >
            <Edit2 size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-error-600 hover:text-error-700 hover:bg-error-50"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(card.id)
            }}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      <CardHeader>
        <CardTitle className="text-xl text-primary-400 pr-16 flex justify-between items-center">
          <span>{card.title}</span>
          <ArrowRight
            size={20}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-primary-300"
          />
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between mb-3">
            <span className="text-base text-primary-300">Progress</span>
            <span className="text-base font-medium text-primary-400">
              {card.progress}%
            </span>
          </div>
          <div className="w-full bg-accent-100 rounded-full h-3">
            <div
              className={`${getProgressColor(
                card.progress
              )} h-3 rounded-full transition-all duration-300`}
              style={{ width: `${card.progress}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-center gap-3 text-primary-300">
            <Book size={20} />
            <span className="text-base">{card.totalWords} kata</span>
          </div>
          <div className="flex items-center gap-3 text-primary-300">
            <Calendar size={20} />
            <span className="text-base">{card.targetDays} hari</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Add Card Dialog Component
const AddCardDialog = ({
  isFirstDialogOpen,
  isSecondDialogOpen,
  setIsFirstDialogOpen,
  setIsSecondDialogOpen,
  newCardData,
  setNewCardData,
  addWordPair,
  removeWordPair,
  toggleWordLearned,
  handleFirstDialogSubmit,
  handleSecondDialogSubmit,
  handleEnterKeyPress,
  isEditing,
  children,
}) => {
  const handleDialogOpen = () => {
    setNewCardData({
      id: null,
      wordPairs: [],
      title: '',
      targetDays: '',
      currentEnglish: '',
      currentIndonesian: '',
    })
    setIsFirstDialogOpen(true)
  }

  const hasUnsavedWords = Boolean(
    newCardData.currentEnglish || newCardData.currentIndonesian
  )

  return (
    <>
      {children && <div onClick={handleDialogOpen}>{children}</div>}

      <Dialog
        open={isFirstDialogOpen}
        onOpenChange={(open) => {
          if (!open && !isEditing) {
            setNewCardData({
              id: null,
              wordPairs: [],
              title: '',
              targetDays: '',
              currentEnglish: '',
              currentIndonesian: '',
            })
          }
          setIsFirstDialogOpen(open)
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Kata' : 'Tambah Kata Baru'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Kata dalam Bahasa Inggris"
                value={newCardData.currentEnglish}
                onChange={(e) =>
                  setNewCardData((prev) => ({
                    ...prev,
                    currentEnglish: e.target.value,
                  }))
                }
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addWordPair()
                  } else {
                    handleEnterKeyPress(e)
                  }
                }}
              />
              <Input
                placeholder="Kata dalam Bahasa Indonesia"
                value={newCardData.currentIndonesian}
                onChange={(e) =>
                  setNewCardData((prev) => ({
                    ...prev,
                    currentIndonesian: e.target.value,
                  }))
                }
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addWordPair()
                  } else {
                    handleEnterKeyPress(e)
                  }
                }}
              />
            </div>

            <Button
              onClick={addWordPair}
              className="w-full bg-secondary-600 hover:bg-secondary-700"
              disabled={
                !newCardData.currentEnglish || !newCardData.currentIndonesian
              }
            >
              Tambah Kata
            </Button>

            <div className="max-h-64 overflow-y-auto space-y-2">
              {newCardData.wordPairs?.map((pair, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg group"
                >
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <span className={pair.learned ? 'text-success-600' : ''}>
                      {pair.english}
                    </span>
                    <span className={pair.learned ? 'text-success-600' : ''}>
                      {pair.indonesian}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 ${
                        pair.learned
                          ? 'text-success-500 hover:text-success-600'
                          : 'text-primary-500 hover:text-primary-600'
                      }`}
                      onClick={() => toggleWordLearned(index)}
                    >
                      <Check
                        size={16}
                        className={pair.learned ? 'opacity-100' : 'opacity-50'}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-error-500 hover:text-error-600"
                      onClick={() => removeWordPair(index)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {hasUnsavedWords && (
              <Alert variant="warning" className="bg-warning-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Ada kata yang belum ditambahkan. Silakan klik "Tambah Kata"
                  atau hapus input terlebih dahulu.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsFirstDialogOpen(false)
                if (!isEditing) {
                  setNewCardData({
                    id: null,
                    wordPairs: [],
                    title: '',
                    targetDays: '',
                    currentEnglish: '',
                    currentIndonesian: '',
                  })
                }
              }}
            >
              Batal
            </Button>
            <Button
              disabled={!newCardData.wordPairs?.length || hasUnsavedWords}
              onClick={handleFirstDialogSubmit}
              className="bg-secondary-600 hover:bg-secondary-700"
            >
              Lanjut
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isSecondDialogOpen}
        onOpenChange={(open) => {
          setIsSecondDialogOpen(open)
          if (!open && !isEditing) {
            setNewCardData({
              id: null,
              wordPairs: [],
              title: '',
              targetDays: '',
              currentEnglish: '',
              currentIndonesian: '',
            })
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Detail Kartu' : 'Detail Kartu Baru'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Judul Kartu"
              value={newCardData.title}
              onChange={(e) =>
                setNewCardData((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
            />
            <Input
              type="number"
              placeholder="Target Hari"
              value={newCardData.targetDays}
              onChange={(e) =>
                setNewCardData((prev) => ({
                  ...prev,
                  targetDays: e.target.value,
                }))
              }
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsSecondDialogOpen(false)
                if (!isEditing) {
                  setNewCardData({
                    id: null,
                    wordPairs: [],
                    title: '',
                    targetDays: '',
                    currentEnglish: '',
                    currentIndonesian: '',
                  })
                }
              }}
            >
              Batal
            </Button>
            <Button
              onClick={handleSecondDialogSubmit}
              className="bg-secondary-600 hover:bg-secondary-700"
              disabled={!newCardData.title || !newCardData.targetDays}
            >
              {isEditing ? 'Simpan' : 'Buat Kartu'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Main Page Component
const LearningCardsPage = () => {
  const navigate = useNavigate()
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
              <Button className="bg-primary-400 hover:bg-primary-500">
                Buat Kartu Pertama
              </Button>
            </AddCardDialog>
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
