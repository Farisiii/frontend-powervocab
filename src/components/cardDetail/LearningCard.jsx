// components/LearningCard.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Edit2,
  Trash2,
  Book,
  Calendar,
  ChevronRight,
  PlayCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const LearningCard = ({ card, onDelete, onEdit }) => {
  const navigate = useNavigate()

  const getProgressColor = (progress) => {
    if (progress < 30) return 'bg-error-500'
    if (progress < 70) return 'bg-warning-500'
    return 'bg-success-500'
  }

  const getProgressBgColor = (progress) => {
    if (progress < 30) return 'bg-error-100'
    if (progress < 70) return 'bg-warning-100'
    return 'bg-success-100'
  }

  const getProgressTextColor = (progress) => {
    if (progress < 30) return 'text-error-600'
    if (progress < 70) return 'text-warning-600'
    return 'text-success-600'
  }

  const handleCardClick = (e) => {
    if (e.target.closest('button')) return
    navigate(`/cards/${card.id}`)
  }

  const handleStartLearning = (e) => {
    e.stopPropagation()
    navigate(`/cards/${card.id}`)
  }

  return (
    <Card
      className="group relative overflow-hidden border-2 border-primary-100 hover:border-primary-300 transition-all duration-300 hover:shadow-lg cursor-pointer bg-white h-full hover:-translate-y-1"
      onClick={handleCardClick}
    >
      {/* Action Buttons */}
      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 md:h-10 md:w-10 bg-white/90 backdrop-blur-sm hover:bg-primary-50 text-primary-600 hover:text-primary-700 rounded-full shadow-md border border-primary-200"
          onClick={(e) => {
            e.stopPropagation()
            onEdit(card)
          }}
        >
          <Edit2 size={14} className="md:w-4 md:h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 md:h-10 md:w-10 bg-white/90 backdrop-blur-sm hover:bg-error-50 text-error-500 hover:text-error-600 rounded-full shadow-md border border-error-200"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(card.id)
          }}
        >
          <Trash2 size={14} className="md:w-4 md:h-4" />
        </Button>
      </div>

      {/* Header with improved typography */}
      <CardHeader className="pb-4 px-6 pt-6 md:px-8 md:pt-8">
        <div className="flex items-start justify-between mb-2">
          <div className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-xl bg-primary-100 flex items-center justify-center mb-3">
            <Book className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-primary-600" />
          </div>
        </div>
        <CardTitle className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-primary-800 line-clamp-2 leading-tight mb-1 md:mb-3">
          {card.title}
        </CardTitle>
        <p className="text-sm md:text-base lg:text-lg text-primary-500 font-medium">
          Learning Card
        </p>
      </CardHeader>

      <CardContent className="space-y-6 md:space-y-8 px-6 pb-6 md:px-8 md:pb-8">
        {/* Progress Section with better visual design */}
        <div className="space-y-3 md:space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm md:text-base lg:text-lg font-semibold text-primary-700">
              Progress Belajar
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold ${getProgressTextColor(
                  card.progress
                )}`}
              >
                {card.progress}%
              </span>
            </div>
          </div>

          <div className="relative">
            <div
              className={`w-full h-3 md:h-4 lg:h-5 ${getProgressBgColor(
                card.progress
              )} rounded-full overflow-hidden`}
            >
              <div
                className={`${getProgressColor(
                  card.progress
                )} h-full rounded-full transition-all duration-700 ease-out relative`}
                style={{ width: `${card.progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid with better spacing */}
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          <div className="flex flex-col items-center p-4 md:p-6 lg:p-8 rounded-xl bg-accent-50 border border-accent-100">
            <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full bg-accent-500 flex items-center justify-center mb-2 md:mb-3">
              <Book
                size={18}
                className="md:w-6 md:h-6 lg:w-7 lg:h-7 text-white"
              />
            </div>
            <span className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-accent-700 mb-1 md:mb-2">
              {card.totalWords}
            </span>
            <span className="text-xs md:text-sm lg:text-base font-medium text-accent-600 text-center">
              Total Kata
            </span>
          </div>

          <div className="flex flex-col items-center p-4 md:p-6 lg:p-8 rounded-xl bg-secondary-50 border border-secondary-100">
            <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full bg-secondary-500 flex items-center justify-center mb-2 md:mb-3">
              <Calendar
                size={18}
                className="md:w-6 md:h-6 lg:w-7 lg:h-7 text-white"
              />
            </div>
            <span className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-secondary-700 mb-1 md:mb-2">
              {card.targetDays}
            </span>
            <span className="text-xs md:text-sm lg:text-base font-medium text-secondary-600 text-center">
              Target Hari
            </span>
          </div>
        </div>

        {/* CTA Button with better design */}
        <Button
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 md:py-4 lg:py-5 px-4 md:px-6 rounded-xl transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-3 md:gap-4 text-base md:text-lg lg:text-xl group/btn"
          onClick={handleStartLearning}
        >
          <PlayCircle
            size={20}
            className="md:w-6 md:h-6 lg:w-7 lg:h-7 group-hover/btn:scale-110 transition-transform duration-200"
          />
          <span>Mulai Belajar</span>
          <ChevronRight
            size={16}
            className="md:w-5 md:h-5 lg:w-6 lg:h-6 group-hover/btn:translate-x-1 transition-transform duration-200"
          />
        </Button>
      </CardContent>

      {/* Subtle accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 md:h-1.5 bg-primary-200 group-hover:bg-primary-400 transition-colors duration-300"></div>
    </Card>
  )
}

export default LearningCard
