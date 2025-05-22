import React, { useState, useCallback, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import {
  Loader2,
  Trophy,
  AlertCircle,
  RotateCcw,
  ArrowLeftRight,
  ArrowLeft,
  Globe,
} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const TranslationGame = () => {
  const { cardId } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [wordPairs, setWordPairs] = useState([])
  const [currentPairIndex, setCurrentPairIndex] = useState(0)
  const [options, setOptions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [score, setScore] = useState(0)
  const [gameMode, setGameMode] = useState('en-to-id')
  const [selectedOption, setSelectedOption] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)
  const [gameComplete, setGameComplete] = useState(false)

  const handleBack = () => {
    navigate(-1)
  }

  const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const fetchWordPairs = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const token = localStorage.getItem('token')

      if (!token) {
        navigate('/login')
        return
      }

      const response = await fetch(`${baseUrl}/api/cards/${cardId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`)
      }

      const data = await response.json()
      if (!data.wordPairs || !Array.isArray(data.wordPairs)) {
        throw new Error('Invalid data format received')
      }

      setWordPairs(shuffleArray(data.wordPairs))
      generateOptions(0, data.wordPairs, gameMode)
    } catch (error) {
      console.error('Fetch error:', error)
      setError(error.message || 'Failed to load word pairs')
      toast({
        title: 'Error',
        description: 'Failed to load word pairs. Please try again later.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [cardId, navigate, toast, gameMode])

  const generateOptions = (index, pairs, mode) => {
    if (!pairs.length) return

    const correctPair = pairs[index]
    const otherPairs = pairs.filter((_, i) => i !== index)
    const randomPairs = shuffleArray(otherPairs).slice(0, 3)

    const allOptions = shuffleArray([correctPair, ...randomPairs])

    setOptions(
      allOptions.map((pair) => ({
        text: mode === 'en-to-id' ? pair.indonesian : pair.english,
        isCorrect: pair === correctPair,
      }))
    )
  }

  useEffect(() => {
    if (cardId) {
      fetchWordPairs()
    }
  }, [cardId, fetchWordPairs])

  const handleOptionSelect = (option, index) => {
    setSelectedOption(index)
    const isCorrectAnswer = option.isCorrect
    setIsCorrect(isCorrectAnswer)

    if (isCorrectAnswer) {
      setScore((prev) => prev + 1)
      toast({
        title: 'Correct! 🎉',
        description: 'Great job!',
        variant: 'success',
      })
    } else {
      toast({
        title: 'Not quite right',
        description: 'Try again!',
        variant: 'warning',
      })
    }

    setTimeout(() => {
      if (currentPairIndex < wordPairs.length - 1) {
        setCurrentPairIndex((prev) => prev + 1)
        setSelectedOption(null)
        setIsCorrect(null)
        generateOptions(currentPairIndex + 1, wordPairs, gameMode)
      } else {
        setGameComplete(true)
      }
    }, 1500)
  }

  const toggleGameMode = () => {
    const newMode = gameMode === 'en-to-id' ? 'id-to-en' : 'en-to-id'
    setGameMode(newMode)
    generateOptions(currentPairIndex, wordPairs, newMode)
    setSelectedOption(null)
    setIsCorrect(null)
  }

  const resetGame = () => {
    setWordPairs(shuffleArray([...wordPairs]))
    setCurrentPairIndex(0)
    setScore(0)
    setSelectedOption(null)
    setIsCorrect(null)
    setGameComplete(false)
    generateOptions(0, wordPairs, gameMode)
  }

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-primary-100 flex justify-center items-center overflow-hidden">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
          <p className="text-base text-primary-700 font-medium">
            Loading game...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen w-screen bg-primary-100 p-4 flex items-center justify-center overflow-hidden">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Game</AlertTitle>
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary-100 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* Back Button - Fixed to match GameModePage */}
        <div className="flex justify-start">
          <Button
            variant="ghost"
            onClick={() => navigate(`/cards/${cardId}/games`)}
            className="text-primary-600 hover:text-primary-700 hover:bg-primary-200 transition-all duration-200 p-2 sm:p-3"
          >
            <ArrowLeft className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            <span className="font-medium text-sm sm:text-base">
              Back to Games
            </span>
          </Button>
        </div>

        {/* Main Game Content */}
        <Card className="bg-white/90 backdrop-blur-sm border-primary-200/50 shadow-lg">
          {/* Card Header */}
          <CardHeader className="px-4 py-3 sm:px-6 sm:py-4 border-b border-primary-200/40">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-primary-800 flex items-center gap-2">
                <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
                Translation Game
              </CardTitle>
              <div className="flex items-center gap-1 text-sm sm:text-base font-semibold">
                <span className="text-primary-700">Score:</span>
                <span className="text-primary-800">
                  {score}/{wordPairs.length}
                </span>
              </div>
            </div>
          </CardHeader>

          {/* Card Content */}
          <CardContent className="p-4 sm:p-6">
            {/* Game Controls */}
            <div className="flex flex-col xs:flex-row justify-end gap-2 mb-4 sm:mb-6">
              <Button
                onClick={toggleGameMode}
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5 bg-white text-primary-700 hover:bg-primary-50 border-primary-300 text-xs sm:text-sm"
              >
                <ArrowLeftRight className="w-3 h-3 sm:w-4 sm:h-4" />
                {gameMode === 'en-to-id' ? 'ID → EN' : 'EN → ID'}
              </Button>
              <Button
                onClick={resetGame}
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5 bg-white text-secondary-700 hover:bg-secondary-50 border-secondary-300 text-xs sm:text-sm"
              >
                <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
                Reset
              </Button>
            </div>

            {!gameComplete ? (
              <div className="space-y-4 sm:space-y-6">
                {/* Word Display */}
                <div className="text-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl border border-primary-200/30">
                  <h2 className="text-sm sm:text-base font-medium text-primary-700 mb-2 sm:mb-3">
                    {gameMode === 'en-to-id'
                      ? 'Translate to Indonesian:'
                      : 'Translate to English:'}
                  </h2>
                  <p className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-primary-800 font-display leading-tight">
                    {gameMode === 'en-to-id'
                      ? wordPairs[currentPairIndex]?.english
                      : wordPairs[currentPairIndex]?.indonesian}
                  </p>
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {options.map((option, index) => (
                    <Button
                      key={index}
                      onClick={() => handleOptionSelect(option, index)}
                      disabled={selectedOption !== null}
                      className={`min-h-16 sm:min-h-20 text-sm sm:text-base lg:text-lg p-3 sm:p-4 rounded-lg transition-all duration-200 ${
                        selectedOption === index
                          ? option.isCorrect
                            ? 'bg-success-500 hover:bg-success-500 text-white border-success-600'
                            : 'bg-error-500 hover:bg-error-500 text-white border-error-600'
                          : 'bg-white hover:bg-primary-50 text-primary-800 border-2 border-primary-200 hover:border-primary-300 shadow-sm hover:shadow-md'
                      }`}
                    >
                      <span className="leading-tight break-words">
                        {option.text}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              // Game Complete Screen
              <div className="flex flex-col items-center justify-center text-center space-y-4 sm:space-y-6 py-8 sm:py-12">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-warning-100 rounded-full animate-ping-slow opacity-75" />
                  </div>
                  <Trophy className="w-20 h-20 sm:w-24 sm:h-24 text-warning-500 mx-auto relative animate-bounce-slow" />
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-800">
                    Game Complete!
                  </h2>
                  <p className="text-lg sm:text-xl lg:text-2xl text-primary-700 font-semibold">
                    Final Score: {score}/{wordPairs.length}
                  </p>
                  <div className="pt-2 sm:pt-4">
                    <Button
                      onClick={resetGame}
                      className="bg-primary-600 hover:bg-primary-700 text-white text-sm sm:text-base px-6 sm:px-8 py-2 sm:py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      Play Again
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default TranslationGame
