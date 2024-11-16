import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
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
    <div className="min-h-screen bg-gradient-to-b from-accent-100 to-accent-50 p-4">
      <div className="container mx-auto max-w-6xl lg:max-w-7xl">
        <Button
          onClick={handleBack}
          variant="ghost"
          className="mb-4 flex items-center gap-2 text-primary-600 hover:text-primary-700 text-xl"
        >
          <ArrowLeft className="w-10 h-10" />
          Back
        </Button>

        <Card className="bg-white shadow-lg">
          <CardContent className="p-8">
            {!gameStarted ? (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-primary-400 mb-6">
                  Complete the Text
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter your text (minimum 10 words):
                    </label>
                    <textarea
                      placeholder="Type or paste your text here..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="w-full min-h-[120px] md:min-h-[160px] p-3 border rounded text-lg resize-y focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                    />
                  </div>
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <Button
                    onClick={() => createPuzzle(inputText)}
                    className="w-full bg-accent-600 hover:bg-accent-700 text-white py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={getWordCount(inputText) < 10}
                  >
                    Start Game
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-bold text-primary-400">
                    Fill in the missing words
                  </h2>
                  <span className="text-xl font-semibold text-accent-600">
                    Score: {score}/
                    {puzzleStructure.filter((item) => item.isHidden).length}
                  </span>
                </div>

                <div className="bg-secondary-50 p-6 rounded-lg leading-relaxed">
                  <div className="prose prose-lg max-w-none">
                    {puzzleStructure.map((item, idx) => (
                      <React.Fragment key={item.id}>
                        {idx > 0 && ' '}
                        {item.isHidden ? (
                          <span
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, item.id)}
                            className={`
                              inline-flex min-w-[120px] min-h-[40px] items-center
                              border-2 border-dashed rounded px-3 py-2 align-middle
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
                          <span className="text-lg">{item.originalWord}</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-primary-400 mb-4">
                    Available Words:
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {availableWords.map((word) => (
                      <div
                        key={word.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, word)}
                        className="bg-accent-100 text-accent-800 px-4 py-2 rounded-lg cursor-move
                          hover:bg-accent-200 transition-colors text-lg"
                      >
                        {word.word}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-6">
                  <Button
                    onClick={checkAnswers}
                    className="bg-success-600 hover:bg-success-700 text-white px-8 py-6 text-lg"
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
                    className="bg-error-600 hover:bg-error-700 text-white px-8 py-6 text-lg"
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
