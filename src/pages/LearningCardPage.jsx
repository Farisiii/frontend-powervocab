// pages/LearningCardsPage.jsx
import React from 'react'
import { Loader2 } from 'lucide-react'
import { useCardManagement } from '@/hook/useCardManagement'
import DeleteCardDialog from '@/components/cardDetail/DeleteCardDialog'
import EmptyCardState from '@/components/cardDetail/EmptyCardState'
import CardGrid from '@/components/cardDetail/CardGrid'
import Header from '@/components/cardDetail/Header'

const LearningCardsPage = () => {
  const {
    cards,
    isLoading,
    isFirstDialogOpen,
    isSecondDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    newCardData,
    setNewCardData,
    setIsFirstDialogOpen,
    setIsSecondDialogOpen,
    handleDeleteCard,
    confirmDelete,
    handleEditCard,
    addWordPair,
    removeWordPair,
    toggleWordLearned,
    handleFirstDialogSubmit,
    handleSecondDialogSubmit,
    handleEnterKeyPress,
    isEditing,
  } = useCardManagement()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-primary-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-primary-700 text-lg font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary-100">
      <Header
        cardCount={cards.length}
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
      />

      <main className="w-full mx-auto px-3 sm:px-6 lg:px-8 pt-20 sm:pt-32 pb-8 sm:pb-12">
        {cards.length === 0 ? (
          <EmptyCardState
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
          />
        ) : (
          <CardGrid
            cards={cards}
            onEdit={handleEditCard}
            onDelete={handleDeleteCard}
          />
        )}
      </main>

      <DeleteCardDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default LearningCardsPage
