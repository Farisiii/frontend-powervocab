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
        <Droplets className="h-6 w-6 md:h-8 md:w-8 xl:h-12 xl:w-12 text-blue-500" />
      ),
      color: 'bg-blue-50 hover:bg-blue-100',
      borderColor: 'border-blue-200',
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
        <Brain className="h-6 w-6 md:h-8 md:w-8 xl:h-12 xl:w-12 text-purple-500" />
      ),
      color: 'bg-purple-50 hover:bg-purple-100',
      borderColor: 'border-purple-200',
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
        <BookText className="h-6 w-6 md:h-8 md:w-8 xl:h-12 xl:w-12 text-emerald-500" />
      ),
      color: 'bg-emerald-50 hover:bg-emerald-100',
      borderColor: 'border-emerald-200',
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
        className="h-4 w-4 md:h-5 md:w-5 text-yellow-400 fill-yellow-400"
      />
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-start">
          <Button
            variant="ghost"
            onClick={() => navigate('/learning-cards')}
            className="text-primary-400 hover:text-primary-500 hover:bg-accent-100 transition-colors duration-200 w-fit"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span className="font-medium">Back to Cards</span>
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-800 mb-3">
            Pilih Petualanganmu
          </h1>
          <p className="text-sm md:text-base lg:text-lg text-gray-600">
            Temukan mode permainan yang sesuai dengan gaya belajarmu!
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {games.map((game) => (
            <motion.div key={game.id} variants={cardVariants}>
              <Card
                className={`${game.color} ${game.borderColor} border-2 transition-all duration-300 hover:scale-102 hover:shadow-lg cursor-pointer h-full`}
                onClick={() => navigate(game.path)}
              >
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-2 md:p-3 rounded-xl bg-white shadow-md">
                      {game.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-1">
                        {game.title}
                      </h3>
                      <div className="flex items-center space-x-1">
                        {renderStars(game.stars)}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm md:text-base text-gray-600 mb-4">
                    {game.description}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm md:text-base">
                      <span className="font-medium">Tingkat Kesulitan:</span>
                      <span
                        className={`px-3 py-1 rounded-full ${
                          game.difficulty === 'Mudah'
                            ? 'bg-green-100 text-green-700'
                            : game.difficulty === 'Sedang'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {game.difficulty}
                      </span>
                    </div>

                    <Button className="w-full bg-white hover:bg-gray-50 text-gray-800 border border-gray-200">
                      <Trophy className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                      <span className="text-sm md:text-base">
                        Mulai Bermain
                      </span>
                    </Button>
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
