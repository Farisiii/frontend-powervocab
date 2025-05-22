import React, { useState, useCallback, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import {
  Loader2,
  Trophy,
  AlertCircle,
  RotateCcw,
  Info,
  ArrowLeft,
  PlayCircle,
  BookOpen,
  CheckCircle2,
  XCircle,
  Zap,
  Target,
  Clock,
} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import confetti from 'canvas-confetti'

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const BubbleBathGame = () => {
  const { cardId } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [wordPairs, setWordPairs] = useState([])
  const [words, setWords] = useState({ left: [], right: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [matchedPairs, setMatchedPairs] = useState([])
  const [selectedWord, setSelectedWord] = useState(null)
  const [incorrectPairs, setIncorrectPairs] = useState([])
  const [showInstructions, setShowInstructions] = useState(true)
  const [gameStats, setGameStats] = useState({
    attempts: 0,
    correctMatches: 0,
    startTime: null,
    endTime: null,
  })

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

      if (response.status === 404) {
        setError('Card not found. Please check if the card exists.')
        return
      }

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`)
      }

      const data = await response.json()
      if (!data.wordPairs || !Array.isArray(data.wordPairs)) {
        throw new Error('Invalid data format received')
      }

      // Limit to maximum 8 word pairs
      const limitedWordPairs = data.wordPairs.slice(0, 8)
      setWordPairs(limitedWordPairs)

      if (limitedWordPairs.length === 0) {
        setError('This card has no word pairs to practice with.')
        return
      }

      initializeGame(limitedWordPairs)
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
  }, [cardId, toast, navigate])

  const initializeGame = useCallback((pairs) => {
    const englishWords = pairs.map((pair, index) => ({
      id: `en-${index}`,
      text: pair.english,
      type: 'english',
      pairId: index,
    }))

    const indonesianWords = pairs.map((pair, index) => ({
      id: `id-${index}`,
      text: pair.indonesian,
      type: 'indonesian',
      pairId: index,
    }))

    setWords({
      left: shuffleArray(englishWords),
      right: shuffleArray(indonesianWords),
    })
    setMatchedPairs([])
    setIncorrectPairs([])
    setGameStarted(true)
    setSelectedWord(null)
    setGameStats({
      attempts: 0,
      correctMatches: 0,
      startTime: Date.now(),
      endTime: null,
    })
  }, [])

  useEffect(() => {
    if (cardId) {
      fetchWordPairs()
    }
  }, [cardId, fetchWordPairs])

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#56A7F5', '#12B76A', '#F99A3D'],
    })
  }

  const handleWordClick = (word) => {
    if (
      matchedPairs.includes(word.pairId) ||
      incorrectPairs.includes(word.pairId)
    ) {
      return
    }

    if (!selectedWord) {
      setSelectedWord(word)
    } else {
      if (selectedWord.id === word.id) {
        setSelectedWord(null)
        return
      }

      setGameStats((prev) => ({
        ...prev,
        attempts: prev.attempts + 1,
      }))

      if (
        selectedWord.pairId === word.pairId &&
        selectedWord.type !== word.type
      ) {
        setMatchedPairs((prev) => [...prev, word.pairId])
        setIncorrectPairs((prev) => prev.filter((id) => id !== word.pairId))
        setGameStats((prev) => ({
          ...prev,
          correctMatches: prev.correctMatches + 1,
        }))
        toast({
          title: 'Perfect Match! 🎉',
          description: 'Keep up the great work!',
          variant: 'success',
        })

        if (matchedPairs.length + 1 === wordPairs.length) {
          triggerConfetti()
          setGameStats((prev) => ({
            ...prev,
            endTime: Date.now(),
          }))
        }
      } else {
        setIncorrectPairs((prev) => [
          ...new Set([...prev, word.pairId, selectedWord.pairId]),
        ])
        toast({
          title: 'Try Again',
          description: "Keep going, you're doing great!",
          variant: 'warning',
        })
      }
      setSelectedWord(null)
    }
  }

  const resetGame = () => {
    const shuffledEnglish = shuffleArray([...words.left])
    const shuffledIndonesian = shuffleArray([...words.right])
    setWords({
      left: shuffledEnglish,
      right: shuffledIndonesian,
    })
    setMatchedPairs([])
    setIncorrectPairs([])
    setSelectedWord(null)
    setGameStats({
      attempts: 0,
      correctMatches: 0,
      startTime: Date.now(),
      endTime: null,
    })
  }

  const calculateAccuracy = () => {
    if (gameStats.attempts === 0) return 0
    return ((gameStats.correctMatches / gameStats.attempts) * 100).toFixed(1)
  }

  const calculateTimeElapsed = () => {
    if (!gameStats.startTime || !gameStats.endTime) return 0
    return ((gameStats.endTime - gameStats.startTime) / 1000).toFixed(1)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-100 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 sm:w-12 h-10 sm:h-12 animate-spin text-primary-500 mx-auto" />
          <p className="text-primary-700 font-medium text-sm sm:text-base">
            Loading your game...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-primary-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md sm:max-w-lg mx-auto bg-white shadow-soft-xl">
          <CardContent className="p-4 sm:p-6 md:p-8">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              <AlertTitle className="text-sm sm:text-base">Error</AlertTitle>
              <AlertDescription className="text-xs sm:text-sm">
                {error}
              </AlertDescription>
            </Alert>
            <div className="mt-4 sm:mt-6 flex justify-center">
              <Button
                onClick={() => navigate('/cards')}
                variant="secondary"
                className="flex items-center gap-2 text-sm sm:text-base"
              >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                Return to Cards
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isGameComplete =
    matchedPairs.length === wordPairs.length && wordPairs.length > 0

  return (
    <div className="min-h-screen w-full bg-primary-100 p-3 sm:p-4 md:p-6">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 space-y-3 sm:space-y-0">
          <Button
            onClick={handleBack}
            variant="ghost"
            className="text-primary-600 hover:text-primary-700 hover:bg-primary-200 p-2 sm:p-3"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            <span className="text-sm sm:text-base">Back to Cards</span>
          </Button>

          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-primary-700 text-center sm:text-left">
            Word Matching Game
          </h1>

          {gameStarted && (
            <Button
              onClick={resetGame}
              variant="outline"
              className="flex items-center gap-1 sm:gap-2 border-primary-300 text-primary-600 hover:bg-primary-200 text-xs sm:text-sm"
            >
              <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
              Reset
            </Button>
          )}
        </div>

        <Card className="shadow-soft-xl bg-white/95 backdrop-blur-sm">
          <CardContent className="p-3 sm:p-4 md:p-6">
            {!gameStarted ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-6 sm:space-y-8 py-6 sm:py-8 px-3 sm:px-4"
              >
                <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
                  <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-soft-lg">
                    <BookOpen className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-4 sm:mb-6 opacity-90" />
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4">
                      Welcome to Word Matching!
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90 mb-4 sm:mb-6 md:mb-8">
                      Test your vocabulary by matching English words with their
                      Indonesian translations. This game uses up to 8 word pairs
                      for optimal learning experience.
                    </p>
                    <div className="bg-white/10 p-3 sm:p-4 md:p-6 rounded-xl text-left space-y-3 sm:space-y-4">
                      <h3 className="font-semibold text-base sm:text-lg md:text-xl mb-2 sm:mb-3 flex items-center gap-2">
                        <Info className="w-4 h-4 sm:w-5 sm:h-5" />
                        How to Play
                      </h3>
                      <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm md:text-base">
                        <li className="flex items-center gap-2 sm:gap-3">
                          <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-white/20 flex items-center justify-center text-xs sm:text-sm font-semibold">
                            1
                          </div>
                          <span>Select a word from either column</span>
                        </li>
                        <li className="flex items-center gap-2 sm:gap-3">
                          <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-white/20 flex items-center justify-center text-xs sm:text-sm font-semibold">
                            2
                          </div>
                          <span>Find its matching translation</span>
                        </li>
                        <li className="flex items-center gap-2 sm:gap-3">
                          <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-white/20 flex items-center justify-center text-xs sm:text-sm font-semibold">
                            3
                          </div>
                          <span>Match all pairs to complete the game</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <Button
                    onClick={() => setGameStarted(true)}
                    className="bg-success-500 hover:bg-success-600 text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg md:text-xl rounded-full transform transition-all hover:scale-105 shadow-soft-md flex items-center gap-2 sm:gap-3"
                  >
                    <PlayCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                    Start Game
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {/* Game Stats */}
                <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm p-3 sm:p-4 rounded-xl shadow-soft-sm">
                  <div className="flex flex-wrap gap-2 sm:gap-4 justify-center sm:justify-between items-center">
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className="bg-primary-100 text-primary-700 px-3 sm:px-4 py-2 rounded-lg border border-primary-200">
                        <span className="font-semibold text-sm sm:text-base">
                          {matchedPairs.length}
                        </span>
                        <span className="text-primary-500 text-sm sm:text-base">
                          /{wordPairs.length}
                        </span>
                        <span className="ml-1 sm:ml-2 text-xs sm:text-sm">
                          Matches
                        </span>
                      </div>

                      <div className="bg-secondary-100 text-secondary-700 px-3 sm:px-4 py-2 rounded-lg border border-secondary-200">
                        <span className="font-semibold text-sm sm:text-base">
                          {calculateAccuracy()}%
                        </span>
                        <span className="ml-1 sm:ml-2 text-xs sm:text-sm">
                          Accuracy
                        </span>
                      </div>
                    </div>

                    <div className="bg-accent-100 text-accent-700 px-3 sm:px-4 py-2 rounded-lg border border-accent-200">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Target className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm">
                          {gameStats.attempts} attempts
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column Headers */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-primary-600 pl-2 flex items-center gap-2">
                    <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-primary-500"></span>
                    English Words
                  </h3>
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-secondary-600 pl-2 flex items-center gap-2">
                    <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-secondary-500"></span>
                    Indonesian Words
                  </h3>
                </div>

                {/* Word Columns */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                  {/* English Words */}
                  <div className="space-y-2 sm:space-y-3">
                    {words.left.map((word) => (
                      <motion.div
                        key={word.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`
                          w-full min-h-12 sm:min-h-14 md:min-h-16 flex items-center justify-center
                          rounded-xl cursor-pointer text-center p-2 sm:p-3 md:p-4
                          transition-all duration-300 hover:scale-102
                          shadow-soft-sm hover:shadow-soft-md
                          ${
                            matchedPairs.includes(word.pairId)
                              ? 'bg-success-100 border-2 border-success-300 text-success-700'
                              : incorrectPairs.includes(word.pairId)
                              ? 'bg-error-100 border-2 border-error-300 text-error-700'
                              : selectedWord?.id === word.id
                              ? 'ring-4 ring-primary-400 bg-primary-100 text-primary-700 border border-primary-300'
                              : 'bg-white hover:bg-primary-50 border border-primary-200 text-primary-800'
                          }
                        `}
                        onClick={() => handleWordClick(word)}
                      >
                        <div className="flex items-center gap-1 sm:gap-2">
                          {matchedPairs.includes(word.pairId) && (
                            <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-success-500 flex-shrink-0" />
                          )}
                          {incorrectPairs.includes(word.pairId) && (
                            <XCircle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-error-500 flex-shrink-0" />
                          )}
                          <span className="text-xs sm:text-sm md:text-base lg:text-lg font-medium break-words">
                            {word.text}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Indonesian Words */}
                  <div className="space-y-2 sm:space-y-3">
                    {words.right.map((word) => (
                      <motion.div
                        key={word.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`
                          w-full min-h-12 sm:min-h-14 md:min-h-16 flex items-center justify-center
                          rounded-xl cursor-pointer text-center p-2 sm:p-3 md:p-4
                          transition-all duration-300 hover:scale-102
                          shadow-soft-sm hover:shadow-soft-md
                          ${
                            matchedPairs.includes(word.pairId)
                              ? 'bg-success-100 border-2 border-success-300 text-success-700'
                              : incorrectPairs.includes(word.pairId)
                              ? 'bg-error-100 border-2 border-error-300 text-error-700'
                              : selectedWord?.id === word.id
                              ? 'ring-4 ring-secondary-400 bg-secondary-100 text-secondary-700 border border-secondary-300'
                              : 'bg-white hover:bg-secondary-50 border border-secondary-200 text-secondary-800'
                          }
                        `}
                        onClick={() => handleWordClick(word)}
                      >
                        <div className="flex items-center gap-1 sm:gap-2">
                          {matchedPairs.includes(word.pairId) && (
                            <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-success-500 flex-shrink-0" />
                          )}
                          {incorrectPairs.includes(word.pairId) && (
                            <XCircle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-error-500 flex-shrink-0" />
                          )}
                          <span className="text-xs sm:text-sm md:text-base lg:text-lg font-medium break-words">
                            {word.text}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Instructions Popup */}
                <AnimatePresence>
                  {showInstructions && (
                    <motion.div
                      initial={{ opacity: 0, y: 50, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.9 }}
                      className="fixed bottom-4 right-4 max-w-xs sm:max-w-sm z-20"
                    >
                      <Card className="bg-white/95 backdrop-blur border-primary-200 shadow-soft-lg">
                        <CardContent className="p-3 sm:p-4">
                          <div className="flex justify-between items-start mb-2 sm:mb-3">
                            <div className="flex items-center gap-1 sm:gap-2 text-primary-600">
                              <Info className="w-4 h-4 sm:w-5 sm:h-5" />
                              <h4 className="font-semibold text-sm sm:text-base">
                                Quick Tips
                              </h4>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-primary-400 hover:text-primary-600 -mt-1 -mr-2 p-1"
                              onClick={() => setShowInstructions(false)}
                            >
                              ×
                            </Button>
                          </div>
                          <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-primary-700">
                            <li className="flex items-center gap-2">
                              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-primary-400 flex-shrink-0" />
                              Click any word to select it
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-primary-400 flex-shrink-0" />
                              Find and click its matching translation
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-success-400 flex-shrink-0" />
                              Green means correct match
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-error-400 flex-shrink-0" />
                              Red means incorrect match
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Game Complete Modal */}
                {isGameComplete && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                  >
                    <Card className="w-full max-w-sm sm:max-w-md lg:max-w-lg bg-white shadow-soft-xl">
                      <CardContent className="p-4 sm:p-6 md:p-8 text-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, type: 'spring' }}
                        >
                          <Trophy className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 text-success-500 mx-auto mb-4 sm:mb-6" />
                        </motion.div>
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-success-700 mb-2 sm:mb-4">
                          Congratulations! 🎉
                        </h3>
                        <p className="text-sm sm:text-base md:text-lg text-success-600 mb-4 sm:mb-6">
                          You've successfully matched all the words!
                        </p>

                        <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
                          <div className="bg-success-50 p-3 sm:p-4 rounded-lg border border-success-200">
                            <div className="text-lg sm:text-xl md:text-2xl font-bold text-success-700">
                              {calculateAccuracy()}%
                            </div>
                            <div className="text-xs sm:text-sm text-success-600">
                              Accuracy
                            </div>
                          </div>
                          <div className="bg-success-50 p-3 sm:p-4 rounded-lg border border-success-200">
                            <div className="text-lg sm:text-xl md:text-2xl font-bold text-success-700">
                              {calculateTimeElapsed()}s
                            </div>
                            <div className="text-xs sm:text-sm text-success-600">
                              Time
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                          <Button
                            onClick={resetGame}
                            className="bg-success-500 hover:bg-success-600 text-white text-sm sm:text-base"
                          >
                            <Zap className="w-4 h-4 mr-2" />
                            Play Again
                          </Button>
                          <Button
                            onClick={handleBack}
                            variant="outline"
                            className="border-success-300 text-success-700 hover:bg-success-50 text-sm sm:text-base"
                          >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Cards
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default BubbleBathGame
