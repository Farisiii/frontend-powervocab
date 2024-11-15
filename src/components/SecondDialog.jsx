// SecondDialog.jsx
import React, { useState } from 'react'
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

const SecondDialog = ({
  newCardData,
  setNewCardData,
  handleSecondDialogSubmit,
  setIsSecondDialogOpen,
  setIsFirstDialogOpen,
}) => {
  const [error, setError] = useState('')

  const handleTargetDaysChange = (e) => {
    const value = e.target.value
    // Allow empty value or positive numbers
    if (value === '' || (Number(value) > 0 && Number(value) <= 365)) {
      setNewCardData({ ...newCardData, targetDays: value })
      setError('')
    } else if (Number(value) > 365) {
      setError('Target hari tidak boleh lebih dari 365 hari')
    } else {
      setError('Target hari harus lebih dari 0')
    }
  }

  const handleSubmit = () => {
    if (!newCardData.title.trim()) {
      setError('Nama kartu harus diisi')
      return
    }
    if (!newCardData.targetDays || Number(newCardData.targetDays) <= 0) {
      setError('Target hari harus lebih dari 0')
      return
    }
    handleSecondDialogSubmit()
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Detail Kartu</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Nama Kartu</Label>
          <Input
            id="title"
            placeholder="Contoh: Kosakata Buah-buahan"
            value={newCardData.title}
            onChange={(e) =>
              setNewCardData({ ...newCardData, title: e.target.value })
            }
            className="border-primary-200 focus:border-primary-400"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="days">Target Hari</Label>
          <Input
            id="days"
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            min="1"
            max="365"
            placeholder="Masukkan target hari"
            value={newCardData.targetDays}
            onChange={handleTargetDaysChange}
            className="border-primary-200 focus:border-primary-400"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      </div>
      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => {
            setIsSecondDialogOpen(false)
            setIsFirstDialogOpen(true)
          }}
          className="border-primary-200 hover:bg-primary-50"
        >
          Kembali
        </Button>
        <Button
          onClick={handleSubmit}
          className="bg-secondary-600 hover:bg-secondary-700"
        >
          Tambah Kartu
        </Button>
      </DialogFooter>
    </>
  )
}

export default SecondDialog
