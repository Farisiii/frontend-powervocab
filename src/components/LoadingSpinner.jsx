import React from 'react'

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      <p className="text-gray-600 text-lg">Loading...</p>
    </div>
  )
}

export default LoadingSpinner
