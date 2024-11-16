import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Droplets, BookText, Brain, Trophy } from 'lucide-react'
import { motion } from 'framer-motion'

const GameModePage = () => {
  const navigate = useNavigate()
  const { cardId } = useParams()

  const games = [
    {
      id: 'bubble-bath',
      path: `/cards/${cardId}/games/bubble-bath`, // Fixed path
      title: 'Bubble Bath',
      description:
        'Pop vocabulary bubbles to match words with their meanings! A fun and relaxing way to learn.',
      icon: (
        <Droplets className="h-8 w-8 sm:h-10 sm:w-10 lg:h-16 lg:w-16 text-accent-600" />
      ),
      color: 'bg-accent-50 hover:bg-accent-100',
      borderColor: 'border-accent-200',
      difficulty: 'Easy',
    },
    {
      id: 'translation-game',
      path: `/cards/${cardId}/games/translation-game`, // Fixed path
      title: 'Translation Game',
      description:
        'Test your memory by matching pairs of words! A classic game with a vocabulary twist.',
      icon: (
        <Brain className="h-8 w-8 sm:h-10 sm:w-10 lg:h-16 lg:w-16 text-primary-400" />
      ),
      color: 'bg-primary-50 hover:bg-primary-100',
      borderColor: 'border-primary-200',
      difficulty: 'Medium',
    },
    {
      id: 'drag-drop-word-game',
      path: `/cards/${cardId}/games/drag-drop-word-game`, // Fixed path
      title: 'Drag Drop Word',
      description:
        'Complete engaging stories by filling in the missing words. Build context while you learn!',
      icon: (
        <BookText className="h-8 w-8 sm:h-10 sm:w-10 lg:h-16 lg:w-16 text-secondary-600" />
      ),
      color: 'bg-secondary-50 hover:bg-secondary-100',
      borderColor: 'border-secondary-200',
      difficulty: 'Hard',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 via-secondary-50 to-primary-50 px-4 py-6 sm:p-6 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 sm:mb-10 lg:mb-16">
          <Button
            variant="ghost"
            onClick={() => navigate(`/cards/${cardId}`)}
            className="mb-4 sm:mb-6 lg:mb-8 text-primary-400 hover:text-primary-500 hover:bg-primary-50 transition-all duration-300 text-sm sm:text-base lg:text-lg"
          >
            <ArrowLeft className="mr-2 h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
            Back to Card Details
          </Button>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-2 sm:space-y-3 lg:space-y-4"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-primary-400">
              Choose Your Adventure
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-primary-300">
              Pick a game mode that suits your learning style!
            </p>
          </motion.div>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {games.map((game) => (
            <motion.div
              key={game.id}
              variants={cardVariants}
              className="h-full"
            >
              <Card
                className={`${game.color} ${game.borderColor} border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer h-full flex flex-col`}
                onClick={() => navigate(`${game.path}`)}
              >
                <CardContent className="flex-1 flex flex-col pt-6 pb-4 sm:pt-8 sm:pb-6 lg:pt-12 lg:pb-8">
                  <div className="flex flex-col items-center text-center h-full">
                    <div className="p-3 sm:p-4 lg:p-6 rounded-full bg-white shadow-lg mb-4 sm:mb-6 lg:mb-8">
                      {game.icon}
                    </div>

                    <div className="flex-1 flex flex-col justify-between space-y-4 sm:space-y-6 lg:space-y-8">
                      <div>
                        <CardTitle className="text-xl sm:text-2xl lg:text-4xl font-bold text-primary-400 mb-2 sm:mb-3 lg:mb-4">
                          {game.title}
                        </CardTitle>
                        <p className="text-xs sm:text-sm lg:text-lg text-primary-300 leading-relaxed px-2 sm:px-4 lg:px-6">
                          {game.description}
                        </p>
                      </div>

                      <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                        <div className="w-full px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 bg-white/50 rounded-lg">
                          <div className="flex justify-center items-center">
                            <span
                              className={`text-sm lg:text-lg font-medium ${
                                game.difficulty === 'Easy'
                                  ? 'text-green-600'
                                  : game.difficulty === 'Medium'
                                  ? 'text-yellow-600'
                                  : 'text-red-600'
                              }`}
                            >
                              {game.difficulty} Difficulty
                            </span>
                          </div>
                        </div>

                        <Button
                          className={`w-full text-sm sm:text-base lg:text-lg lg:py-6 bg-white hover:bg-${
                            game.borderColor.split('-')[1]
                          }-50 text-primary-400 border border-primary-200 shadow-sm`}
                        >
                          <Trophy className="mr-2 h-3 w-3 sm:h-4 sm:w-4 lg:h-6 lg:w-6" />
                          Start Game
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default GameModePage
