// components/DeleteCardDialog.jsx
import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

const DeleteCardDialog = ({ isOpen, setIsOpen, onConfirm }) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="w-[95vw] sm:w-[400px] border-error-100">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold text-error-700">
            Hapus Kartu?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-primary-700">
            Apakah Anda yakin ingin menghapus kartu ini? Tindakan ini tidak
            dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-0">
          <AlertDialogCancel className="w-full sm:w-auto border-primary-200 text-primary-700 hover:bg-primary-50">
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="w-full sm:w-auto bg-error-500 hover:bg-error-600 text-white"
          >
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteCardDialog
