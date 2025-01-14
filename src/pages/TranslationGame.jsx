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
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary-500" />
          <p className="text-lg text-primary-600 font-medium">
            Loading game...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 p-4 flex items-center justify-center">
        <Alert variant="destructive" className="max-w-lg mx-auto">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Error Loading Game</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50 to-secondary-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Container for Back Button */}
        <div className="flex justify-start">
          <Button
            onClick={handleBack}
            variant="ghost"
            className="text-primary-600 hover:text-primary-700 hover:bg-primary-100"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Cards
          </Button>
        </div>

        {/* Main Game Card */}
        <Card className="backdrop-blur-md bg-white/80 border-0 shadow-soft-xl">
          <CardHeader className="p-6 border-b border-primary-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-600 flex items-center gap-3">
                <Globe className="w-8 h-8 text-primary-400" />
                Translation Game
              </CardTitle>
              <div className="flex items-center gap-2 text-lg font-semibold text-primary-500">
                Score: {score}/{wordPairs.length}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 lg:p-8">
            {/* Game Controls */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 mb-8">
              <Button
                onClick={toggleGameMode}
                variant="outline"
                className="flex items-center gap-2 bg-white text-primary-600 hover:bg-primary-50 border-primary-200"
              >
                <ArrowLeftRight className="w-4 h-4" />
                {gameMode === 'en-to-id'
                  ? 'Switch to Indonesian'
                  : 'Switch to English'}
              </Button>
              <Button
                onClick={resetGame}
                variant="outline"
                className="flex items-center gap-2 bg-white text-secondary-600 hover:bg-secondary-50 border-secondary-200"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Game
              </Button>
            </div>

            {!gameComplete ? (
              <div className="space-y-8">
                {/* Word Display */}
                <div className="text-center p-8 lg:p-12 bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl shadow-soft-md">
                  <h2 className="text-xl sm:text-2xl font-medium text-primary-600 mb-4">
                    {gameMode === 'en-to-id'
                      ? 'Translate to Indonesian:'
                      : 'Translate to English:'}
                  </h2>
                  <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-700 font-display">
                    {gameMode === 'en-to-id'
                      ? wordPairs[currentPairIndex]?.english
                      : wordPairs[currentPairIndex]?.indonesian}
                  </p>
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {options.map((option, index) => (
                    <Button
                      key={index}
                      onClick={() => handleOptionSelect(option, index)}
                      disabled={selectedOption !== null}
                      className={`min-h-[80px] sm:min-h-[100px] text-lg sm:text-xl lg:text-2xl p-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 ${
                        selectedOption === index
                          ? option.isCorrect
                            ? 'bg-success-500 hover:bg-success-600 text-white shadow-success-200/50'
                            : 'bg-error-500 hover:bg-error-600 text-white shadow-error-200/50'
                          : 'bg-white hover:bg-primary-50 text-primary-700 border-2 border-primary-200 shadow-soft-md hover:shadow-soft-lg'
                      }`}
                    >
                      {option.text}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              // Game Complete Screen
              <div className="text-center space-y-8 py-12">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 bg-warning-100 rounded-full animate-ping-slow opacity-75" />
                  </div>
                  <Trophy className="w-32 h-32 text-warning-400 mx-auto relative animate-bounce-slow" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-4xl font-bold text-primary-600">
                    Game Complete!
                  </h2>
                  <p className="text-2xl text-primary-500">
                    Final Score: {score}/{wordPairs.length}
                  </p>
                  <Button
                    onClick={resetGame}
                    className="mt-8 bg-primary-500 hover:bg-primary-600 text-white text-xl px-12 py-6 rounded-xl shadow-soft-lg hover:shadow-soft-xl transition-all duration-300"
                  >
                    Play Again
                  </Button>
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
