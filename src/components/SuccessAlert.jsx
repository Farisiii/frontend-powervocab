import React from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { X } from 'lucide-react'

const SuccessAlert = ({ isVisible, onClose }) => {
  if (!isVisible) return null

  return (
    <div className="fixed top-4 right-4 left-4 md:left-auto md:w-96 z-50 transform transition-all duration-300 ease-in-out">
      <Alert className="bg-white/95 backdrop-blur border-green-200 shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <AlertTitle className="text-green-800 font-semibold text-lg mb-1">
              Registrasi Berhasil! 🎉
            </AlertTitle>
            <AlertDescription className="text-green-700">
              Akun Anda telah berhasil dibuat. Silahkan login untuk melanjutkan.
            </AlertDescription>
          </div>
          <button
            onClick={onClose}
            className="text-green-500 hover:text-green-700 transition-colors duration-200"
          >
            <X size={20} />
          </button>
        </div>
      </Alert>
    </div>
  )
}

export default SuccessAlert
