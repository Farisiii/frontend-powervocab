import React from 'react'
import { Book, Calendar, Trash2, Edit2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const LearningCard = ({ card, onDelete, onEdit }) => {
  const getProgressColor = (progress) => {
    if (progress < 30) return 'bg-error-400'
    if (progress < 70) return 'bg-warning-400'
    return 'bg-success-400'
  }

  return (
    <Card className="relative group border-secondary-200 hover:border-secondary-300 transition-all duration-200 hover:shadow-md">
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary-500 hover:text-primary-600 hover:bg-primary-100"
            onClick={() => onEdit(card)}
          >
            <Edit2 size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-error-500 hover:text-error-600 hover:bg-error-100"
            onClick={() => onDelete(card.id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      <CardHeader>
        <CardTitle className="text-lg text-primary-600 pr-16">
          {card.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-primary-500">Progress</span>
            <span className="text-sm font-medium text-primary-600">
              {card.progress}%
            </span>
          </div>
          <div className="w-full bg-secondary-100 rounded-full h-2.5">
            <div
              className={`${getProgressColor(
                card.progress
              )} h-2.5 rounded-full transition-all duration-300`}
              style={{ width: `${card.progress}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-primary-500">
            <Book size={16} />
            <span className="text-sm">{card.totalWords} kata</span>
          </div>

          <div className="flex items-center gap-2 text-primary-500">
            <Calendar size={16} />
            <span className="text-sm">{card.targetDays} hari</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default LearningCard
