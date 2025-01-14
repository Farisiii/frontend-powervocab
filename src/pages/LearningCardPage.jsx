import React, { useState, useEffect } from 'react'
import {
  Plus,
  LogOut,
  Edit2,
  Trash2,
  Book,
  Calendar,
  Check,
  AlertCircle,
  ChevronRight,
  Loader2,
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

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: localStorage.getItem('token')
    ? `Bearer ${localStorage.getItem('token')}`
    : '',
})

// API functions remain the same...
const fetchCards = async () => {
  const response = await fetch(`${baseUrl}/api/cards`, {
    method: 'GET',
    headers: getHeaders(),
    credentials: 'include',
  })
  if (!response.ok) throw new Error('Failed to fetch cards')
  return response.json()
}

const createCard = async (cardData) => {
  const response = await fetch(`${baseUrl}/api/cards`, {
    method: 'POST',
    headers: getHeaders(),
    credentials: 'include',
    body: JSON.stringify(cardData),
  })
  if (!response.ok) throw new Error('Failed to create card')
  return response.json()
}

const updateCard = async (cardId, cardData) => {
  const response = await fetch(`${baseUrl}/api/cards/${cardId}`, {
    method: 'PUT',
    headers: getHeaders(),
    credentials: 'include',
    body: JSON.stringify(cardData),
  })
  if (!response.ok) throw new Error('Failed to update card')
  return response.json()
}

const deleteCard = async (cardId) => {
  const response = await fetch(`${baseUrl}/api/cards/${cardId}`, {
    method: 'DELETE',
    headers: getHeaders(),
    credentials: 'include',
  })
  if (!response.ok) throw new Error('Failed to delete card')
  return response.json()
}

