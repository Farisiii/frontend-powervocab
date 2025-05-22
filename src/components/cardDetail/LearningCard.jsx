// components/LearningCard.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Edit2, Trash2, Book, Calendar, ChevronRight } from 'lucide-react'
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
    if (progress < 30) return 'bg-error-50'
    if (progress < 70) return 'bg-warning-50'
    return 'bg-success-50'
  }

  const handleCardClick = (e) => {
    if (e.target.closest('button')) return
    navigate(`/cards/${card.id}`)
  }

  const handleStartLearning = (e) => {
    e.stopPropagation() // Prevent card click event
    navigate(`/cards/${card.id}`)
  }

  return (
    <Card
      className="relative overflow-hidden border border-primary-100 hover:border-primary-300 transition-all duration-300 hover:shadow-md cursor-pointer bg-gradient-to-br from-white to-primary-50 shadow-soft-sm h-full"
      onClick={handleCardClick}
    >
      <div className="absolute top-2 right-2 flex gap-1 sm:gap-2 opacity-100 transition-all duration-300 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 sm:h-8 sm:w-8 bg-white hover:bg-primary-50 text-primary-600 hover:text-primary-700 rounded-full shadow-sm"
          onClick={(e) => {
            e.stopPropagation()
            onEdit(card)
          }}
        >
          <Edit2 size={12} className="sm:w-4 sm:h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 sm:h-8 sm:w-8 bg-white hover:bg-error-50 text-error-500 hover:text-error-600 rounded-full shadow-sm"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(card.id)
          }}
        >
          <Trash2 size={12} className="sm:w-4 sm:h-4" />
        </Button>
      </div>

      <CardHeader className="pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
        <CardTitle className="text-base sm:text-lg font-semibold text-primary-700 line-clamp-2">
          {card.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-4">
        <div>
          <div className="flex justify-between mb-1 sm:mb-2">
            <span className="text-xs sm:text-sm font-medium text-primary-600">
              Progress
            </span>
            <span className="text-xs sm:text-sm font-semibold text-primary-700">
              {card.progress}%
            </span>
          </div>
          <div
            className={`w-full h-1.5 sm:h-2 ${getProgressBgColor(
              card.progress
            )} rounded-full overflow-hidden`}
          >
            <div
              className={`${getProgressColor(
                card.progress
              )} h-full rounded-full transition-all duration-500 ease-out`}
              style={{ width: `${card.progress}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-accent-50">
            <Book size={12} className="sm:w-4 sm:h-4 text-accent-500" />
            <span className="text-xs font-medium text-accent-700">
              {card.totalWords} kata
            </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-accent-50">
            <Calendar size={12} className="sm:w-4 sm:h-4 text-accent-500" />
            <span className="text-xs font-medium text-accent-700">
              {card.targetDays} hari
            </span>
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full flex items-center justify-between text-primary-600 hover:text-primary-700 hover:bg-primary-100 text-xs sm:text-sm py-1.5 sm:py-2"
          onClick={handleStartLearning}
        >
          <span>Mulai Belajar</span>
          <ChevronRight size={12} className="sm:w-4 sm:h-4" />
        </Button>
      </CardContent>
    </Card>
  )
}

export default LearningCard
