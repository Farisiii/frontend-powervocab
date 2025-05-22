// components/CardGrid.jsx
import React from 'react'
import LearningCard from './LearningCard'
import { getGridColumns } from '@/lib/utils'

const CardGrid = ({ cards, onEdit, onDelete }) => {
  const gridColumns = getGridColumns()
  const gridColumnsClasses = Object.entries(gridColumns)
    .filter(([_, value]) => value)
    .map(([key]) => key)
    .join(' ')

  return (
    <div className={`grid ${gridColumnsClasses} gap-4 sm:gap-6`}>
      {cards.map((card) => (
        <LearningCard
          key={card.id}
          card={card}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

export default CardGrid
