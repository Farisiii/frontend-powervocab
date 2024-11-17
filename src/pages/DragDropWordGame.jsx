import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft } from 'lucide-react'

const DragDropWordGame = () => {
  const navigate = useNavigate()
  const [inputText, setInputText] = useState('')
  const [puzzleStructure, setPuzzleStructure] = useState([])
  const [availableWords, setAvailableWords] = useState([])
  const [score, setScore] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [error, setError] = useState('')

  const handleBack = () => {
    navigate(-1)
  }

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

    let percentageToHide = words.length <= 6 ? 0.3 : 0.4
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
    const dragImage = new Image()
    dragImage.src =
      'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='
    e.dataTransfer.setDragImage(dragImage, 0, 0)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e, targetId) => {
    e.preventDefault()
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent-100 to-accent-50 p-2 sm:p-4">
      <div className="w-full md:w-[90%] lg:w-[80%] xl:w-[70%] mx-auto md:p-4">
        <div className="w-fit flex justify-start items-start text-start">
          <Button
            onClick={handleBack}
            variant="ghost"
            className="text-primary-400 hover:text-primary-500 hover:bg-accent-200 transition-colors duration-200 text-base  mt-1 z-10 md:hidden flex-1 "
          >
            <ArrowLeft className="w-6 h-6" />
            Back
          </Button>
        </div>

        <Card className="shadow-lg py-6 md:p-0 md:mt-8">
          <CardHeader className="p-4">
            <div className="relative flex items-center justify-between">
              <Button
                onClick={handleBack}
                variant="ghost"
                className="text-primary-400 hover:text-primary-500 hover:bg-accent-200 transition-colors duration-200 text-base md:text-lg lg:text-xl flex-shrink-0 mt-1 z-10 hidden md:inline"
              >
                <ArrowLeft className="w-6 h-6 hidden md:inline" />
                Back
              </Button>
              <CardTitle className="absolute left-0 right-0 text-2xl md:text-3xl z-0 font-bold text-primary-400">
                Drag Drop Word Game
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="p-3 sm:p-4 md:p-6">
            {!gameStarted ? (
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-lg sm:text-xl md:text-2xl">
                  Complete the Text
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Enter your text (minimum 10 words):
                    </label>
                    <textarea
                      placeholder="Type or paste your text here..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="w-full min-h-[100px] sm:min-h-[120px] md:min-h-[160px] p-2 sm:p-3 border rounded text-sm sm:text-base resize-y focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                    />
                  </div>
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription className="text-sm">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}
                  <Button
                    onClick={() => createPuzzle(inputText)}
                    className="w-full bg-accent-600 hover:bg-accent-700 text-white py-4 sm:py-6 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={getWordCount(inputText) < 10}
                  >
                    Start Game
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6 md:space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary-400">
                    Fill in the missing words
                  </h2>
                  <span className="text-lg sm:text-xl font-semibold text-accent-600">
                    Score: {score}/
                    {puzzleStructure.filter((item) => item.isHidden).length}
                  </span>
                </div>

                <div className="bg-secondary-50 p-3 sm:p-4 md:p-6 rounded-lg">
                  <div className="prose prose-sm sm:prose-base md:prose-lg max-w-none">
                    {puzzleStructure.map((item, idx) => (
                      <React.Fragment key={item.id}>
                        {idx > 0 && ' '}
                        {item.isHidden ? (
                          <span
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, item.id)}
                            className={`
                              inline-flex min-w-[80px] sm:min-w-[100px] md:min-w-[120px] 
                              min-h-[32px] sm:min-h-[36px] md:min-h-[40px] 
                              items-center border-2 border-dashed rounded 
                              px-2 sm:px-3 py-1 sm:py-2 align-middle text-sm sm:text-base
                              ${
                                item.currentWord
                                  ? 'border-success-400 bg-success-50'
                                  : 'border-accent-300'
                              }
                              hover:border-accent-500 transition-colors duration-300
                            `}
                          >
                            {item.currentWord || ''}
                          </span>
                        ) : (
                          <span className="text-sm sm:text-base md:text-lg">
                            {item.originalWord}
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-primary-400 mb-2 sm:mb-4">
                    Available Words:
                  </h3>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {availableWords.map((word) => (
                      <div
                        key={word.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, word)}
                        className="bg-accent-100 text-accent-800 px-3 sm:px-4 py-1 sm:py-2 
                          rounded-lg cursor-move hover:bg-accent-200 transition-colors 
                          text-sm sm:text-base md:text-lg"
                      >
                        {word.word}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
                  <Button
                    onClick={checkAnswers}
                    className="bg-success-600 hover:bg-success-700 text-white px-6 sm:px-8 
                      py-4 sm:py-6 text-sm sm:text-base w-full sm:w-auto"
                  >
                    Check Answers
                  </Button>
                  <Button
                    onClick={() => {
                      setGameStarted(false)
                      setInputText('')
                      setScore(0)
                      setError('')
                      setAvailableWords([])
                      setPuzzleStructure([])
                    }}
                    className="bg-error-600 hover:bg-error-700 text-white px-6 sm:px-8 
                      py-4 sm:py-6 text-sm sm:text-base w-full sm:w-auto"
                  >
                    New Game
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
