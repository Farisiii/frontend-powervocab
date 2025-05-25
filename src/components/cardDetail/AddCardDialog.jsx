// components/AddCardDialog.jsx - UPDATED WITH SOLID COLORS
import React from 'react'
import {
  Plus,
  AlertCircle,
  ChevronRight,
  Trash2,
  BookOpen,
  Target,
  Sparkles,
} from 'lucide-react'
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
  const learnedWords = wordPairs.filter((pair) => pair.learned).length
  const unlearnedWords = totalWords - learnedWords

  return (
    <>
      {children && <div onClick={handleDialogOpen}>{children}</div>}

      {/* First Dialog - Add Words */}
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
        <DialogContent className="w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[75vw] xl:w-[70vw] max-w-[800px] h-[90vh] bg-white shadow-2xl border-0 rounded-2xl overflow-hidden">
          {/* Header with solid background */}
          <div className="bg-primary-600 p-4 sm:p-6 rounded-t-2xl flex-shrink-0">
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center flex items-center justify-center gap-2 sm:gap-3">
                {isEditing ? 'Edit Kata' : 'Tambah Kata Baru'}
              </DialogTitle>
            </DialogHeader>

            {/* Statistics Cards */}
            {totalWords > 0 && (
              <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-primary-700 rounded-xl p-3 sm:p-4 text-center border border-primary-500">
                  <div className="text-2xl sm:text-3xl font-bold text-white">
                    {totalWords}
                  </div>
                  <div className="text-primary-100 text-xs sm:text-sm font-medium">
                    Total Kata
                  </div>
                </div>

                {learnedWords > 0 && (
                  <div className="bg-success-600 rounded-xl p-3 sm:p-4 text-center border border-success-500">
                    <div className="text-2xl sm:text-3xl font-bold text-white">
                      {learnedWords}
                    </div>
                    <div className="text-success-100 text-xs sm:text-sm font-medium">
                      Sudah Dipelajari
                    </div>
                  </div>
                )}

                {unlearnedWords > 0 && (
                  <div className="bg-error-600 rounded-xl p-3 sm:p-4 text-center border border-error-500">
                    <div className="text-2xl sm:text-3xl font-bold text-white">
                      {unlearnedWords}
                    </div>
                    <div className="text-error-100 text-xs sm:text-sm font-medium">
                      Belum Dipelajari
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Input Section */}
              <div className="bg-primary-50 rounded-2xl p-4 sm:p-6 border border-primary-200">
                <h3 className="text-lg sm:text-xl font-semibold text-primary-800 mb-4 text-center">
                  Tambahkan Kata Baru
                </h3>

                <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary-700 flex items-center gap-2">
                      Kata Inggris
                    </label>
                    <Input
                      placeholder="Masukkan kata Inggris"
                      className="bg-white border-2 border-primary-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 rounded-xl h-12 text-base font-medium shadow-sm transition-all duration-300"
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
                    <div className="text-xs text-primary-500 text-right">
                      {newCardData.currentEnglish?.length || 0}/10
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-secondary-700 flex items-center gap-2">
                      Kata Indonesia
                    </label>
                    <Input
                      placeholder="Masukkan kata Indonesia"
                      className="bg-white border-2 border-secondary-300 focus:border-secondary-500 focus:ring-4 focus:ring-secondary-100 rounded-xl h-12 text-base font-medium shadow-sm transition-all duration-300"
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
                    <div className="text-xs text-secondary-500 text-right">
                      {newCardData.currentIndonesian?.length || 0}/10
                    </div>
                  </div>
                </div>

                <Button
                  onClick={addWordPair}
                  className="w-full mt-4 bg-accent-600 hover:bg-accent-700 text-white shadow-lg hover:shadow-xl rounded-xl h-12 text-base font-semibold transition-all duration-300 transform hover:scale-[1.02]"
                  disabled={
                    !newCardData.currentEnglish ||
                    !newCardData.currentIndonesian
                  }
                >
                  <Plus size={20} className="mr-2" />
                  Tambah Kata
                </Button>
              </div>

              {/* Word List */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800">
                  Daftar Kata ({totalWords})
                </h3>

                <div className="space-y-3 max-h-[400px] overflow-y-auto bg-gray-50 rounded-2xl border-2 border-gray-200 p-3 sm:p-4">
                  {wordPairs.map((pair, index) => (
                    <div
                      key={`word-pair-${pair.id || index}`}
                      className={`relative group transition-all duration-300 rounded-2xl p-4 sm:p-5 shadow-md hover:shadow-lg transform hover:scale-[1.02] border-2 ${
                        pair.learned
                          ? 'bg-success-50 border-success-300 hover:border-success-400'
                          : 'bg-error-50 border-error-300 hover:border-error-400'
                      }`}
                    >
                      {/* Status Badge */}
                      <div className="absolute -top-2 -right-2 z-10">
                        <div
                          className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border-3 border-white shadow-lg ${
                            pair.learned ? 'bg-success-500' : 'bg-error-500'
                          }`}
                          title={
                            pair.learned
                              ? 'Sudah dipelajari'
                              : 'Belum dipelajari'
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Word Content */}
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                          <div className="text-center sm:text-left">
                            <div className="text-xs font-medium text-gray-500 mb-1">
                              Bahasa Inggris
                            </div>
                            <div
                              className={`text-lg sm:text-xl font-bold ${
                                pair.learned
                                  ? 'text-success-700'
                                  : 'text-error-700'
                              }`}
                            >
                              {pair.english}
                            </div>
                          </div>
                          <div className="text-center sm:text-left">
                            <div className="text-xs font-medium text-gray-500 mb-1">
                              Bahasa Indonesia
                            </div>
                            <div
                              className={`text-lg sm:text-xl font-bold ${
                                pair.learned
                                  ? 'text-success-700'
                                  : 'text-error-700'
                              }`}
                            >
                              {pair.indonesian}
                            </div>
                          </div>
                        </div>

                        {/* Delete Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-3 sm:ml-4 h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-white hover:bg-error-100 text-error-500 hover:text-error-600 border-2 border-transparent hover:border-error-200 transition-all duration-300 transform hover:scale-110 shadow-md"
                          onClick={() => removeWordPair(index)}
                          title="Hapus kata"
                        >
                          <Trash2 size={16} className="sm:size-[18px]" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* Empty State */}
                  {totalWords === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                        <Plus className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-700 mb-2">
                        Belum ada kata
                      </h3>
                      <p className="text-gray-500 text-sm sm:text-base max-w-xs">
                        Mulai tambahkan kata-kata untuk membangun koleksi
                        pembelajaran Anda!
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Unsaved Words Warning */}
              {hasUnsavedWords && (
                <Alert className="bg-warning-50 border-2 border-warning-300 rounded-xl">
                  <AlertCircle className="h-5 w-5 text-warning-600" />
                  <AlertDescription className="text-warning-800 font-medium text-sm sm:text-base">
                    ⚠️ Ada kata yang belum ditambahkan. Klik "Tambah Kata" untuk
                    menyimpannya!
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="flex-shrink-0 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 p-4 sm:p-6 bg-gray-50 rounded-b-2xl border-t border-gray-200">
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
              className="w-full sm:w-auto border-2 border-gray-300 text-gray-700 hover:bg-gray-100 rounded-xl h-12 font-semibold transition-all duration-300"
            >
              Batal
            </Button>
            <Button
              disabled={totalWords === 0 || hasUnsavedWords}
              onClick={handleFirstDialogSubmit}
              className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white rounded-xl h-12 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Lanjut ke Detail
              <ChevronRight size={18} className="ml-2" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Second Dialog - Card Details - FULLY RESPONSIVE NOW */}
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
        <DialogContent className="w-[95vw] sm:w-[90vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw] max-w-[650px] max-h-[90vh] bg-white shadow-2xl border-0 rounded-2xl overflow-hidden">
          {/* Header - RESPONSIVE */}
          <div className="bg-success-600 p-3 sm:p-4 md:p-6 rounded-t-2xl flex-shrink-0">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white text-center flex items-center justify-center gap-2 flex-wrap">
                <span className="text-center">
                  {isEditing ? 'Edit Detail Kartu' : 'Detail Kartu Baru'}
                </span>
              </DialogTitle>
            </DialogHeader>

            {/* Summary Cards - RESPONSIVE */}
            {totalWords > 0 && (
              <div className="mt-3 sm:mt-4 md:mt-6 space-y-2 sm:space-y-3">
                <div className="bg-success-700 rounded-xl p-3 sm:p-4 text-center border border-success-500">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">
                    {totalWords}
                  </div>
                  <div className="text-success-100 text-xs sm:text-sm font-medium">
                    Kata Siap untuk Dipelajari
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Scrollable Form Content - RESPONSIVE */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
              {/* Title Input - RESPONSIVE */}
              <div className="space-y-2 sm:space-y-3">
                <label className="text-sm sm:text-base md:text-lg font-semibold text-gray-700 flex items-center gap-2">
                  <span>Judul Kartu</span>
                </label>
                <Input
                  placeholder="Masukkan judul kartu yang menarik"
                  className="bg-primary-50 border-2 border-primary-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 rounded-xl h-10 sm:h-12 text-sm sm:text-base font-medium shadow-sm transition-all duration-300"
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
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-xs text-gray-500">
                  <span>Buat judul yang mudah diingat</span>
                  <span>{newCardData.title?.length || 0}/15</span>
                </div>
              </div>

              {/* Target Days Input - RESPONSIVE */}
              <div className="space-y-2 sm:space-y-3">
                <label className="text-sm sm:text-base md:text-lg font-semibold text-gray-700 flex items-center gap-2">
                  <span>Target Hari</span>
                </label>
                <Input
                  type="number"
                  placeholder="Berapa hari untuk menyelesaikan?"
                  className="bg-success-50 border-2 border-success-300 focus:border-success-500 focus:ring-4 focus:ring-success-100 rounded-xl h-10 sm:h-12 text-sm sm:text-base font-medium shadow-sm transition-all duration-300"
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
                <div className="text-xs text-gray-500 leading-relaxed">
                  💡 <span className="font-medium">Tip:</span> 7-30 hari cocok
                  untuk pemula, 1-7 hari untuk intensif
                </div>
              </div>
            </div>
          </div>

          {/* Footer - RESPONSIVE */}
          <DialogFooter className="flex-shrink-0 flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 md:gap-4 p-3 sm:p-4 md:p-6 bg-gray-50 rounded-b-2xl border-t border-gray-200">
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
              className="w-full sm:w-auto border-2 border-gray-300 text-gray-700 hover:bg-gray-100 rounded-xl h-10 sm:h-12 text-sm sm:text-base font-semibold transition-all duration-300"
            >
              Batal
            </Button>
            <Button
              onClick={handleSecondDialogSubmit}
              className="w-full sm:w-auto bg-success-600 hover:bg-success-700 text-white rounded-xl h-10 sm:h-12 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={!newCardData.title || !newCardData.targetDays}
            >
              <span className="flex items-center gap-1 sm:gap-2">
                <span>{isEditing ? 'Simpan Perubahan' : 'Buat Kartu'}</span>
              </span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AddCardDialog
