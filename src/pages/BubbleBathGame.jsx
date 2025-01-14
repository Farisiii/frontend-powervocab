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

      setWordPairs(data.wordPairs)
      if (data.wordPairs.length === 0) {
        setError('This card has no word pairs to practice with.')
        return
      }

      initializeGame(data.wordPairs)
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
      <div className="flex justify-center items-center min-h-[400px] bg-gradient-to-b from-primary-50 to-primary-100 rounded-lg">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary-400 mx-auto" />
          <p className="text-primary-600 font-medium">Loading your game...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto bg-white shadow-xl">
        <CardContent className="p-8">
          <Alert variant="destructive">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="mt-6 flex justify-center">
            <Button
              onClick={() => navigate('/cards')}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Cards
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const isGameComplete =
    matchedPairs.length === wordPairs.length && wordPairs.length > 0

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-primary-50 via-accent-50 to-secondary-50 p-4">
      <div className="w-full max-w-7xl mx-auto p-2 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={handleBack}
            variant="ghost"
            className="text-primary-600 hover:text-primary-700 hover:bg-primary-100"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Cards
          </Button>

          <h1 className="text-2xl md:text-3xl font-bold text-primary-600 hidden md:block">
            Word Matching Game
          </h1>

          {gameStarted && (
            <div className="flex items-center gap-4">
              <Button
                onClick={resetGame}
                variant="outline"
                className="flex items-center gap-2 border-primary-200 text-primary-600 hover:bg-primary-100"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          )}
        </div>

        <Card className="shadow-xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-4 md:p-6">
            {!gameStarted ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-8 py-8 px-4"
              >
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="bg-gradient-to-r from-primary-400 to-primary-600 text-white p-8 rounded-2xl shadow-lg">
                    <BookOpen className="w-16 h-16 mx-auto mb-6 opacity-90" />
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                      Welcome to Word Matching!
                    </h2>
                    <p className="text-lg md:text-xl opacity-90 mb-8">
                      Test your vocabulary by matching English words with their
                      Indonesian translations.
                    </p>
                    <div className="bg-white/10 p-6 rounded-xl text-left space-y-4">
                      <h3 className="font-semibold text-xl mb-3 flex items-center gap-2">
                        <Info className="w-5 h-5" />
                        How to Play
                      </h3>
                      <ul className="space-y-3 text-base">
                        <li className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                            1
                          </div>
                          <span>Select a word from either column</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                            2
                          </div>
                          <span>Find its matching translation</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                            3
                          </div>
                          <span>Match all pairs to complete the game</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <Button
                    onClick={() => setGameStarted(true)}
                    className="bg-success-500 hover:bg-success-600 text-white px-8 py-6 text-xl rounded-full transform transition-all hover:scale-105 shadow-lg flex items-center gap-3"
                  >
                    <PlayCircle className="w-6 h-6" />
                    Start Game
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-6">
                <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-sm">
                  <div className="flex flex-wrap gap-4 justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary-100 text-primary-700 px-4 py-2 rounded-lg">
                        <span className="font-semibold">
                          {matchedPairs.length}
                        </span>
                        <span className="text-primary-500">
                          /{wordPairs.length}
                        </span>
                        <span className="ml-2 text-sm">Matches</span>
                      </div>

                      <div className="bg-accent-100 text-accent-700 px-4 py-2 rounded-lg">
                        <span className="font-semibold">
                          {calculateAccuracy()}%
                        </span>
                        <span className="ml-2 text-sm">Accuracy</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <h3 className="text-lg font-semibold text-primary-600 pl-2">
                      English Words
                    </h3>
                    <h3 className="text-lg font-semibold text-secondary-600 pl-2">
                      Indonesian Words
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      {words.left.map((word) => (
                        <motion.div
                          key={word.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`
                            w-full h-16 flex items-center justify-center
                            rounded-xl cursor-pointer text-center p-4
                            transition-all duration-300 hover:scale-102
                            shadow-sm hover:shadow-md
                            ${
                              matchedPairs.includes(word.pairId)
                                ? 'bg-success-100 border-2 border-success-300 text-success-700'
                                : incorrectPairs.includes(word.pairId)
                                ? 'bg-error-100 border-2 border-error-300 text-error-700'
                                : selectedWord?.id === word.id
                                ? 'ring-4 ring-primary-400 bg-primary-100 text-primary-700'
                                : 'bg-white hover:bg-primary-50 border border-primary-200 text-primary-800'
                            }
                          `}
                          onClick={() => handleWordClick(word)}
                        >
                          <div className="flex items-center gap-2">
                            {matchedPairs.includes(word.pairId) && (
                              <CheckCircle2 className="w-5 h-5 text-success-500" />
                            )}
                            {incorrectPairs.includes(word.pairId) && (
                              <XCircle className="w-5 h-5 text-error-500" />
                            )}
                            <span className="text-base md:text-lg font-medium">
                              {word.text}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      {words.right.map((word) => (
                        <motion.div
                          key={word.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`
                            w-full h-16 flex items-center justify-center
                            rounded-xl cursor-pointer text-center p-4
                            transition-all duration-300 hover:scale-102
                            shadow-sm hover:shadow-md
                            ${
                              matchedPairs.includes(word.pairId)
                                ? 'bg-success-100 border-2 border-success-300 text-success-700'
                                : incorrectPairs.includes(word.pairId)
                                ? 'bg-error-100 border-2 border-error-300 text-error-700'
                                : selectedWord?.id === word.id
                                ? 'ring-4 ring-secondary-400 bg-secondary-100 text-secondary-700'
                                : 'bg-white hover:bg-secondary-50 border border-secondary-200 text-secondary-800'
                            }
                          `}
                          onClick={() => handleWordClick(word)}
                        >
                          <div className="flex items-center gap-2">
                            {matchedPairs.includes(word.pairId) && (
                              <CheckCircle2 className="w-5 h-5 text-success-500" />
                            )}
                            {incorrectPairs.includes(word.pairId) && (
                              <XCircle className="w-5 h-5 text-error-500" />
                            )}
                            <span className="text-base md:text-lg font-medium">
                              {word.text}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {showInstructions && (
                    <motion.div
                      initial={{ opacity: 0, y: 50, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.9 }}
                      className="fixed bottom-6 right-6 max-w-sm"
                    >
                      <Card className="bg-white/95 backdrop-blur border-primary-200 shadow-lg">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2 text-primary-600">
                              <Info className="w-5 h-5" />
                              <h4 className="font-semibold">Quick Tips</h4>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-primary-400 hover:text-primary-600 -mt-1 -mr-2"
                              onClick={() => setShowInstructions(false)}
                            >
                              ×
                            </Button>
                          </div>
                          <ul className="space-y-2 text-sm text-primary-700">
                            <li className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                              Click any word to select it
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                              Find and click its matching translation
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                              Green means correct match
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                              Red means incorrect match
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>

                {isGameComplete && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                  >
                    <Card className="w-full max-w-lg bg-white shadow-2xl">
                      <CardContent className="p-8 text-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, type: 'spring' }}
                        >
                          <Trophy className="w-20 h-20 text-success-500 mx-auto mb-6" />
                        </motion.div>
                        <h3 className="text-3xl font-bold text-success-700 mb-4">
                          Congratulations! 🎉
                        </h3>
                        <p className="text-lg text-success-600 mb-6">
                          You've successfully matched all the words!
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                          <div className="bg-success-50 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-success-700">
                              {calculateAccuracy()}%
                            </div>
                            <div className="text-sm text-success-600">
                              Accuracy
                            </div>
                          </div>
                          <div className="bg-success-50 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-success-700">
                              {calculateTimeElapsed()}s
                            </div>
                            <div className="text-sm text-success-600">Time</div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <Button
                            onClick={resetGame}
                            className="bg-success-500 hover:bg-success-600 text-white"
                          >
                            Play Again
                          </Button>
                          <Button
                            onClick={handleBack}
                            variant="outline"
                            className="border-success-300 text-success-700 hover:bg-success-50"
                          >
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
