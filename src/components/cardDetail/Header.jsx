// components/Header.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import AddCardDialog from './AddCardDialog'

const Header = ({
  cardCount,
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
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-20">
      <div className="w-full mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 sm:py-4">
          <div>
            <h1 className="text-lg sm:text-2xl font-bold bg-primary-500 bg-clip-text text-transparent">
              Kartu Pembelajaran
            </h1>
            <p className="text-xs sm:text-base text-primary-600 mt-0.5">
              {cardCount} kartu tersedia
            </p>
          </div>

          <div className="flex items-center gap-2">
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
              <Button className="bg-primary-600 hover:bg-primary-700 text-white shadow-sm text-xs sm:text-base py-1.5 px-3 sm:px-4">
                <Plus size={14} className="sm:size-4" />
                <span className="hidden sm:inline">Tambah Kartu</span>
                <span className="sm:hidden">Tambah</span>
              </Button>
            </AddCardDialog>

            <Button
              onClick={handleLogout}
              className="flex items-center gap-1 sm:gap-2 bg-error-500 hover:bg-error-600 text-white shadow-sm text-xs sm:text-base py-1.5 px-3 sm:px-4"
            >
              <LogOut size={14} className="sm:size-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
