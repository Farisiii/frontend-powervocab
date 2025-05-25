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
import { Trash2, AlertTriangle } from 'lucide-react'

const DeleteCardDialog = ({
  isOpen,
  setIsOpen,
  onConfirm,
  cardTitle = 'kartu',
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent
        className="
        w-[95vw] max-w-md
        sm:w-[450px] sm:max-w-lg
        md:w-[500px] md:max-w-xl
        lg:w-[520px] lg:max-w-2xl
        xl:w-[540px] xl:max-w-3xl
        border-2 border-error-200 
        shadow-2xl shadow-error-100/50
        bg-gradient-to-br from-white to-error-50/30
        rounded-2xl
        p-6 sm:p-8
        backdrop-blur-sm
      "
      >
        <AlertDialogHeader className="space-y-6 text-center">
          {/* Icon Section */}
          <div
            className="
            mx-auto w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24
            bg-gradient-to-br from-error-100 to-error-200
            rounded-full
            flex items-center justify-center
            shadow-lg shadow-error-200/40
            border-4 border-error-300/30
            relative
            group
          "
          >
            <div
              className="
              absolute inset-0 rounded-full 
              bg-gradient-to-br from-error-400/20 to-error-600/20
              animate-pulse
              group-hover:animate-none
            "
            ></div>
            <AlertTriangle
              className="
              w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12
              text-error-600
              relative z-10
              drop-shadow-sm
            "
            />
          </div>

          {/* Title Section */}
          <div className="space-y-2 text-center">
            <AlertDialogTitle
              className="
              text-2xl sm:text-3xl lg:text-4xl 
              font-bold 
              text-error-700
              leading-tight
              tracking-tight
            "
            >
              Hapus {cardTitle}?
            </AlertDialogTitle>

            <div
              className="
              w-16 sm:w-20 lg:w-24 
              h-1 
              bg-gradient-to-r from-error-400 to-error-600
              rounded-full 
              mx-auto
            "
            ></div>
          </div>

          {/* Description Section */}
          <AlertDialogDescription
            className="
            text-base sm:text-lg lg:text-xl
            text-primary-700
            leading-relaxed
            max-w-md mx-auto
            font-medium
          "
          >
            Apakah Anda yakin ingin menghapus {cardTitle} ini?
            <span className="block mt-2 text-sm sm:text-base lg:text-lg text-primary-600 font-normal">
              Tindakan ini tidak dapat dibatalkan dan semua data akan hilang
              secara permanen.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Warning Box */}
        <div
          className="
          my-6 sm:my-8
          p-4 sm:p-6
          bg-gradient-to-r from-warning-50 to-warning-100/80
          border-l-4 border-warning-400
          rounded-lg
          shadow-inner
        "
        >
          <div className="flex items-start gap-3">
            <AlertTriangle
              className="
              w-5 h-5 sm:w-6 sm:h-6 
              text-warning-600 
              flex-shrink-0 
              mt-0.5
            "
            />
            <div className="space-y-1">
              <p
                className="
                text-sm sm:text-base 
                font-semibold 
                text-warning-800
              "
              >
                Peringatan Penting
              </p>
              <p
                className="
                text-xs sm:text-sm 
                text-warning-700
                leading-relaxed
              "
              >
                Data yang dihapus tidak dapat dikembalikan. Pastikan Anda telah
                membuat backup jika diperlukan.
              </p>
            </div>
          </div>
        </div>

        <AlertDialogFooter
          className="
          flex flex-col-reverse sm:flex-row 
          gap-3 sm:gap-4 
          pt-6 sm:pt-8
          justify-center
        "
        >
          <AlertDialogCancel
            className="
            w-full sm:w-auto sm:min-w-[120px] lg:min-w-[140px]
            px-6 sm:px-8 lg:px-10
            py-3 sm:py-4
            text-base sm:text-lg
            font-semibold
            border-2 border-primary-300
            text-primary-700 
            bg-gradient-to-r from-white to-primary-50
            hover:from-primary-50 hover:to-primary-100
            hover:border-primary-400
            hover:text-primary-800
            rounded-xl
            transition-all duration-300
            shadow-lg hover:shadow-xl
            transform hover:scale-105
            active:scale-95
          "
          >
            Batal
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={onConfirm}
            className="
              w-full sm:w-auto sm:min-w-[120px] lg:min-w-[140px]
              px-6 sm:px-8 lg:px-10
              py-3 sm:py-4
              text-base sm:text-lg
              font-bold
              bg-gradient-to-r from-error-500 to-error-600
              hover:from-error-600 hover:to-error-700
              active:from-error-700 active:to-error-800
              text-white
              rounded-xl
              transition-all duration-300
              shadow-lg hover:shadow-xl
              transform hover:scale-105
              active:scale-95
              border-2 border-error-600
              hover:border-error-700
              group
            "
          >
            <div className="flex items-center justify-center gap-2">
              <Trash2
                className="
                w-4 h-4 sm:w-5 sm:h-5
                group-hover:animate-pulse
              "
              />
              <span>Hapus</span>
            </div>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteCardDialog
