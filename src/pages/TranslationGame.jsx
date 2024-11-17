import React, { useState, useCallback, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import {
  Loader2,
  Trophy,
  AlertCircle,
  RotateCcw,
  ArrowLeftRight,
  ArrowLeft,
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

    // Move to next word after a delay
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
      <div className="flex justify-center items-center min-h-[600px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-accent-100 to-accent-50">
      <div className="w-full md:w-[90%] lg:w-[80%] xl:w-[70%] mx-auto p-2 md:p-4">
        <Button
          onClick={handleBack}
          variant="ghost"
          className="mb-4 flex items-center gap-2 text-primary-600 hover:text-primary-700 text-xl"
        >
          <ArrowLeft className="w-8 h-8" />
          Back
        </Button>

        <Card className="shadow-lg">
          <CardContent className="p-4 md:p-6 lg:p-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <div className="text-xl md:text-2xl font-semibold text-primary-400">
                Score: {score}/{wordPairs.length}
              </div>
              <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                <Button
                  onClick={toggleGameMode}
                  variant="outline"
                  className="flex items-center gap-2 bg-primary-50 text-primary-600 hover:bg-primary-100"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  Switch to{' '}
                  {gameMode === 'en-to-id'
                    ? 'Indonesian to English'
                    : 'English to Indonesian'}
                </Button>
                <Button
                  onClick={resetGame}
                  variant="outline"
                  className="flex items-center gap-2 bg-secondary-50 text-secondary-600 hover:bg-secondary-100"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
              </div>
            </div>

            {!gameComplete ? (
              <div className="space-y-8">
                <div className="text-center p-6 md:p-8 lg:p-10 bg-primary-50 rounded-xl shadow-md">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-primary-600">
                    {gameMode === 'en-to-id'
                      ? 'Translate to Indonesian:'
                      : 'Translate to English:'}
                  </h2>
                  <p className="text-4xl md:text-5xl lg:text-6xl font-semibold text-primary-400">
                    {gameMode === 'en-to-id'
                      ? wordPairs[currentPairIndex]?.english
                      : wordPairs[currentPairIndex]?.indonesian}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {options.map((option, index) => (
                    <Button
                      key={index}
                      onClick={() => handleOptionSelect(option, index)}
                      disabled={selectedOption !== null}
                      className={`min-h-[100px] md:min-h-[120px] text-xl md:text-2xl lg:text-3xl p-4 md:p-6 rounded-xl transition-all transform hover:scale-102 ${
                        selectedOption === index
                          ? option.isCorrect
                            ? 'bg-success-500 hover:bg-success-600 text-white'
                            : 'bg-error-500 hover:bg-error-600 text-white'
                          : 'bg-primary-300 hover:bg-primary-400 text-white shadow-md hover:shadow-lg'
                      }`}
                    >
                      {option.text}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6 py-8 md:py-10">
                <Trophy className="w-24 md:w-32 h-24 md:h-32 text-warning-400 mx-auto" />
                <h2 className="text-3xl md:text-4xl font-bold text-primary-600">
                  Game Complete!
                </h2>
                <p className="text-xl md:text-2xl text-primary-400">
                  Final Score: {score}/{wordPairs.length}
                </p>
                <Button
                  onClick={resetGame}
                  className="mt-6 md:mt-8 bg-primary-400 hover:bg-primary-500 text-white text-lg md:text-xl px-8 md:px-12 py-4 md:py-6"
                >
                  Play Again
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default TranslationGame
