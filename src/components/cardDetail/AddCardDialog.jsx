// components/AddCardDialog.jsx
import React from 'react'
import { Plus, AlertCircle, ChevronRight, Check, Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'

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

  const hasUnsavedWords = Boolean(
    newCardData.currentEnglish || newCardData.currentIndonesian
  )

  // Calculate progress statistics with proper null checks
  const wordPairs = newCardData?.wordPairs || []
  const totalWords = Array.isArray(wordPairs) ? wordPairs.length : 0
  const learnedWords = Array.isArray(wordPairs)
    ? wordPairs.filter((pair) => pair?.learned === true).length
    : 0
  const progressPercentage =
    totalWords > 0 ? Math.round((learnedWords / totalWords) * 100) : 0

  return (
    <>
      {children && <div onClick={handleDialogOpen}>{children}</div>}

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
        <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[96vw] max-w-[600px] max-h-[92vh] overflow-hidden flex flex-col bg-gradient-to-br from-white to-blue-50 border-blue-200 p-4 sm:p-6">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl sm:text-2xl font-semibold text-blue-700 text-center sm:text-left">
              {isEditing ? 'Edit Kata' : 'Tambah Kata Baru'}
            </DialogTitle>
            {/* Progress indicator - Mobile optimized */}
            {totalWords > 0 && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
                  <span className="text-blue-700 font-medium text-center sm:text-left">
                    Progress: {progressPercentage}%
                  </span>
                  <span className="text-blue-600 text-center sm:text-right">
                    {learnedWords} dari {totalWords} kata
                  </span>
                </div>
                <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            )}
          </DialogHeader>

          <div className="flex flex-col space-y-4 flex-grow overflow-hidden">
            {/* Input fields - Mobile responsive */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <Input
                placeholder="Kata Inggris"
                className="bg-white focus:ring-2 focus:ring-blue-200 border-blue-200 h-10 sm:h-9"
                value={newCardData.currentEnglish || ''}
                onChange={(e) => {
                  if (e.target.value.length <= 10) {
                    setNewCardData((prev) => ({
                      ...prev,
                      currentEnglish: e.target.value,
                    }))
                  }
                }}
                onKeyPress={handleEnterKeyPress}
                maxLength={10}
              />
              <Input
                placeholder="Kata Indonesia"
                className="bg-white focus:ring-2 focus:ring-blue-200 border-blue-200 h-10 sm:h-9"
                value={newCardData.currentIndonesian || ''}
                onChange={(e) => {
                  if (e.target.value.length <= 10) {
                    setNewCardData((prev) => ({
                      ...prev,
                      currentIndonesian: e.target.value,
                    }))
                  }
                }}
                onKeyPress={handleEnterKeyPress}
                maxLength={10}
              />
            </div>

            <Button
              onClick={addWordPair}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white shadow-sm h-10 sm:h-9"
              disabled={
                !newCardData.currentEnglish || !newCardData.currentIndonesian
              }
            >
              <Plus size={18} className="mr-2" />
              Tambah Kata
            </Button>

            {/* Word pairs list - Mobile optimized */}
            <div className="flex-grow overflow-hidden">
              <div className="h-[240px] sm:h-[280px] overflow-y-auto space-y-2 rounded-lg pr-1">
                {wordPairs.map((pair, index) => (
                  <div
                    key={`word-pair-${index}`}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg group transition-all duration-300 border-2 ${
                      pair.learned
                        ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-300 shadow-md hover:shadow-lg hover:from-green-100 hover:to-green-200'
                        : 'bg-gradient-to-r from-white to-orange-50 border-orange-200 hover:border-orange-300 hover:from-orange-50 hover:to-orange-100 shadow-sm hover:shadow-md'
                    }`}
                  >
                    {/* Word content - Mobile stacked */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-2 sm:mb-0">
                      <span
                        className={`font-medium transition-all duration-300 text-center sm:text-left ${
                          pair.learned
                            ? 'text-green-700 font-semibold'
                            : 'text-blue-700'
                        }`}
                      >
                        {pair.english}
                        {pair.learned && (
                          <Check className="inline-block w-4 h-4 ml-2 text-green-600" />
                        )}
                      </span>
                      <span
                        className={`font-medium transition-all duration-300 text-center sm:text-left ${
                          pair.learned
                            ? 'text-green-700 font-semibold'
                            : 'text-blue-700'
                        }`}
                      >
                        {pair.indonesian}
                        {pair.learned && (
                          <Check className="inline-block w-4 h-4 ml-2 text-green-600" />
                        )}
                      </span>
                    </div>

                    {/* Action buttons - Mobile centered */}
                    <div className="flex items-center justify-center sm:justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 sm:h-9 sm:w-9 rounded-full transition-all duration-300 transform hover:scale-110 ${
                          pair.learned
                            ? 'bg-green-200 text-green-700 hover:bg-green-300 hover:text-green-800 shadow-md'
                            : 'text-blue-400 hover:text-green-600 hover:bg-green-100 border-2 border-transparent hover:border-green-300'
                        }`}
                        onClick={() => toggleWordLearned(index)}
                        title={
                          pair.learned
                            ? 'Tandai belum dipelajari'
                            : 'Tandai sudah dipelajari'
                        }
                      >
                        <Check
                          size={16}
                          className={`transition-all duration-300 ${
                            pair.learned
                              ? 'opacity-100 scale-110'
                              : 'opacity-60 scale-100'
                          }`}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 sm:h-9 sm:w-9 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 border-2 border-transparent hover:border-red-300 transition-all duration-300 transform hover:scale-110"
                        onClick={() => removeWordPair(index)}
                        title="Hapus kata"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Empty state */}
                {totalWords === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center py-6 sm:py-8">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                      <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
                    </div>
                    <p className="text-blue-600 font-medium text-sm sm:text-base">
                      Belum ada kata yang ditambahkan
                    </p>
                    <p className="text-blue-500 text-xs sm:text-sm mt-1">
                      Tambahkan kata pertama Anda!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {hasUnsavedWords && (
              <Alert
                variant="warning"
                className="bg-yellow-50 border-yellow-200 border-2"
              >
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-700 font-medium text-sm">
                  Ada kata yang belum ditambahkan. Silakan klik "Tambah Kata"
                  atau hapus input terlebih dahulu.
                </AlertDescription>
              </Alert>
            )}

            {/* Summary stats - Mobile optimized */}
            {totalWords > 0 && (
              <div className="grid grid-cols-3 gap-2 sm:gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-center">
                  <p className="text-base sm:text-lg font-bold text-blue-700">
                    {totalWords}
                  </p>
                  <p className="text-xs text-blue-600">Total</p>
                </div>
                <div className="text-center">
                  <p className="text-base sm:text-lg font-bold text-green-600">
                    {learnedWords}
                  </p>
                  <p className="text-xs text-green-600">Dipelajari</p>
                </div>
                <div className="text-center">
                  <p className="text-base sm:text-lg font-bold text-orange-600">
                    {totalWords - learnedWords}
                  </p>
                  <p className="text-xs text-orange-600">Tersisa</p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 mt-4 sm:mt-6">
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
              className="w-full sm:w-auto border-blue-200 text-blue-700 hover:bg-blue-50 order-2 sm:order-1"
            >
              Batal
            </Button>
            <Button
              disabled={totalWords === 0 || hasUnsavedWords}
              onClick={handleFirstDialogSubmit}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white order-1 sm:order-2"
            >
              Lanjut
              <ChevronRight size={16} className="ml-2" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
        <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[96vw] max-w-[440px] bg-gradient-to-br from-white to-blue-50 border-blue-200 p-4 sm:p-6">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl sm:text-2xl font-semibold text-blue-700 text-center sm:text-left">
              {isEditing ? 'Edit Detail Kartu' : 'Detail Kartu Baru'}
            </DialogTitle>
            {/* Progress summary in second dialog - Mobile optimized */}
            {totalWords > 0 && (
              <div className="p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <p className="text-sm font-semibold text-blue-700">
                      {totalWords} Kata
                    </p>
                    <p className="text-xs text-blue-600">Total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-green-600">
                      {learnedWords} Dipelajari
                    </p>
                    <p className="text-xs text-green-600">
                      {progressPercentage}% Progress
                    </p>
                  </div>
                </div>
              </div>
            )}
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-700">
                Judul Kartu
              </label>
              <Input
                placeholder="Masukkan judul kartu"
                className="bg-white focus:ring-2 focus:ring-blue-200 border-blue-200 h-10 sm:h-9"
                value={newCardData.title || ''}
                onChange={(e) => {
                  if (e.target.value.length <= 15) {
                    setNewCardData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                }}
                maxLength={15}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-700">
                Target Hari
              </label>
              <Input
                type="number"
                placeholder="Masukkan target hari"
                className="bg-white focus:ring-2 focus:ring-blue-200 border-blue-200 h-10 sm:h-9"
                value={newCardData.targetDays || ''}
                onChange={(e) =>
                  setNewCardData((prev) => ({
                    ...prev,
                    targetDays: e.target.value,
                  }))
                }
                min="1"
                max="365"
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
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
              className="w-full sm:w-auto border-blue-200 text-blue-700 hover:bg-blue-50 order-2 sm:order-1"
            >
              Batal
            </Button>
            <Button
              onClick={handleSecondDialogSubmit}
              className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white order-1 sm:order-2"
              disabled={!newCardData.title || !newCardData.targetDays}
            >
              {isEditing ? 'Simpan Perubahan' : 'Buat Kartu'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AddCardDialog
