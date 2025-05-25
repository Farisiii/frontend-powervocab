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
        <Droplets className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-primary-500" />
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
        <Brain className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-secondary-600" />
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
        <BookText className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-success-600" />
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
        className="h-4 w-4 md:h-5 md:w-5 text-warning-400 fill-warning-400"
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
    <div className="min-h-screen bg-primary-100 p-2 sm:p-4 md:p-6 lg:p-8 xl:p-12">
      <div className="max-w-none mx-auto space-y-4 md:space-y-6 lg:space-y-8">
        {/* Back Button */}
        <div className="flex justify-start">
          <Button
            variant="ghost"
            onClick={() => navigate(`/cards/${cardId}`)}
            className="text-primary-600 hover:text-primary-700 hover:bg-primary-200 transition-all duration-200 p-3 md:p-4"
          >
            <ArrowLeft className="mr-2 h-5 w-5 md:h-6 md:w-6" />
            <span className="font-medium text-base md:text-lg">
              Back to Cards
            </span>
          </Button>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-3 md:space-y-4 lg:space-y-6"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-800">
            Pilih Petualanganmu
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Temukan mode permainan yang sesuai dengan gaya belajarmu!
          </p>
        </motion.div>

        {/* Game Cards Grid - Optimized for larger screens */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8 xl:gap-10 2xl:gap-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {games.map((game) => (
            <motion.div key={game.id} variants={cardVariants}>
              <Card
                className={`${game.color} ${game.borderColor} border-2 transition-all duration-300 hover:scale-105 hover:shadow-soft-xl cursor-pointer h-full group min-h-[280px] md:min-h-[320px] lg:min-h-[360px] xl:min-h-[400px]`}
                onClick={() => navigate(game.path)}
              >
                <CardContent className="p-4 md:p-6 lg:p-8 xl:p-10 h-full flex flex-col">
                  {/* Icon and Title Section */}
                  <div className="flex items-start space-x-4 md:space-x-6 mb-4 md:mb-6">
                    <div
                      className={`p-3 md:p-4 lg:p-5 rounded-xl ${game.iconBg} shadow-soft-sm group-hover:shadow-soft-md transition-shadow duration-300 flex-shrink-0`}
                    >
                      {game.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-800 mb-2 md:mb-3 leading-tight">
                        {game.title}
                      </h3>
                      <div className="flex items-center space-x-1">
                        {renderStars(game.stars)}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="flex-1">
                    <p className="text-sm md:text-base lg:text-lg xl:text-xl text-gray-600 mb-4 md:mb-6 lg:mb-8 leading-relaxed">
                      {game.description}
                    </p>
                  </div>

                  {/* Footer Section */}
                  <div className="space-y-3 md:space-y-4 lg:space-y-5 mt-auto">
                    {/* Difficulty Badge */}
                    <div className="flex items-center justify-between text-sm md:text-base lg:text-lg">
                      <span className="font-medium text-gray-700">
                        Tingkat Kesulitan:
                      </span>
                      <span
                        className={`px-3 md:px-4 lg:px-5 py-1.5 md:py-2 rounded-full text-sm md:text-base lg:text-lg font-medium ${getDifficultyStyle(
                          game.difficulty
                        )}`}
                      >
                        {game.difficulty}
                      </span>
                    </div>

                    {/* Play Button */}
                    <Button className="w-full bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 shadow-soft-sm hover:shadow-soft-md transition-all duration-200 py-3 md:py-4 lg:py-5 xl:py-6">
                      <Trophy className="mr-2 md:mr-3 h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />
                      <span className="text-sm md:text-base lg:text-lg xl:text-xl font-medium">
                        Mulai Bermain
                      </span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info Section - Enhanced for larger screens */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center pt-6 md:pt-8 lg:pt-12 xl:pt-16"
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 md:p-8 lg:p-12 xl:p-16 shadow-soft-md max-w-5xl mx-auto">
            <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-800 mb-3 md:mb-4 lg:mb-6">
              Mengapa Memilih Permainan Kami?
            </h2>
            <p className="text-sm md:text-base lg:text-lg xl:text-xl text-gray-600 leading-relaxed mb-4 md:mb-6 lg:mb-8">
              Setiap permainan dirancang khusus untuk meningkatkan kemampuan
              bahasa Anda dengan cara yang menyenangkan dan interaktif.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 text-center">
              <div className="space-y-2 md:space-y-3">
                <div className="text-2xl md:text-3xl lg:text-4xl">🎯</div>
                <h3 className="font-semibold text-sm md:text-base lg:text-lg text-gray-800">
                  Pembelajaran Terarah
                </h3>
                <p className="text-xs md:text-sm lg:text-base text-gray-600">
                  Fokus pada kosakata yang paling penting
                </p>
              </div>
              <div className="space-y-2 md:space-y-3">
                <div className="text-2xl md:text-3xl lg:text-4xl">🎮</div>
                <h3 className="font-semibold text-sm md:text-base lg:text-lg text-gray-800">
                  Gamifikasi
                </h3>
                <p className="text-xs md:text-sm lg:text-base text-gray-600">
                  Belajar sambil bermain dengan sistem reward
                </p>
              </div>
              <div className="space-y-2 md:space-y-3">
                <div className="text-2xl md:text-3xl lg:text-4xl">📈</div>
                <h3 className="font-semibold text-sm md:text-base lg:text-lg text-gray-800">
                  Progress Tracking
                </h3>
                <p className="text-xs md:text-sm lg:text-base text-gray-600">
                  Pantau kemajuan belajar secara real-time
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default GameModePage
