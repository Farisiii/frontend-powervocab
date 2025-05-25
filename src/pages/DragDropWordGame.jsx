import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, HelpCircle, RefreshCw, Type, Trophy } from 'lucide-react'

const ClickWordGame = () => {
  const [inputText, setInputText] = useState('')
  const [puzzleStructure, setPuzzleStructure] = useState([])
  const [availableWords, setAvailableWords] = useState([])
  const [selectedWord, setSelectedWord] = useState(null)
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
    setSelectedWord(null)
  }

  const handleWordClick = (word) => {
    setSelectedWord(selectedWord?.id === word.id ? null : word)
  }

  const handleSlotClick = (targetSlot) => {
    if (!selectedWord || !targetSlot.isHidden) return

    // Check if the selected word is already placed somewhere
    const existingSlot = puzzleStructure.find(
      (slot) => slot.currentWord === selectedWord.word
    )

    if (existingSlot) {
      // Remove word from existing slot
      setPuzzleStructure((prev) =>
        prev.map((slot) =>
          slot.id === existingSlot.id ? { ...slot, currentWord: null } : slot
        )
      )
    } else {
      // Remove word from available words
      setAvailableWords((prev) => prev.filter((w) => w.id !== selectedWord.id))
    }

    // Place word in target slot
    setPuzzleStructure((prev) =>
      prev.map((slot) => {
        if (slot.id === targetSlot.id) {
          // If slot already has a word, return it to available words
          if (slot.currentWord) {
            setAvailableWords((prev) => [
              ...prev,
              { id: `word-${Date.now()}`, word: slot.currentWord },
            ])
          }
          return { ...slot, currentWord: selectedWord.word }
        }
        return slot
      })
    )

    // Clear selection
    setSelectedWord(null)
  }

  const handleFilledSlotClick = (slot) => {
    if (!slot.isHidden || !slot.currentWord) return

    // Return word to available words
    setAvailableWords((prev) => [
      ...prev,
      { id: `word-${Date.now()}`, word: slot.currentWord },
    ])

    // Clear the slot
    setPuzzleStructure((prev) =>
      prev.map((s) => (s.id === slot.id ? { ...s, currentWord: null } : s))
    )
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
    setSelectedWord(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Button
            onClick={() => window.history.back()}
            variant="ghost"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Button>
          {gameStarted && (
            <div className="flex items-center gap-4">
              <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg border shadow-sm">
                <span className="text-sm font-medium text-gray-700">
                  Score:{' '}
                </span>
                <span className="text-lg font-bold text-blue-600">
                  {score}/
                  {puzzleStructure.filter((item) => item.isHidden).length}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Main Game Card */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
          <CardHeader className="border-b bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <Type className="w-7 h-7" />
                Word Completion Challenge
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => setShowTutorial(!showTutorial)}
              >
                <HelpCircle className="w-5 h-5" />
              </Button>
            </div>

            {/* Tutorial */}
            {showTutorial && (
              <div className="mt-4 bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                <h3 className="font-semibold mb-3 text-white">How to Play:</h3>
                <ol className="list-decimal list-inside space-y-2 text-white/90 text-sm">
                  <li>Enter text with at least 10 words</li>
                  <li>Some words will be hidden and shown below</li>
                  <li>
                    <strong>Click a word</strong> to select it (highlighted in
                    blue)
                  </li>
                  <li>
                    <strong>Click an empty slot</strong> to place the selected
                    word
                  </li>
                  <li>
                    <strong>Click filled slots</strong> to remove words back to
                    available list
                  </li>
                  <li>Use "Check Answers" to see your score</li>
                </ol>
              </div>
            )}
          </CardHeader>

          <CardContent className="p-6">
            {!gameStarted ? (
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="block text-lg font-semibold text-gray-800">
                    Enter your text (minimum 10 words):
                  </label>
                  <textarea
                    placeholder="Type or paste your text here..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="w-full min-h-48 p-4 rounded-xl border-2 border-gray-200 
                      focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:outline-none
                      bg-white text-gray-800 placeholder-gray-400 text-base
                      transition-all duration-200"
                  />
                  <div className="text-sm text-gray-600">
                    Word count: {getWordCount(inputText)} / 10 minimum
                  </div>
                  {error && (
                    <Alert
                      variant="destructive"
                      className="bg-red-50 border-red-200"
                    >
                      <AlertDescription className="text-red-700">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
                <Button
                  onClick={() => createPuzzle(inputText)}
                  disabled={getWordCount(inputText) < 10}
                  className="w-full py-6 text-lg bg-gradient-to-r from-blue-500 to-indigo-600 
                    hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl 
                    transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed 
                    font-semibold rounded-xl"
                >
                  🚀 Start Challenge
                </Button>
              </div>
            ) : gameComplete ? (
              // Game Complete Screen
              <div className="flex flex-col items-center justify-center text-center space-y-6 py-12">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 bg-yellow-200 rounded-full animate-ping opacity-75" />
                  </div>
                  <Trophy className="w-24 h-24 text-yellow-500 mx-auto relative animate-bounce" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    🎉 Congratulations! 🎉
                  </h2>
                  <p className="text-2xl text-gray-700 font-semibold">
                    Perfect Score: {score}/
                    {puzzleStructure.filter((item) => item.isHidden).length}
                  </p>
                  <div className="pt-4">
                    <Button
                      onClick={resetGame}
                      className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 
                        hover:to-blue-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl 
                        transition-all duration-200 font-semibold"
                    >
                      🔄 Play Again
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Game Controls */}
                <div className="flex justify-between items-center">
                  {selectedWord ? (
                    <div className="flex items-center gap-3 bg-blue-50 border-2 border-blue-200 rounded-xl px-4 py-2">
                      <span className="text-sm text-blue-700 font-medium">
                        Selected:
                      </span>
                      <span className="text-base text-blue-800 font-bold bg-blue-100 px-3 py-1 rounded-lg">
                        "{selectedWord.word}"
                      </span>
                      <Button
                        onClick={() => setSelectedWord(null)}
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-1 h-auto ml-2"
                      >
                        ✕
                      </Button>
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm italic">
                      👆 Click a word below to select it
                    </div>
                  )}

                  <Button
                    onClick={resetGame}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 hover:bg-gray-50"
                  >
                    <RefreshCw className="w-4 h-4" />
                    New Game
                  </Button>
                </div>

                {/* Text Display */}
                <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-gray-200">
                  <h3 className="text-base font-semibold text-gray-700 mb-4">
                    💡 Complete the text by selecting words and clicking empty
                    spaces:
                  </h3>
                  <div className="text-lg leading-relaxed text-gray-800">
                    {puzzleStructure.map((item, idx) => (
                      <React.Fragment key={item.id}>
                        {idx > 0 && ' '}
                        {item.isHidden ? (
                          <span
                            onClick={() =>
                              item.currentWord
                                ? handleFilledSlotClick(item)
                                : handleSlotClick(item)
                            }
                            className={`
                              inline-flex min-w-24 min-h-10 items-center justify-center 
                              border-2 border-dashed rounded-lg px-3 py-2 mx-1 
                              transition-all duration-200 cursor-pointer font-medium
                              hover:scale-105 active:scale-95
                              ${
                                item.currentWord
                                  ? 'border-green-400 bg-green-50 text-green-800 hover:bg-green-100 shadow-sm'
                                  : selectedWord
                                  ? 'border-blue-400 bg-blue-50 hover:bg-blue-100 text-blue-700 animate-pulse'
                                  : 'border-gray-300 hover:border-blue-400 bg-white hover:bg-blue-50 text-gray-600'
                              }
                            `}
                            title={
                              item.currentWord
                                ? 'Click to remove this word'
                                : selectedWord
                                ? `Click to place "${selectedWord.word}" here`
                                : 'Select a word first, then click here'
                            }
                          >
                            {item.currentWord ||
                              (selectedWord ? '📍 Place here' : '❓')}
                          </span>
                        ) : (
                          <span className="text-gray-800 font-medium">
                            {item.originalWord}
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Available Words */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    🎯 Available Words
                    <span className="text-sm font-normal text-gray-600">
                      (click to select)
                    </span>
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {availableWords.map((word) => (
                      <button
                        key={word.id}
                        onClick={() => handleWordClick(word)}
                        className={`
                          border-2 px-4 py-3 rounded-xl cursor-pointer shadow-md hover:shadow-lg 
                          font-semibold text-base transition-all duration-200 select-none
                          hover:scale-105 active:scale-95
                          ${
                            selectedWord?.id === word.id
                              ? 'bg-gradient-to-r from-blue-500 to-indigo-500 border-blue-400 text-white shadow-blue-200'
                              : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-blue-300 text-gray-800'
                          }
                        `}
                      >
                        {word.word}
                        {selectedWord?.id === word.id && (
                          <span className="ml-2">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                  {availableWords.length === 0 && (
                    <div className="text-center py-8 text-gray-500 italic">
                      🎉 All words have been placed! Click "Check Answers" to
                      see your score.
                    </div>
                  )}
                </div>

                {/* Check Answers Button */}
                <div className="pt-4 text-center">
                  <Button
                    onClick={checkAnswers}
                    className="px-8 py-4 text-lg bg-gradient-to-r from-green-500 to-blue-500 
                      hover:from-green-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl 
                      transition-all duration-200 font-semibold rounded-xl"
                  >
                    ✅ Check Answers
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

export default ClickWordGame
