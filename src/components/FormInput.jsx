import React from 'react'
import { Eye, EyeOff } from 'lucide-react'

const FormInput = ({
  type = 'text',
  name,
  placeholder,
  value,
  onChange,
  error,
  isPassword,
  showPassword,
  onTogglePassword,
  className = '',
}) => {
  return (
    <div className="relative flex-1">
      <div className="relative">
        <input
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete="off"
          className={`w-full p-3 pr-10 ${
            error ? 'border-red-500' : ''
          } ${className}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {!showPassword ? (
              <EyeOff size={20} className="h-5 w-5" />
            ) : (
              <Eye size={20} className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
      {/* Error message container with fixed height to prevent layout shift */}
      <div className="min-h-[20px] mt-1">
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  )
}

export default FormInput
