import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Check, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const FlashCardPage = () => {
  const { cardId } = useParams()
  const navigate = useNavigate()
  const [wordPairs, setWordPairs] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [cardDetails, setCardDetails] = useState({
    title: '',
    totalWords: 0,
    progress: 0,
  })
  const { toast } = useToast()
  const [learnedWords, setLearnedWords] = useState([])

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        setIsLoading(true)
        const token = localStorage.getItem('token')

        // Pertama, ambil data card
        const cardResponse = await fetch(`${baseUrl}/api/cards/${cardId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })

        if (!cardResponse.ok) {
          throw new Error('Failed to fetch card data')
        }

        const cardData = await cardResponse.json()

        // Kemudian reset progress
        await fetch(`${baseUrl}/api/cards/${cardId}/reset-progress`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })

        if (!cardData.wordPairs || cardData.wordPairs.length === 0) {
          toast({
            title: 'Error',
            description: 'No word pairs found',
            variant: 'destructive',
          })
          navigate(`/cards/${cardId}`)
          return
        }

        setWordPairs(
          cardData.wordPairs.map((pair) => ({
            ...pair,
            isLearned: false,
          }))
        )

        setCardDetails({
          title: cardData.title,
          totalWords: cardData.wordPairs.length,
          progress: 0,
        })
      } catch (error) {
        console.error('Error loading data:', error)
        toast({
          title: 'Error',
          description: 'Failed to load card data',
          variant: 'destructive',
        })
        navigate(`/cards/${cardId}`)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCardData()
  }, [cardId, navigate, toast])

  useEffect(() => {
    setLearnedWords([])
  }, [cardId])

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const updateCardProgress = async (currentWordLearned) => {
    try {
      const token = localStorage.getItem('token')

      // Update learned words state
      const updatedLearnedWords = [...learnedWords]
      if (currentWordLearned) {
        updatedLearnedWords.push(currentIndex)
      } else {
        // Jika "Still Learning", hapus dari updatedLearnedWords jika ada
        const index = updatedLearnedWords.indexOf(currentIndex)
        if (index > -1) {
          updatedLearnedWords.splice(index, 1)
        }
      }
      setLearnedWords(updatedLearnedWords)

      // Buat array updatedWordPairs dengan mempertahankan status isLearned kata-kata lain
      const updatedWordPairs = wordPairs.map((pair, index) => ({
        ...pair,
        isLearned:
          index === currentIndex
            ? currentWordLearned
            : updatedLearnedWords.includes(index),
      }))

      const response = await fetch(`${baseUrl}/api/cards/${cardId}/progress`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wordPairs: updatedWordPairs }),
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to update progress')
      }

      const data = await response.json()
      setCardDetails((prev) => ({
        ...prev,
        progress: data.progress,
      }))

      toast({
        title: 'Progress Updated',
        description: `Learning progress: ${data.progress}% (${data.learnedCount} of ${data.totalCount} words)`,
      })

      return true
    } catch (error) {
      console.error('Error updating progress:', error)
      toast({
        title: 'Error',
        description: 'Failed to update progress',
        variant: 'destructive',
      })
      return false
    }
  }

  const handleKnown = async () => {
    const updated = await updateCardProgress(true)
    if (!updated) return

    if (currentIndex === wordPairs.length - 1) {
      toast({
        title: 'Congratulations!',
        description: `You've completed all ${cardDetails.totalWords} words in this card!`,
      })
      setTimeout(() => navigate(`/cards/${cardId}`), 1000) // Delay navigation
    } else {
      setIsFlipped(false)
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handleUnknown = async () => {
    const updated = await updateCardProgress(false)
    if (!updated) return

    if (currentIndex === wordPairs.length - 1) {
      toast({
        title: 'Session Complete',
        description: `You've reviewed all ${cardDetails.totalWords} words in this card!`,
      })
      setTimeout(() => navigate(`/cards/${cardId}`), 1000) // Delay navigation
    } else {
      setIsFlipped(false)
      setCurrentIndex(currentIndex + 1)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-accent-50">
        <div className="animate-pulse text-primary-400">Loading...</div>
      </div>
    )
  }

  if (wordPairs.length === 0) {
    navigate(`/cards/${cardId}`)
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-primary-50 p-4 md:p-6 lg:p-8">
      <div className="container mx-auto px-4 max-w-screen-xl">
        {/* Back button */}
        <div className="w-full flex justify-start mb-6 lg:mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(`/cards/${cardId}`)}
            className="text-primary-400 hover:text-primary-500 hover:bg-accent-200 transition-colors duration-200 text-sm md:text-base"
          >
            <ArrowLeft className="mr-2 h-4 w-4 md:h-5 md:w-5" />
            Back to Card Detail
          </Button>
        </div>

        {/* Progress section */}
        <div className="mb-8 lg:mb-12 text-center space-y-2">
          <p className="text-primary-400 font-medium text-base md:text-lg lg:text-xl">
            Word {currentIndex + 1} of {cardDetails.totalWords}
          </p>
          <div className="w-full bg-accent-200 rounded-full h-2 md:h-3 max-w-3xl mx-auto">
            <div
              className="bg-primary-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${cardDetails.progress}%` }}
            />
          </div>
          <p className="text-primary-400 text-sm md:text-base lg:text-lg">
            Progress: {cardDetails.progress}% (
            {Math.round((cardDetails.progress / 100) * cardDetails.totalWords)}{' '}
            of {cardDetails.totalWords} words)
          </p>
        </div>

        {/* Flashcard with improved responsive dimensions */}
        <div className="mx-auto mb-8 lg:mb-12 w-full max-w-4xl aspect-[3/2]">
          <Card
            className="w-full h-full cursor-pointer transition-all duration-700 perspective-1000 transform-style-preserve-3d hover:shadow-lg bg-white relative"
            onClick={handleCardFlip}
            style={{
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center backface-hidden p-6 md:p-8 lg:p-12 bg-success-100">
              <p className="text-2xl md:text-4xl lg:text-6xl font-bold text-primary-400 text-center">
                {wordPairs[currentIndex]?.english || ''}
              </p>
            </div>
            <div
              className="absolute inset-0 flex items-center justify-center backface-hidden p-6 md:p-8 lg:p-12 bg-primary-100"
              style={{ transform: 'rotateY(180deg)' }}
            >
              <p className="text-2xl md:text-4xl lg:text-6xl font-bold text-primary-400 text-center">
                {wordPairs[currentIndex]?.indonesian || ''}
              </p>
            </div>
          </Card>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto px-4">
          <Button
            className="bg-success-600 hover:bg-success-700 text-white transition-colors duration-200 py-4 md:py-5 lg:py-6 text-base md:text-lg lg:text-xl"
            onClick={handleKnown}
          >
            <Check className="mr-2 h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7" />I Know
            This
          </Button>
          <Button
            className="bg-error-600 hover:bg-error-700 text-white transition-colors duration-200 py-4 md:py-5 lg:py-6 text-base md:text-lg lg:text-xl"
            onClick={handleUnknown}
          >
            <X className="mr-2 h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7" />
            Still Learning
          </Button>
        </div>
      </div>
    </div>
  )
}

export default FlashCardPage
