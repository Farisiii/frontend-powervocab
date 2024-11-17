import React, { useState, useCallback, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
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
} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

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
  }, [])

  useEffect(() => {
    if (cardId) {
      fetchWordPairs()
    }
  }, [cardId, fetchWordPairs])

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

      if (
        selectedWord.pairId === word.pairId &&
        selectedWord.type !== word.type
      ) {
        setMatchedPairs((prev) => [...prev, word.pairId])
        setIncorrectPairs((prev) => prev.filter((id) => id !== word.pairId))
        toast({
          title: 'Perfect Match! 🎉',
          description: 'Keep up the great work!',
          variant: 'success',
        })
      } else {
        setIncorrectPairs((prev) => [
          ...new Set([...prev, word.pairId, selectedWord.pairId]),
        ])
        toast({
          title: 'Not quite right',
          description: 'Try another pair!',
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
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] bg-accent-50 rounded-lg">
        <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
      </div>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto bg-accent-50 shadow-xl">
        <CardContent className="p-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="mt-4 flex justify-center">
            <Button onClick={() => navigate('/cards')} variant="secondary">
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
    <div className="min-h-screen w-full p-4 bg-gradient-to-b from-accent-100 to-accent-50">
      <Card className="w-full md:w-[95%] lg:w-[85%] max-w-[1400px] mx-auto bg-white shadow-xl">
        <CardHeader className="p-4">
          <div className="relative flex items-center justify-between">
            <Button
              onClick={handleBack}
              variant="ghost"
              className="text-primary-400 hover:text-primary-500 hover:bg-accent-200 transition-colors duration-200 text-base md:text-lg lg:text-xl flex-shrink-0 mt-1 z-10"
            >
              <ArrowLeft className="w-6 h-6" />
              Back
            </Button>
            <CardTitle className="absolute left-0 right-0 text-3xl z-0 font-bold text-primary-400">
              Word Matching Game
            </CardTitle>
            <div className="w-6" />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          {!gameStarted ? (
            <div className="text-center space-y-6 py-8">
              <div className="bg-gradient-to-r from-primary-400 to-primary-600 text-white p-6 rounded-lg shadow-lg mx-auto md:w-4/5 lg:w-3/4">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Word Matching Game
                </h2>
                <p className="text-base md:text-lg opacity-90 mb-6">
                  Match English words with their Indonesian translations!
                </p>
                <div className="bg-white/10 p-4 rounded-lg text-left space-y-2">
                  <h3 className="font-semibold text-lg md:text-xl mb-2">
                    How to Play:
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-sm md:text-base">
                    <li>Click on a word to select it</li>
                    <li>Click on its matching translation</li>
                    <li>Correct matches will turn green</li>
                    <li>Incorrect matches will turn red</li>
                    <li>Match all pairs to win!</li>
                  </ul>
                </div>
              </div>
              <Button
                onClick={() => setGameStarted(true)}
                className="bg-success-500 hover:bg-success-600 text-white px-6 py-3 text-lg rounded-full transform transition-all hover:scale-105 shadow-lg"
              >
                Start Game
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-sm flex flex-wrap gap-4 justify-between items-center">
                <h3 className="text-lg md:text-xl font-bold text-primary-400">
                  Matches: {matchedPairs.length} / {wordPairs.length}
                </h3>
                <Button
                  onClick={resetGame}
                  className="bg-accent-500 hover:bg-accent-600 text-white flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset Game
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3 md:gap-4 lg:gap-6">
                {/* English words column */}
                <div className="space-y-3 md:space-y-4">
                  {words.left.map((word) => (
                    <motion.div
                      key={word.id}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`
                        w-full h-16 md:h-20 lg:h-24 flex items-center justify-center
                        rounded-xl cursor-pointer text-center p-3
                        transform transition-all duration-300 hover:scale-105
                        ${
                          matchedPairs.includes(word.pairId) ||
                          incorrectPairs.includes(word.pairId)
                            ? 'cursor-not-allowed'
                            : 'hover:bg-primary-100'
                        }
                        ${
                          selectedWord?.id === word.id
                            ? 'ring-4 ring-primary-400 bg-primary-100'
                            : matchedPairs.includes(word.pairId)
                            ? 'bg-success-100 text-success-700 border-2 border-success-500'
                            : incorrectPairs.includes(word.pairId)
                            ? 'bg-red-100 text-red-700 border-2 border-red-500'
                            : 'bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200'
                        }
                      `}
                      onClick={() => handleWordClick(word)}
                    >
                      <span className="text-sm md:text-base lg:text-lg font-medium px-2">
                        {word.text}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Indonesian words column */}
                <div className="space-y-3 md:space-y-4">
                  {words.right.map((word) => (
                    <motion.div
                      key={word.id}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`
                        w-full h-16 md:h-20 lg:h-24 flex items-center justify-center
                        rounded-xl cursor-pointer text-center p-3
                        transform transition-all duration-300 hover:scale-105
                        ${
                          matchedPairs.includes(word.pairId) ||
                          incorrectPairs.includes(word.pairId)
                            ? 'cursor-not-allowed'
                            : 'hover:bg-secondary-100'
                        }
                        ${
                          selectedWord?.id === word.id
                            ? 'ring-4 ring-secondary-400 bg-secondary-100'
                            : matchedPairs.includes(word.pairId)
                            ? 'bg-success-100 text-success-700 border-2 border-success-500'
                            : incorrectPairs.includes(word.pairId)
                            ? 'bg-red-100 text-red-700 border-2 border-red-500'
                            : 'bg-gradient-to-br from-secondary-50 to-secondary-100 border border-secondary-200'
                        }
                      `}
                      onClick={() => handleWordClick(word)}
                    >
                      <span className="text-sm md:text-base lg:text-lg font-medium px-2">
                        {word.text}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {showInstructions && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="fixed bottom-4 right-4 max-w-sm bg-white/95 p-4 rounded-lg shadow-lg border border-accent-200"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Info className="w-5 h-5 text-primary-400" />
                      <h4 className="font-semibold text-primary-400">
                        Quick Tips
                      </h4>
                    </div>
                    <button
                      onClick={() => setShowInstructions(false)}
                      className="text-accent-400 hover:text-accent-500"
                    >
                      ×
                    </button>
                  </div>
                  <ul className="text-sm space-y-1 text-accent-700">
                    <li>• Click a word to select it</li>
                    <li>• Click its matching translation</li>
                    <li>• Green = Correct match</li>
                    <li>• Red = Incorrect match</li>
                  </ul>
                </motion.div>
              )}

              {isGameComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mt-8 bg-success-50 p-6 rounded-xl border-2 border-success-200 shadow-lg"
                >
                  <Trophy className="w-12 h-12 text-success-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-success-700 mb-2">
                    Congratulations!
                  </h3>
                  <p className="text-success-600 mb-4">
                    You've matched all the words correctly!
                  </p>
                  <Button
                    onClick={resetGame}
                    className="bg-success-500 hover:bg-success-600 text-white"
                  >
                    Play Again
                  </Button>
                </motion.div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default BubbleBathGame
