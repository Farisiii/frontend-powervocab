// components/EmptyCardState.jsx
import React from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import AddCardDialog from './AddCardDialog'

const EmptyCardState = ({
  isFirstDialogOpen,
  isSecondDialogOpen,
  setIsFirstDialogOpen,
  setIsSecondDialogOpen,
  newCardData,
  setNewCardData,
  addWordPair,
  removeWordPair,
  toggleWordLearned,
  handleFirstDialogSubmit,
  handleSecondDialogSubmit,
  handleEnterKeyPress,
  isEditing,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-6 sm:py-12 px-3 sm:px-4 text-center">
      <div className="w-full max-w-md">
        <div className="rounded-xl sm:rounded-2xl bg-white shadow-sm border border-primary-100 bg-gradient-to-br from-white to-primary-50">
          <div className="p-4 sm:p-8">
            <p className="text-sm sm:text-lg text-primary-700 mb-3 sm:mb-6">
              Belum ada kartu pembelajaran
            </p>
            <AddCardDialog
              isFirstDialogOpen={isFirstDialogOpen}
              isSecondDialogOpen={isSecondDialogOpen}
              setIsFirstDialogOpen={setIsFirstDialogOpen}
              setIsSecondDialogOpen={setIsSecondDialogOpen}
              newCardData={newCardData}
              setNewCardData={setNewCardData}
              addWordPair={addWordPair}
              removeWordPair={removeWordPair}
              toggleWordLearned={toggleWordLearned}
              handleFirstDialogSubmit={handleFirstDialogSubmit}
              handleSecondDialogSubmit={handleSecondDialogSubmit}
              handleEnterKeyPress={handleEnterKeyPress}
              isEditing={isEditing}
            >
              <Button className="w-full bg-gradient-to-r from-accent-600 to-primary-600 hover:from-accent-700 hover:to-primary-700 text-white shadow-sm py-3 rounded-lg">
                <Plus size={18} className="mr-2" />
                Buat Kartu Baru
              </Button>
            </AddCardDialog>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmptyCardState
