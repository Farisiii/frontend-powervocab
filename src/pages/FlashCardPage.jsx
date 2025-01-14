import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Check, X, RotateCw } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Progress } from '@/components/ui/progress'

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
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        setIsLoading(true)
        const token = localStorage.getItem('token')

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
    setIsAnimating(true)
    setIsFlipped(!isFlipped)
    setTimeout(() => setIsAnimating(false), 300)
  }

  const updateCardProgress = async (currentWordLearned) => {
    try {
      const token = localStorage.getItem('token')

      const updatedLearnedWords = [...learnedWords]
      if (currentWordLearned) {
        updatedLearnedWords.push(currentIndex)
      } else {
        const index = updatedLearnedWords.indexOf(currentIndex)
        if (index > -1) {
          updatedLearnedWords.splice(index, 1)
        }
      }
      setLearnedWords(updatedLearnedWords)

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
        title: 'Congratulations! 🎉',
        description: `You've completed all ${cardDetails.totalWords} words in this card!`,
      })
      setTimeout(() => navigate(`/cards/${cardId}`), 1500)
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
      setTimeout(() => navigate(`/cards/${cardId}`), 1500)
    } else {
      setIsFlipped(false)
      setCurrentIndex(currentIndex + 1)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="animate-spin text-primary-600 mb-4">
          <RotateCw className="w-8 h-8" />
        </div>
        <p className="text-primary-600 font-medium">Loading flashcards...</p>
      </div>
    )
  }

  if (wordPairs.length === 0) {
    navigate(`/cards/${cardId}`)
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(`/cards/${cardId}`)}
            className="text-primary-600 hover:text-primary-700 hover:bg-primary-50"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">Back to Cards</span>
            <span className="sm:hidden">Back</span>
          </Button>
          <div className="text-right">
            <p className="text-sm text-primary-600 font-medium">
              Word {currentIndex + 1} of {cardDetails.totalWords}
            </p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mb-8">
          <Progress value={cardDetails.progress} className="h-2" />
          <p className="mt-2 text-sm text-primary-600 text-center">
            Progress: {cardDetails.progress}% (
            {Math.round((cardDetails.progress / 100) * cardDetails.totalWords)}{' '}
            of {cardDetails.totalWords} words)
          </p>
        </div>

        {/* Flashcard Section */}
        <div className="relative w-full max-w-4xl mx-auto mb-8 aspect-[3/2]">
          <div
            className={`w-full h-full transition-transform duration-300 ${
              isAnimating ? 'scale-95' : 'scale-100'
            }`}
          >
            <Card
              className={`w-full h-full cursor-pointer transition-all duration-300 bg-white shadow-lg hover:shadow-xl relative overflow-hidden rounded-2xl
                ${isFlipped ? 'rotate-y-180' : ''}`}
              onClick={handleCardFlip}
            >
              {/* Front Side */}
              <div
                className={`absolute inset-0 w-full h-full flex items-center justify-center p-8 
                bg-gradient-to-br from-primary-50 to-primary-100 backface-hidden
                ${isFlipped ? 'invisible' : 'visible'}`}
              >
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary-600 text-center">
                  {wordPairs[currentIndex]?.english || ''}
                </p>
              </div>

              {/* Back Side */}
              <div
                className={`absolute inset-0 w-full h-full flex items-center justify-center p-8 
                bg-gradient-to-br from-purple-50 to-purple-100 backface-hidden rotate-y-180
                ${isFlipped ? 'visible' : 'invisible'}`}
              >
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-purple-600 text-center">
                  {wordPairs[currentIndex]?.indonesian || ''}
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto px-4">
          <Button
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-xl text-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            onClick={handleKnown}
          >
            <Check className="w-5 h-5" />
            <span>I Know This</span>
          </Button>
          <Button
            className="bg-rose-500 hover:bg-rose-600 text-white font-semibold py-4 rounded-xl text-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            onClick={handleUnknown}
          >
            <X className="w-5 h-5" />
            <span>Still Learning</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default FlashCardPage
