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
      <div className="flex justify-center items-center min-h-screen bg-primary-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-primary-700 text-lg font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  if (wordPairs.length === 0) {
    navigate(`/cards/${cardId}`)
    return null
  }

  return (
    <div className="h-screen bg-primary-100 flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col px-3 py-2 sm:px-6 sm:py-3 lg:px-12 lg:py-4 xl:px-20 xl:py-6 2xl:px-32 2xl:py-8">
        {/* Header Section - Compact but readable */}
        <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4 flex-shrink-0">
          <Button
            variant="ghost"
            onClick={() => navigate(`/cards/${cardId}`)}
            className="text-primary-700 hover:text-primary-800 hover:bg-primary-200 px-3 py-2 lg:px-4 lg:py-3 xl:px-6 xl:py-4"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 mr-2" />
            <span className="text-sm lg:text-base xl:text-lg font-medium">
              Back
            </span>
          </Button>
          <div className="text-right">
            <p className="text-sm lg:text-base xl:text-lg text-primary-700 font-medium">
              {currentIndex + 1} / {cardDetails.totalWords}
            </p>
          </div>
        </div>

        {/* Progress Section - Compact */}
        <div className="mb-3 sm:mb-4 lg:mb-6 flex-shrink-0 max-w-4xl mx-auto w-full">
          <Progress
            value={cardDetails.progress}
            className="h-2 lg:h-3 xl:h-4 bg-primary-200"
          />
          <p className="mt-2 lg:mt-3 text-sm lg:text-base xl:text-lg text-primary-700 text-center font-medium">
            Progress: {cardDetails.progress}% (
            {Math.round((cardDetails.progress / 100) * cardDetails.totalWords)}{' '}
            of {cardDetails.totalWords})
          </p>
        </div>

        {/* Flashcard Section - Maximum space utilization */}
        <div className="flex-1 flex items-center justify-center mb-3 sm:mb-4 lg:mb-6 min-h-0">
          <div className="w-full max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl h-full">
            <div
              className={`flip-card w-full h-full transition-transform duration-300 ${
                isAnimating ? 'scale-95' : 'scale-100'
              }`}
              style={{
                aspectRatio: '16/10',
                minHeight: '280px',
                maxHeight: 'calc(100vh - 200px)',
                perspective: '1000px',
              }}
            >
              <div
                className={`flip-card-inner w-full h-full relative transition-transform duration-600 ${
                  isFlipped ? 'flipped' : ''
                }`}
                onClick={handleCardFlip}
              >
                {/* Front Side */}
                <Card className="flip-card-front absolute inset-0 w-full h-full cursor-pointer bg-white shadow-xl hover:shadow-2xl rounded-2xl lg:rounded-3xl xl:rounded-4xl border-2 lg:border-4 border-primary-200 hover:border-primary-300">
                  <div className="w-full h-full flex items-center justify-center p-4 sm:p-6 lg:p-8 xl:p-12 2xl:p-16 bg-gradient-to-br from-primary-50 to-secondary-100">
                    <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-primary-800 text-center leading-tight">
                      {wordPairs[currentIndex]?.english || ''}
                    </p>
                  </div>
                </Card>

                {/* Back Side */}
                <Card className="flip-card-back absolute inset-0 w-full h-full cursor-pointer bg-white shadow-xl hover:shadow-2xl rounded-2xl lg:rounded-3xl xl:rounded-4xl border-2 lg:border-4 border-accent-200 hover:border-accent-300">
                  <div className="w-full h-full flex items-center justify-center p-4 sm:p-6 lg:p-8 xl:p-12 2xl:p-16 bg-gradient-to-br from-accent-50 to-accent-100">
                    <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-accent-800 text-center leading-tight">
                      {wordPairs[currentIndex]?.indonesian || ''}
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Larger and more prominent */}
        <div className="grid grid-cols-2 gap-4 lg:gap-6 xl:gap-8 max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto w-full flex-shrink-0 pb-2 sm:pb-4">
          <Button
            className="bg-success-500 hover:bg-success-600 text-white font-bold py-4 lg:py-6 xl:py-8 rounded-xl lg:rounded-2xl xl:rounded-3xl text-base lg:text-lg xl:text-xl 2xl:text-2xl transition-all duration-200 flex items-center justify-center gap-2 lg:gap-3 xl:gap-4 shadow-lg hover:shadow-xl border-2 lg:border-4 border-success-600 hover:border-success-700 min-h-14 lg:min-h-16 xl:min-h-20 2xl:min-h-24"
            onClick={handleKnown}
          >
            <Check className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8" />
            <span>I Know This</span>
          </Button>
          <Button
            className="bg-error-500 hover:bg-error-600 text-white font-bold py-4 lg:py-6 xl:py-8 rounded-xl lg:rounded-2xl xl:rounded-3xl text-base lg:text-lg xl:text-xl 2xl:text-2xl transition-all duration-200 flex items-center justify-center gap-2 lg:gap-3 xl:gap-4 shadow-lg hover:shadow-xl border-2 lg:border-4 border-error-600 hover:border-error-700 min-h-14 lg:min-h-16 xl:min-h-20 2xl:min-h-24"
            onClick={handleUnknown}
          >
            <X className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8" />
            <span>Still Learning</span>
          </Button>
        </div>
      </div>

      {/* CSS for 3D flip animation */}
      <style jsx>{`
        .flip-card {
          perspective: 1000px;
        }

        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }

        .flip-card-inner.flipped {
          transform: rotateY(180deg);
        }

        .flip-card-front,
        .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }

        .flip-card-back {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  )
}

export default FlashCardPage
