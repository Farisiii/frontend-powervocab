import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Trash2, Check, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from './ui/alert'

const AddCardDialog = ({
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
  children,
}) => {
  const handleDialogOpen = () => {
    setNewCardData({
      id: null,
      wordPairs: [],
      title: '',
      targetDays: '',
      currentEnglish: '',
      currentIndonesian: '',
    })
    setIsFirstDialogOpen(true)
  }

  const clearCurrentInputs = () => {
    setNewCardData((prev) => ({
      ...prev,
      currentEnglish: '',
      currentIndonesian: '',
    }))
  }

  const handleAddWordPair = () => {
    if (
      newCardData.currentEnglish.trim() &&
      newCardData.currentIndonesian.trim()
    ) {
      setNewCardData((prev) => ({
        ...prev,
        wordPairs: [
          ...prev.wordPairs,
          {
            english: prev.currentEnglish.trim(),
            indonesian: prev.currentIndonesian.trim(),
            learned: false,
          },
        ],
        currentEnglish: '',
        currentIndonesian: '',
      }))
    }
  }

  // Check if there are unsaved words in the input fields
  const hasUnsavedWords = Boolean(
    newCardData.currentEnglish || newCardData.currentIndonesian
  )

  return (
    <>
      {children && <div onClick={handleDialogOpen}>{children}</div>}

      {/* First Dialog - Word Pairs */}
      <Dialog
        open={isFirstDialogOpen}
        onOpenChange={(open) => {
          if (!open && !isEditing) {
            setNewCardData({
              id: null,
              wordPairs: [],
              title: '',
              targetDays: '',
              currentEnglish: '',
              currentIndonesian: '',
            })
          }
          setIsFirstDialogOpen(open)
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Kata' : 'Tambah Kata Baru'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Kata dalam Bahasa Inggris"
                value={newCardData.currentEnglish}
                onChange={(e) =>
                  setNewCardData((prev) => ({
                    ...prev,
                    currentEnglish: e.target.value,
                  }))
                }
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddWordPair()
                  } else {
                    handleEnterKeyPress(e)
                  }
                }}
              />
              <Input
                placeholder="Kata dalam Bahasa Indonesia"
                value={newCardData.currentIndonesian}
                onChange={(e) =>
                  setNewCardData((prev) => ({
                    ...prev,
                    currentIndonesian: e.target.value,
                  }))
                }
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddWordPair()
                  } else {
                    handleEnterKeyPress(e)
                  }
                }}
              />
            </div>

            <Button
              onClick={handleAddWordPair}
              className="w-full bg-secondary-600 hover:bg-secondary-700"
              disabled={
                !newCardData.currentEnglish || !newCardData.currentIndonesian
              }
            >
              Tambah Kata
            </Button>

            <div className="max-h-64 overflow-y-auto space-y-2">
              {newCardData.wordPairs?.map((pair, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg group"
                >
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <span
                      className={`transition-colors duration-200 ${
                        pair.learned ? 'text-success-600' : ''
                      }`}
                    >
                      {pair.english}
                    </span>
                    <span
                      className={`transition-colors duration-200 ${
                        pair.learned ? 'text-success-600' : ''
                      }`}
                    >
                      {pair.indonesian}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 ${
                        pair.learned
                          ? 'text-success-500 hover:text-success-600'
                          : 'text-primary-500 hover:text-primary-600'
                      }`}
                      onClick={() => toggleWordLearned(index)}
                    >
                      <Check
                        size={16}
                        className={pair.learned ? 'opacity-100' : 'opacity-50'}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-error-500 hover:text-error-600"
                      onClick={() => removeWordPair(index)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {hasUnsavedWords && (
              <Alert variant="warning" className="bg-warning-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Ada kata yang belum ditambahkan. Silakan klik "Tambah Kata"
                  atau hapus input terlebih dahulu.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsFirstDialogOpen(false)
                if (!isEditing) {
                  setNewCardData({
                    id: null,
                    wordPairs: [],
                    title: '',
                    targetDays: '',
                    currentEnglish: '',
                    currentIndonesian: '',
                  })
                }
              }}
            >
              Batal
            </Button>
            <Button
              disabled={!newCardData.wordPairs?.length || hasUnsavedWords}
              onClick={handleFirstDialogSubmit}
              className="bg-secondary-600 hover:bg-secondary-700"
            >
              Lanjut
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Second Dialog - Card Details */}
      <Dialog
        open={isSecondDialogOpen}
        onOpenChange={(open) => {
          setIsSecondDialogOpen(open)
          if (!open && !isEditing) {
            setNewCardData({
              id: null,
              wordPairs: [],
              title: '',
              targetDays: '',
              currentEnglish: '',
              currentIndonesian: '',
            })
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Detail Kartu' : 'Detail Kartu Baru'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Judul Kartu"
              value={newCardData.title}
              onChange={(e) =>
                setNewCardData((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
            />
            <Input
              type="number"
              placeholder="Target Hari"
              value={newCardData.targetDays}
              onChange={(e) =>
                setNewCardData((prev) => ({
                  ...prev,
                  targetDays: e.target.value,
                }))
              }
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsSecondDialogOpen(false)
                if (!isEditing) {
                  setNewCardData({
                    id: null,
                    wordPairs: [],
                    title: '',
                    targetDays: '',
                    currentEnglish: '',
                    currentIndonesian: '',
                  })
                }
              }}
            >
              Batal
            </Button>
            <Button
              onClick={handleSecondDialogSubmit}
              className="bg-secondary-600 hover:bg-secondary-700"
              disabled={!newCardData.title || !newCardData.targetDays}
            >
              {isEditing ? 'Simpan' : 'Buat Kartu'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AddCardDialog
