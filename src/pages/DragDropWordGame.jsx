import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, HelpCircle, RefreshCw, Type, Trophy } from 'lucide-react'

const DragDropWordGame = () => {
  const [inputText, setInputText] = useState('')
  const [puzzleStructure, setPuzzleStructure] = useState([])
  const [availableWords, setAvailableWords] = useState([])
  const [score, setScore] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [error, setError] = useState('')
  const [showTutorial, setShowTutorial] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)

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

    // Check if game is complete
    const totalHidden = puzzleStructure.filter((item) => item.isHidden).length
    if (correct === totalHidden) {
      setGameComplete(true)
    }
  }

  const resetGame = () => {
    setGameStarted(false)
    setGameComplete(false)
    setInputText('')
    setScore(0)
    setError('')
    setAvailableWords([])
    setPuzzleStructure([])
  }

  return (
    <div className="min-h-screen bg-primary-100 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* Back Button */}
        <div className="flex justify-start">
          <Button
            onClick={() => window.history.back()}
            variant="ghost"
            className="text-primary-600 hover:text-primary-700 hover:bg-primary-200 transition-all duration-200 p-2 sm:p-3"
          >
            <ArrowLeft className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            <span className="font-medium text-sm sm:text-base">
              Back to Cards
            </span>
          </Button>
        </div>

        {/* Main Game Content */}
        <Card className="bg-white/90 backdrop-blur-sm border-primary-200/50 shadow-lg">
          {/* Card Header */}
          <CardHeader className="px-4 py-3 sm:px-6 sm:py-4 border-b border-primary-200/40">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-primary-800 flex items-center gap-2">
                <Type className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
                Word Completion Game
              </CardTitle>
              <div className="flex items-center gap-2 sm:gap-4">
                {gameStarted && (
                  <div className="flex items-center gap-1 text-sm sm:text-base font-semibold">
                    <span className="text-primary-700">Score:</span>
                    <span className="text-primary-800">
                      {score}/
                      {puzzleStructure.filter((item) => item.isHidden).length}
                    </span>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary-600 hover:bg-primary-200 p-1 sm:p-2"
                  onClick={() => setShowTutorial(!showTutorial)}
                >
                  <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>
            </div>

            {/* Tutorial */}
            {showTutorial && (
              <div className="mt-4 bg-primary-50 p-4 rounded-lg border border-primary-200/40">
                <h3 className="font-semibold mb-2 text-primary-800 text-sm sm:text-base">
                  How to Play:
                </h3>
                <ol className="list-decimal list-inside space-y-1 text-primary-700 text-xs sm:text-sm">
                  <li>Enter a text with at least 10 words</li>
                  <li>Some words will be removed and shown below</li>
                  <li>
                    Drag and drop the words back to their correct positions
                  </li>
                  <li>Click "Check Answers" to see your score</li>
                </ol>
              </div>
            )}
          </CardHeader>

          {/* Card Content */}
          <CardContent className="p-4 sm:p-6">
            {!gameStarted ? (
              <div className="space-y-4 sm:space-y-6">
                <div className="space-y-3 sm:space-y-4">
                  <label className="block text-base sm:text-lg font-medium text-primary-800">
                    Enter your text (minimum 10 words):
                  </label>
                  <textarea
                    placeholder="Type or paste your text here..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="w-full min-h-48 sm:min-h-56 p-3 sm:p-4 rounded-lg border-2 border-primary-200 
                      focus:border-primary-400 focus:ring-2 focus:ring-primary-200 focus:outline-none
                      bg-white text-primary-800 placeholder-primary-400 text-sm sm:text-base
                      transition-all duration-200"
                  />
                  {error && (
                    <Alert
                      variant="destructive"
                      className="bg-error-50 border-error-200"
                    >
                      <AlertDescription className="text-error-700 text-sm">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
                <Button
                  onClick={() => createPuzzle(inputText)}
                  disabled={getWordCount(inputText) < 10}
                  className="w-full py-4 sm:py-6 text-sm sm:text-lg bg-primary-600 hover:bg-primary-700 
                    text-white shadow-md hover:shadow-lg transition-all duration-200 
                    disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Start Challenge
                </Button>
              </div>
            ) : gameComplete ? (
              // Game Complete Screen
              <div className="flex flex-col items-center justify-center text-center space-y-4 sm:space-y-6 py-8 sm:py-12">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-warning-100 rounded-full animate-ping opacity-75" />
                  </div>
                  <Trophy className="w-20 h-20 sm:w-24 sm:h-24 text-warning-500 mx-auto relative" />
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-800">
                    Congratulations!
                  </h2>
                  <p className="text-lg sm:text-xl lg:text-2xl text-primary-700 font-semibold">
                    Final Score: {score}/
                    {puzzleStructure.filter((item) => item.isHidden).length}
                  </p>
                  <div className="pt-2 sm:pt-4">
                    <Button
                      onClick={resetGame}
                      className="bg-primary-600 hover:bg-primary-700 text-white text-sm sm:text-base 
                        px-6 sm:px-8 py-2 sm:py-3 rounded-lg shadow-md hover:shadow-lg 
                        transition-all duration-200"
                    >
                      Play Again
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {/* Game Controls */}
                <div className="flex flex-col xs:flex-row justify-end gap-2">
                  <Button
                    onClick={resetGame}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1.5 bg-white text-secondary-700 hover:bg-secondary-50 
                      border-secondary-300 text-xs sm:text-sm"
                  >
                    <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                    New Game
                  </Button>
                </div>

                {/* Text Display */}
                <div
                  className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-primary-50 to-accent-50 
                  rounded-xl border border-primary-200/30"
                >
                  <h3 className="text-sm sm:text-base font-medium text-primary-700 mb-3 sm:mb-4">
                    Complete the text by dragging words to the empty spaces:
                  </h3>
                  <div className="text-sm sm:text-base lg:text-lg leading-relaxed text-primary-800">
                    {puzzleStructure.map((item, idx) => (
                      <React.Fragment key={item.id}>
                        {idx > 0 && ' '}
                        {item.isHidden ? (
                          <span
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, item.id)}
                            className={`
                              inline-flex min-w-16 sm:min-w-20 lg:min-w-24 min-h-8 sm:min-h-10 
                              items-center justify-center border-2 border-dashed rounded-lg 
                              px-2 sm:px-3 py-1 sm:py-2 mx-1 transition-all duration-200 cursor-pointer
                              text-xs sm:text-sm lg:text-base font-medium
                              ${
                                item.currentWord
                                  ? 'border-success-400 bg-success-50 text-success-800'
                                  : 'border-primary-300 hover:border-primary-400 bg-white hover:bg-primary-50'
                              }
                            `}
                          >
                            {item.currentWord || ''}
                          </span>
                        ) : (
                          <span className="text-primary-800 font-medium">
                            {item.originalWord}
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Available Words */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold text-primary-800">
                    Available Words:
                  </h3>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {availableWords.map((word) => (
                      <div
                        key={word.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, word)}
                        onDragEnd={handleDragEnd}
                        className="bg-white hover:bg-primary-50 border-2 border-primary-200 
                          hover:border-primary-300 px-3 sm:px-4 py-2 sm:py-3 rounded-lg cursor-move 
                          shadow-sm hover:shadow-md text-primary-800 font-medium 
                          text-sm sm:text-base transition-all duration-200 select-none
                          active:scale-95"
                      >
                        {word.word}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Check Answers Button */}
                <div className="pt-2 sm:pt-4">
                  <Button
                    onClick={checkAnswers}
                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base 
                      bg-success-500 hover:bg-success-600 text-white shadow-md hover:shadow-lg 
                      transition-all duration-200 font-medium"
                  >
                    Check Answers
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

export default DragDropWordGame
