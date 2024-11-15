import React from 'react'
import { ArrowRight, X } from 'lucide-react'
import { DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Input } from './ui/input'

const FirstDialog = ({
  newCardData,
  setNewCardData,
  addWordPair,
  removeWordPair,
  handleFirstDialogSubmit,
  handleEnterKeyPress,
}) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Masukkan Pasangan Kata</DialogTitle>
      </DialogHeader>
      <div className="space-y-6">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <Label htmlFor="english">Kata Bahasa Inggris</Label>
            <Input
              id="english"
              placeholder="Contoh: Apple"
              value={newCardData.currentEnglish}
              onChange={(e) =>
                setNewCardData({
                  ...newCardData,
                  currentEnglish: e.target.value,
                })
              }
              onKeyPress={handleEnterKeyPress}
              className="border-primary-200 focus:border-primary-400"
            />
          </div>
          <ArrowRight className="mb-3 text-primary-300" />
          <div className="flex-1">
            <Label htmlFor="indonesian">Kata Bahasa Indonesia</Label>
            <Input
              id="indonesian"
              placeholder="Contoh: Apel"
              value={newCardData.currentIndonesian}
              onChange={(e) =>
                setNewCardData({
                  ...newCardData,
                  currentIndonesian: e.target.value,
                })
              }
              onKeyPress={handleEnterKeyPress}
              className="border-primary-200 focus:border-primary-400"
            />
          </div>
          <Button
            onClick={addWordPair}
            className="mb-0.5 bg-secondary-500 hover:bg-secondary-600"
          >
            Tambah
          </Button>
        </div>

        <div className="max-h-64 overflow-y-auto border rounded-lg p-4 border-primary-100">
          <div className="space-y-2">
            {newCardData.wordPairs.length === 0 ? (
              <p className="text-center text-primary-400 py-4">
                Belum ada kata yang ditambahkan
              </p>
            ) : (
              newCardData.wordPairs.map((pair, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-accent-50 p-2 rounded"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <span className="text-primary-600 min-w-8">
                      {index + 1}.
                    </span>
                    <span className="flex-1">{pair.english}</span>
                    <ArrowRight className="text-primary-300" />
                    <span className="flex-1">{pair.indonesian}</span>
                  </div>
                  <button
                    onClick={() => removeWordPair(index)}
                    className="p-1 hover:bg-error-100 rounded-full text-error-500"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-between items-center py-2">
          <span className="text-sm text-primary-600">
            Total kata: {newCardData.wordPairs.length}
          </span>
          <Button
            onClick={handleFirstDialogSubmit}
            disabled={newCardData.wordPairs.length === 0}
            className="bg-secondary-600 hover:bg-secondary-700"
          >
            Lanjut
          </Button>
        </div>
      </div>
    </>
  )
}

export default FirstDialog
