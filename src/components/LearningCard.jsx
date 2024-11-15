import React from 'react'
import { Book, Calendar, Trash2, Edit2, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const LearningCard = ({ card, onDelete, onEdit }) => {
  const navigate = useNavigate()

  const getProgressColor = (progress) => {
    if (progress < 30) return 'bg-error-600'
    if (progress < 70) return 'bg-warning-500'
    return 'bg-success-600'
  }

  const handleCardClick = (e) => {
    if (e.target.closest('button')) {
      return
    }
    navigate(`/cards/${card.id}`)
  }

  return (
    <Card
      className="relative group border-accent-200 hover:border-primary-400 transition-all duration-200 hover:shadow-lg cursor-pointer h-full"
      onClick={handleCardClick}
    >
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary-400 hover:text-primary-500 hover:bg-primary-50"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(card)
            }}
          >
            <Edit2 size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-error-600 hover:text-error-700 hover:bg-error-50"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(card.id)
            }}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      <CardHeader>
        <CardTitle className="text-xl text-primary-400 pr-16 flex justify-between items-center">
          <span>{card.title}</span>
          <ArrowRight
            size={20}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-primary-300"
          />
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between mb-3">
            <span className="text-base text-primary-300">Progress</span>
            <span className="text-base font-medium text-primary-400">
              {card.progress}%
            </span>
          </div>
          <div className="w-full bg-accent-100 rounded-full h-3">
            <div
              className={`${getProgressColor(
                card.progress
              )} h-3 rounded-full transition-all duration-300`}
              style={{ width: `${card.progress}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-center gap-3 text-primary-300">
            <Book size={20} />
            <span className="text-base">{card.totalWords} kata</span>
          </div>

          <div className="flex items-center gap-3 text-primary-300">
            <Calendar size={20} />
            <span className="text-base">{card.targetDays} hari</span>
          </div>
        </div>
      </CardContent>

      <div className="absolute inset-0 bg-primary-400 opacity-0 group-hover:opacity-5 transition-opacity duration-200 rounded-lg pointer-events-none" />
    </Card>
  )
}

export default LearningCard
