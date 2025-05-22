import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  ArrowLeft,
  Droplets,
  BookText,
  Brain,
  Trophy,
  Star,
} from 'lucide-react'
import { motion } from 'framer-motion'

const GameModePage = () => {
  const navigate = useNavigate()
  const { cardId } = useParams()

  const games = [
    {
      id: 'bubble-bath',
      path: `/cards/${cardId}/games/bubble-bath`,
      title: 'Mandi Gelembung',
      description:
        'Letuskan gelembung kosakata untuk mencocokkan kata dengan artinya! Cara yang menyenangkan dan santai untuk belajar.',
      icon: (
        <Droplets className="h-5 w-5 md:h-6 md:w-6 lg:h-8 lg:w-8 text-primary-500" />
      ),
      color: 'bg-primary-50 hover:bg-primary-100',
      borderColor: 'border-primary-200',
      iconBg: 'bg-primary-100',
      difficulty: 'Mudah',
      stars: 1,
    },
    {
      id: 'translation-game',
      path: `/cards/${cardId}/games/translation-game`,
      title: 'Permainan Terjemahan',
      description:
        'Uji ingatan Anda dengan mencocokkan pasangan kata! Permainan klasik dengan sentuhan kosakata.',
      icon: (
        <Brain className="h-5 w-5 md:h-6 md:w-6 lg:h-8 lg:w-8 text-secondary-600" />
      ),
      color: 'bg-secondary-50 hover:bg-secondary-100',
      borderColor: 'border-secondary-200',
      iconBg: 'bg-secondary-100',
      difficulty: 'Sedang',
      stars: 2,
    },
    {
      id: 'drag-drop-word-game',
      path: `/cards/${cardId}/games/drag-drop-word-game`,
      title: 'Seret & Letakkan Kata',
      description:
        'Lengkapi cerita menarik dengan mengisi kata-kata yang hilang. Bangun konteks sambil belajar!',
      icon: (
        <BookText className="h-5 w-5 md:h-6 md:w-6 lg:h-8 lg:w-8 text-success-600" />
      ),
      color: 'bg-success-50 hover:bg-success-100',
      borderColor: 'border-success-200',
      iconBg: 'bg-success-100',
      difficulty: 'Sulit',
      stars: 3,
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
      },
    },
  }

  const renderStars = (count) => {
    return [...Array(count)].map((_, index) => (
      <Star
        key={index}
        className="h-3 w-3 md:h-4 md:w-4 text-warning-400 fill-warning-400"
      />
    ))
  }

  const getDifficultyStyle = (difficulty) => {
    switch (difficulty) {
      case 'Mudah':
        return 'bg-success-100 text-success-700 border border-success-200'
      case 'Sedang':
        return 'bg-warning-100 text-warning-700 border border-warning-200'
      case 'Sulit':
        return 'bg-error-100 text-error-700 border border-error-200'
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-primary-100 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* Back Button */}
        <div className="flex justify-start">
          <Button
            variant="ghost"
            onClick={() => navigate('/learning-cards')}
            className="text-primary-600 hover:text-primary-700 hover:bg-primary-200 transition-all duration-200 p-2 sm:p-3"
          >
            <ArrowLeft className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            <span className="font-medium text-sm sm:text-base">
              Back to Cards
            </span>
          </Button>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-2 md:space-y-3"
        >
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-800">
            Pilih Petualanganmu
          </h1>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
            Temukan mode permainan yang sesuai dengan gaya belajarmu!
          </p>
        </motion.div>

        {/* Game Cards Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {games.map((game) => (
            <motion.div key={game.id} variants={cardVariants}>
              <Card
                className={`${game.color} ${game.borderColor} border-2 transition-all duration-300 hover:scale-105 hover:shadow-soft-xl cursor-pointer h-full group`}
                onClick={() => navigate(game.path)}
              >
                <CardContent className="p-3 sm:p-4 md:p-5 lg:p-6">
                  {/* Icon and Title Section */}
                  <div className="flex items-start space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                    <div
                      className={`p-2 sm:p-2.5 md:p-3 rounded-xl ${game.iconBg} shadow-soft-sm group-hover:shadow-soft-md transition-shadow duration-300 flex-shrink-0`}
                    >
                      {game.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-1 sm:mb-2 leading-tight">
                        {game.title}
                      </h3>
                      <div className="flex items-center space-x-0.5 sm:space-x-1">
                        {renderStars(game.stars)}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                    {game.description}
                  </p>

                  {/* Footer Section */}
                  <div className="space-y-2 sm:space-y-3">
                    {/* Difficulty Badge */}
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="font-medium text-gray-700">
                        Tingkat Kesulitan:
                      </span>
                      <span
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getDifficultyStyle(
                          game.difficulty
                        )}`}
                      >
                        {game.difficulty}
                      </span>
                    </div>

                    {/* Play Button */}
                    <Button className="w-full bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 shadow-soft-sm hover:shadow-soft-md transition-all duration-200 py-2 sm:py-2.5 md:py-3">
                      <Trophy className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                      <span className="text-xs sm:text-sm md:text-base font-medium">
                        Mulai Bermain
                      </span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info Section for larger screens */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="hidden md:block text-center pt-4 lg:pt-8"
        >
          <p className="text-sm text-gray-500 max-w-xl mx-auto">
            Setiap permainan dirancang khusus untuk meningkatkan kemampuan
            bahasa Anda dengan cara yang menyenangkan dan interaktif.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default GameModePage