const LearningCard = ({ card, onDelete, onEdit }) => {
  const navigate = useNavigate()

  const getProgressColor = (progress) => {
    if (progress < 30) return 'bg-error-500'
    if (progress < 70) return 'bg-warning-400'
    return 'bg-success-500'
  }

  const handleCardClick = (e) => {
    if (e.target.closest('button')) return
    navigate(`/cards/${card.id}`)
  }

  const handleStartLearning = (e) => {
    e.stopPropagation() // Prevent card click event
    navigate(`/cards/${card.id}`)
  }

  return (
    <Card
      className="relative overflow-hidden border border-primary-100 hover:border-primary-300 transition-all duration-300 hover:shadow-md cursor-pointer bg-white shadow-soft-sm"
      onClick={handleCardClick}
    >
      <div className="absolute top-2 right-2 flex gap-1 sm:gap-2 opacity-100 transition-all duration-300 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 sm:h-8 sm:w-8 bg-white hover:bg-primary-50 text-primary-500 hover:text-primary-600 rounded-full shadow-sm"
          onClick={(e) => {
            e.stopPropagation()
            onEdit(card)
          }}
        >
          <Edit2 size={12} className="sm:w-4 sm:h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 sm:h-8 sm:w-8 bg-white hover:bg-error-50 text-error-500 hover:text-error-600 rounded-full shadow-sm"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(card.id)
          }}
        >
          <Trash2 size={12} className="sm:w-4 sm:h-4" />
        </Button>
      </div>

      <CardHeader className="pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
        <CardTitle className="text-base sm:text-lg font-semibold text-primary-700 line-clamp-2">
          {card.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6">
        <div>
          <div className="flex justify-between mb-1 sm:mb-2">
            <span className="text-xs sm:text-sm font-medium text-primary-600">
              Progress
            </span>
            <span className="text-xs sm:text-sm font-semibold text-primary-600">
              {card.progress}%
            </span>
          </div>
          <div className="w-full h-1.5 sm:h-2 bg-primary-100 rounded-full overflow-hidden">
            <div
              className={`${getProgressColor(
                card.progress
              )} h-full rounded-full transition-all duration-500 ease-out`}
              style={{ width: `${card.progress}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-primary-50">
            <Book size={12} className="sm:w-4 sm:h-4 text-primary-400" />
            <span className="text-xs font-medium text-primary-600">
              {card.totalWords} kata
            </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-primary-50">
            <Calendar size={12} className="sm:w-4 sm:h-4 text-primary-400" />
            <span className="text-xs font-medium text-primary-600">
              {card.targetDays} hari
            </span>
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full flex items-center justify-between text-primary-500 hover:text-primary-600 hover:bg-primary-50 text-xs sm:text-sm py-1.5 sm:py-2"
          onClick={handleStartLearning}
        >
          <span>Mulai Belajar</span>
          <ChevronRight size={12} className="sm:w-4 sm:h-4" />
        </Button>
      </CardContent>
    </Card>
  )
}

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
        <DialogContent className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[95vw] sm:w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-primary-700">
              {isEditing ? 'Edit Kata' : 'Tambah Kata Baru'}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col space-y-6 flex-grow overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                placeholder="Kata Inggris"
                className="bg-white focus:ring-2 focus:ring-primary-200"
                value={newCardData.currentEnglish}
                onChange={(e) => {
                  if (e.target.value.length <= 10) {
                    setNewCardData((prev) => ({
                      ...prev,
                      currentEnglish: e.target.value,
                    }))
                  }
                }}
                onKeyPress={handleEnterKeyPress}
                maxLength={10}
              />
              <Input
                placeholder="Kata Indonesia"
                className="bg-white focus:ring-2 focus:ring-primary-200"
                value={newCardData.currentIndonesian}
                onChange={(e) => {
                  if (e.target.value.length <= 10) {
                    setNewCardData((prev) => ({
                      ...prev,
                      currentIndonesian: e.target.value,
                    }))
                  }
                }}
                onKeyPress={handleEnterKeyPress}
                maxLength={10}
              />
            </div>

            <Button
              onClick={addWordPair}
              className="w-full bg-secondary-500 hover:bg-secondary-600 text-white shadow-sm"
              disabled={
                !newCardData.currentEnglish || !newCardData.currentIndonesian
              }
            >
              <Plus size={18} className="mr-2" />
              Tambah Kata
            </Button>

            <div className="flex-grow overflow-hidden">
              <div className="h-[280px] overflow-y-auto space-y-2 rounded-lg pr-2">
                {newCardData.wordPairs?.map((pair, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-accent-50/50 backdrop-blur-sm rounded-lg group hover:bg-accent-100/50 transition-colors duration-200"
                  >
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <span
                        className={`font-medium ${
                          pair.learned ? 'text-success-600' : 'text-primary-600'
                        }`}
                      >
                        {pair.english}
                      </span>
                      <span
                        className={`font-medium ${
                          pair.learned ? 'text-success-600' : 'text-primary-600'
                        }`}
                      >
                        {pair.indonesian}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 rounded-full ${
                          pair.learned
                            ? 'text-success-500 hover:text-success-600 hover:bg-success-50'
                            : 'text-primary-400 hover:text-primary-500 hover:bg-primary-50'
                        }`}
                        onClick={() => toggleWordLearned(index)}
                      >
                        <Check
                          size={16}
                          className={
                            pair.learned ? 'opacity-100' : 'opacity-50'
                          }
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full text-error-400 hover:text-error-500 hover:bg-error-50"
                        onClick={() => removeWordPair(index)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {hasUnsavedWords && (
              <Alert
                variant="warning"
                className="bg-warning-50 border-warning-200"
              >
                <AlertCircle className="h-4 w-4 text-warning-500" />
                <AlertDescription className="text-warning-700">
                  Ada kata yang belum ditambahkan. Silakan klik "Tambah Kata"
                  atau hapus input terlebih dahulu.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0 mt-6">
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
              className="w-full sm:w-auto"
            >
              Batal
            </Button>
            <Button
              disabled={!newCardData.wordPairs?.length || hasUnsavedWords}
              onClick={handleFirstDialogSubmit}
              className="w-full sm:w-auto bg-secondary-500 hover:bg-secondary-600 text-white"
            >
              Lanjut
              <ChevronRight size={16} className="ml-2" />
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
        <DialogContent className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[95vw] sm:w-[440px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-primary-700">
              {isEditing ? 'Edit Detail Kartu' : 'Detail Kartu Baru'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-700">
                Judul Kartu
              </label>
              <Input
                placeholder="Masukkan judul kartu"
                className="bg-white focus:ring-2 focus:ring-primary-200"
                value={newCardData.title}
                onChange={(e) => {
                  if (e.target.value.length <= 15) {
                    setNewCardData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                }}
                maxLength={15}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-700">
                Target Hari
              </label>
              <Input
                type="number"
                placeholder="Masukkan target hari"
                className="bg-white focus:ring-2 focus:ring-primary-200"
                value={newCardData.targetDays}
                onChange={(e) =>
                  setNewCardData((prev) => ({
                    ...prev,
                    targetDays: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
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
              className="w-full sm:w-auto"
            >
              Batal
            </Button>
            <Button
              onClick={handleSecondDialogSubmit}
              className="w-full sm:w-auto bg-secondary-500 hover:bg-secondary-600 text-white"
              disabled={!newCardData.title || !newCardData.targetDays}
            >
              {isEditing ? 'Simpan Perubahan' : 'Buat Kartu'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

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
      toast({
        title: 'Error',
        description: `Gagal ${
          isEditing ? 'memperbarui' : 'membuat'
        } kartu. Silakan coba lagi.`,
        variant: 'destructive',
      })
    }
  }

  const handleEnterKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-accent-50 to-white px-4">
        <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-primary-500 animate-spin" />
        <p className="mt-3 sm:mt-4 text-sm sm:text-base text-primary-600">
          Loading...
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50/50 via-white to-secondary-50/50">
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 sm:py-4">
            <div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                Kartu Pembelajaran
              </h1>
              <p className="text-xs sm:text-base text-primary-500 mt-0.5">
                {cards.length} kartu tersedia
              </p>
            </div>

            <div className="flex items-center gap-2">
              <AddCardDialog
                isFirstDialogOpen={isFirstDialogOpen}
                isSecondDialogOpen={isSecondDialogOpen}
                setIsFirstDialogOpen={setIsFirstDialogOpen}
                setIsSecondDialogOpen={setIsSecondDialogOpen}
                newCardData={newCardData}
                setNewCardData={setNewCardData}
                addWordPair={addWordPair}
                removeWordPair={removeWordPair}
                toggleWordLearned={toggleWordLearned}
                handleFirstDialogSubmit={handleFirstDialogSubmit}
                handleSecondDialogSubmit={handleSecondDialogSubmit}
                handleEnterKeyPress={handleEnterKeyPress}
                isEditing={isEditing}
              >
                <Button className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white shadow-sm text-xs sm:text-base py-1.5 px-3 sm:px-4">
                  <Plus size={14} className="sm:mr-2 md:block hidden" />
                  <span className="hidden sm:inline">Tambah Kartu</span>
                  <span className="sm:hidden">Tambah</span>
                </Button>
              </AddCardDialog>

              <Button
                onClick={handleLogout}
                className="flex items-center gap-1 sm:gap-2 bg-error-500 hover:bg-error-600 text-white shadow-sm text-xs sm:text-base py-1.5 px-3 sm:px-4"
              >
                <LogOut size={14} className="sm:size-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-8 sm:pb-12">
        {cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 sm:py-12 px-3 sm:px-4 text-center">
            <div className="w-full max-w-md">
              <div className="rounded-xl sm:rounded-2xl bg-white shadow-sm border border-primary-100">
                <div className="p-4 sm:p-8">
                  <p className="text-sm sm:text-lg text-primary-600 mb-3 sm:mb-6">
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
                    toggleWordLearned={toggleWordLearned}
                    handleFirstDialogSubmit={handleFirstDialogSubmit}
                    handleSecondDialogSubmit={handleSecondDialogSubmit}
                    handleEnterKeyPress={handleEnterKeyPress}
                    isEditing={isEditing}
                  >
                    <Button className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white shadow-sm text-xs sm:text-base py-1.5 sm:py-2">
                      <Plus size={14} className="mr-1 sm:mr-2" />
                      Buat Kartu Pertama
                    </Button>
                  </AddCardDialog>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
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
      </main>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[95vw] sm:w-[440px] max-w-lg m-0">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base sm:text-xl font-semibold text-primary-700">
              Hapus Kartu Pembelajaran?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs sm:text-base text-primary-500">
              Tindakan ini tidak dapat dibatalkan. Kartu pembelajaran ini akan
              dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="w-full sm:w-auto text-xs sm:text-base py-1.5 sm:py-2">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="w-full sm:w-auto bg-error-500 hover:bg-error-600 text-white text-xs sm:text-base py-1.5 sm:py-2"
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
