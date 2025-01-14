import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, HelpCircle, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const DragDropWordGame = () => {
  const [inputText, setInputText] = useState('')
  const [puzzleStructure, setPuzzleStructure] = useState([])
  const [availableWords, setAvailableWords] = useState([])
  const [score, setScore] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [error, setError] = useState('')
  const [showTutorial, setShowTutorial] = useState(false)

  const getWordCount = (text) => {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length
  }

  const createPuzzle = (text) => {
    const words = text.trim().split(' ')

    if (words.length < 10) {
      setError('Please enter at least 10 words to start the game.')
      return
    }

    const eligibleIndices = words
      .map((word, idx) => ({ word, idx }))
      .filter((item) => item.word.length > 2)
      .map((item) => item.idx)

    const percentageToHide = words.length <= 6 ? 0.3 : 0.4
    const numWordsToHide = Math.max(
      3,
      Math.floor(eligibleIndices.length * percentageToHide)
    )
    const hiddenIndices = new Set()
    const blacklistedIndices = new Set()

    while (hiddenIndices.size < numWordsToHide && eligibleIndices.length > 0) {
      const validIndices = eligibleIndices.filter(
        (idx) => !blacklistedIndices.has(idx)
      )
      if (validIndices.length === 0) break

      const randomIndex = Math.floor(Math.random() * validIndices.length)
      const selectedIdx = validIndices[randomIndex]

      hiddenIndices.add(selectedIdx)
      blacklistedIndices.add(selectedIdx - 1)
      blacklistedIndices.add(selectedIdx + 1)

      const indexToRemove = eligibleIndices.indexOf(selectedIdx)
      if (indexToRemove !== -1) {
        eligibleIndices.splice(indexToRemove, 1)
      }
    }

    const structure = words.map((word, idx) => ({
      id: `slot-${idx}`,
      originalWord: word,
      isHidden: hiddenIndices.has(idx),
      currentWord: hiddenIndices.has(idx) ? null : word,
    }))

    const hidden = words
      .filter((_, idx) => hiddenIndices.has(idx))
      .map((word, idx) => ({
        id: `word-${idx}`,
        word,
      }))

    setPuzzleStructure(structure)
    setAvailableWords(hidden)
    setGameStarted(true)
    setError('')
  }

  const handleDragStart = (e, word) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(word))
    e.target.classList.add('opacity-50')
  }

  const handleDragEnd = (e) => {
    e.target.classList.remove('opacity-50')
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.currentTarget.classList.add('border-primary-400')
  }

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('border-primary-400')
  }

  const handleDrop = (e, targetId) => {
    e.preventDefault()
    e.currentTarget.classList.remove('border-primary-400')

    try {
      const droppedWord = JSON.parse(e.dataTransfer.getData('text/plain'))

      const existingSlot = puzzleStructure.find(
        (slot) => slot.currentWord === droppedWord.word
      )

      if (existingSlot) {
        setPuzzleStructure((prev) =>
          prev.map((slot) =>
            slot.id === existingSlot.id ? { ...slot, currentWord: null } : slot
          )
        )
      } else {
        setAvailableWords((prev) => prev.filter((w) => w.id !== droppedWord.id))
      }

      setPuzzleStructure((prev) =>
        prev.map((slot) => {
          if (slot.id === targetId) {
            if (slot.currentWord) {
              setAvailableWords((prev) => [
                ...prev,
                { id: `word-${Date.now()}`, word: slot.currentWord },
              ])
            }
            return { ...slot, currentWord: droppedWord.word }
          }
          return slot
        })
      )
    } catch (err) {
      console.error('Error handling drop:', err)
    }
  }

  const checkAnswers = () => {
    let correct = 0
    const incorrectWords = []

    puzzleStructure.forEach((slot) => {
      if (slot.isHidden) {
        if (slot.currentWord === slot.originalWord) {
          correct++
        } else if (slot.currentWord) {
          incorrectWords.push(slot.currentWord)
        }
      }
    })

    setPuzzleStructure((prev) =>
      prev.map((slot) => ({
        ...slot,
        currentWord:
          slot.isHidden && incorrectWords.includes(slot.currentWord)
            ? null
            : slot.currentWord,
      }))
    )

    setAvailableWords((prev) => [
      ...prev,
      ...incorrectWords.map((word, idx) => ({
        id: `word-${Date.now()}-${idx}`,
        word,
      })),
    ])

    setScore(correct)
  }

  const resetGame = () => {
    setGameStarted(false)
    setInputText('')
    setScore(0)
    setError('')
    setAvailableWords([])
    setPuzzleStructure([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50 to-secondary-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Card className="shadow-soft-xl backdrop-blur-sm bg-white/90">
          <CardHeader className="space-y-4 md:space-y-6">
            <div className="flex items-center justify-between">
              <Button
                onClick={() => window.history.back()}
                variant="ghost"
                className="text-primary-600 hover:text-primary-700 hover:bg-primary-100"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Cards
              </Button>
              <Button
                variant="ghost"
                className="text-primary-600"
                onClick={() => setShowTutorial(!showTutorial)}
              >
                <HelpCircle className="w-5 h-5" />
              </Button>
            </div>

            <AnimatePresence>
              {showTutorial && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-primary-50 p-4 rounded-lg text-primary-800"
                >
                  <h3 className="font-semibold mb-2">How to Play:</h3>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Enter a text with at least 10 words</li>
                    <li>Some words will be removed and shown below</li>
                    <li>
                      Drag and drop the words back to their correct positions
                    </li>
                    <li>Click "Check Answers" to see your score</li>
                  </ol>
                </motion.div>
              )}
            </AnimatePresence>
          </CardHeader>

          <CardContent className="p-6">
            {!gameStarted ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <label className="block text-lg font-medium text-primary-700">
                    Enter your text (minimum 10 words):
                  </label>
                  <textarea
                    placeholder="Type or paste your text here..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="w-full min-h-[200px] p-4 rounded-lg border-2 border-primary-200 
                      focus:border-primary-400 focus:ring-2 focus:ring-primary-200 
                      bg-white/50 backdrop-blur-sm transition-all duration-200
                      text-primary-800 placeholder-primary-400"
                  />
                  {error && (
                    <Alert
                      variant="destructive"
                      className="bg-error-50 border-error-200"
                    >
                      <AlertDescription className="text-error-700">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
                <Button
                  onClick={() => createPuzzle(inputText)}
                  disabled={getWordCount(inputText) < 10}
                  className="w-full py-6 text-lg bg-gradient-to-r from-primary-600 to-accent-600 
                    hover:from-primary-700 hover:to-accent-700 text-white shadow-soft-md
                    transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Start Challenge
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl md:text-3xl font-bold text-primary-700">
                    Complete the Text
                  </h2>
                  <div className="flex items-center space-x-4">
                    <span className="text-xl font-semibold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                      Score: {score}/
                      {puzzleStructure.filter((item) => item.isHidden).length}
                    </span>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-soft-md">
                  <div className="prose prose-lg max-w-none">
                    {puzzleStructure.map((item, idx) => (
                      <React.Fragment key={item.id}>
                        {idx > 0 && ' '}
                        {item.isHidden ? (
                          <span
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, item.id)}
                            className={`
                              inline-flex min-w-[100px] min-h-[40px] items-center 
                              border-2 border-dashed rounded-lg px-3 py-2 mx-1
                              transition-all duration-200 cursor-pointer
                              ${
                                item.currentWord
                                  ? 'border-success-400 bg-success-50/50'
                                  : 'border-primary-300 hover:border-primary-400'
                              }
                            `}
                          >
                            {item.currentWord || ''}
                          </span>
                        ) : (
                          <span className="text-primary-800">
                            {item.originalWord}
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-primary-700">
                    Available Words:
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {availableWords.map((word) => (
                      <motion.div
                        key={word.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, word)}
                        onDragEnd={handleDragEnd}
                        className="bg-gradient-to-r from-primary-100 to-accent-100 
                          px-4 py-2 rounded-lg cursor-move 
                          hover:from-primary-200 hover:to-accent-200 
                          active:scale-95 transition-all duration-200
                          shadow-soft-sm hover:shadow-soft-md
                          text-primary-800 font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {word.word}
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={checkAnswers}
                    className="flex-1 py-6 text-lg bg-gradient-to-r from-success-500 to-success-600 
                      hover:from-success-600 hover:to-success-700 text-white shadow-soft-md"
                  >
                    Check Answers
                  </Button>
                  <Button
                    onClick={resetGame}
                    className="flex-1 py-6 text-lg bg-gradient-to-r from-primary-500 to-accent-500 
                      hover:from-primary-600 hover:to-accent-600 text-white shadow-soft-md"
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    New Game
                  </Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DragDropWordGame
