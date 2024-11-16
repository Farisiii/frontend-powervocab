import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SuccessAlert from '@/components/SuccessAlert'

const API_URL = 'http://localhost:5000/api'

const AuthHeader = () => (
  <div className="text-center">
    <div className="flex items-center justify-center mb-4 lg:mb-6">
      <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold">
        <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
          PowerVocab
        </span>
      </h1>
    </div>
    <p className="text-base md:text-lg lg:text-2xl text-gray-700 font-medium">
      Virtual Lab Bahasa Inggris
    </p>
    <p className="text-sm md:text-base lg:text-xl text-primary-500 font-medium mt-1 lg:mt-2">
      "Build Your English Word Power"
    </p>
  </div>
)

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
}) => (
  <div className="relative flex-1">
    <div className="relative group">
      <input
        type={isPassword ? (showPassword ? 'text' : 'password') : type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete="off"
        className={`w-full p-3 md:p-4 lg:p-5 rounded-lg border-2 transition-all duration-300 
        ${error ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white/90'} 
        focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none
        text-base md:text-lg lg:text-xl backdrop-blur-sm shadow-sm
        hover:border-primary-300 ${className}`}
      />
      {isPassword && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-4 lg:right-5 top-1/2 -translate-y-1/2 text-gray-400 
          hover:text-gray-600 transition-colors duration-200"
        >
          {!showPassword ? (
            <svg
              className="w-5 h-5 lg:w-6 lg:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 lg:w-6 lg:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          )}
        </button>
      )}
    </div>
    <div className="min-h-[20px] mt-1 lg:mt-2">
      {error && <p className="text-red-500 text-sm lg:text-base">{error}</p>}
    </div>
  </div>
)

const AuthToggle = ({ isLogin, onToggle }) => (
  <div className="text-center mt-6 lg:mt-8">
    <p className="text-sm md:text-base lg:text-lg text-gray-600">
      {isLogin ? 'Belum punya account? ' : 'Sudah punya account? '}
      <button
        type="button"
        className="text-primary-500 hover:text-primary-600 font-medium transition-colors duration-200"
        onClick={onToggle}
      >
        {isLogin ? 'Sign up now' : 'Sign in'}
      </button>
    </p>
  </div>
)

const AuthPage = () => {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [hidePassword, setHidePassword] = useState(true)
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})

  // Validation and form handling functions remain the same
  const validate = () => {
    const newErrors = {}
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    if (!formData.email) {
      newErrors.email = 'Email harus diisi'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Format email tidak valid'
    }

    if (!formData.password) {
      newErrors.password = 'Password harus diisi'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter'
    }

    if (!isLogin && !formData.fullName) {
      newErrors.fullName = 'Nama lengkap harus diisi'
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak sama'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validate()) {
      setIsLoading(true)
      try {
        const endpoint = isLogin ? '/login' : '/signup'
        const response = await fetch(`${API_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            ...(isLogin ? {} : { fullName: formData.fullName }),
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Authentication failed')
        }

        if (isLogin) {
          localStorage.setItem('token', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))
          navigate('/learning-cards')
        } else {
          setShowSuccessAlert(true)
          setTimeout(() => {
            setShowSuccessAlert(false)
            setIsLogin(true)
            setFormData({
              email: '',
              fullName: '',
              password: '',
              confirmPassword: '',
            })
          }, 3000)
        }
      } catch (error) {
        console.error('Authentication error:', error)
        setErrors({
          submit: error.message || 'Authentication failed. Please try again.',
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-gradient-to-br from-blue-50 via-white to-primary-50">
      {/* Decorative elements - made larger for desktop */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-16 -left-16 w-32 h-32 lg:w-48 lg:h-48 bg-primary-200/30 rounded-full blur-xl"></div>
        <div className="absolute top-1/4 -right-8 w-24 h-24 lg:w-40 lg:h-40 bg-primary-300/20 rounded-full blur-lg"></div>
        <div className="absolute bottom-1/3 -left-12 w-28 h-28 lg:w-44 lg:h-44 bg-primary-400/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-1/4 right-12 w-36 h-36 lg:w-52 lg:h-52 bg-primary-100/20 rounded-full blur-lg"></div>
      </div>

      <div className="relative z-10 flex-shrink-0 pt-8 md:pt-16 lg:pt-20">
        <AuthHeader />
      </div>

      <div className="relative z-10 flex-grow flex items-center justify-center px-4 py-8 lg:py-12">
        <div className="w-full max-w-lg lg:max-w-2xl">
          <div className="bg-accent-100/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 md:p-8 lg:p-12">
            <h2 className="text-xl md:text-2xl lg:text-4xl font-bold text-center mb-6 md:mb-8 lg:mb-10 text-gray-800">
              Selamat Datang
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-4 md:space-y-6 lg:space-y-8"
            >
              {errors.submit && (
                <div className="text-red-500 text-sm lg:text-base text-center bg-red-50 p-3 lg:p-4 rounded-lg">
                  {errors.submit}
                </div>
              )}

              <FormInput
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />

              {!isLogin && (
                <FormInput
                  name="fullName"
                  placeholder="Nama Lengkap"
                  value={formData.fullName}
                  onChange={handleChange}
                  error={errors.fullName}
                />
              )}

              {isLogin ? (
                <FormInput
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  isPassword
                  showPassword={!hidePassword}
                  onTogglePassword={() => setHidePassword(!hidePassword)}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                  <FormInput
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    isPassword
                    showPassword={!hidePassword}
                    onTogglePassword={() => setHidePassword(!hidePassword)}
                  />
                  <FormInput
                    name="confirmPassword"
                    placeholder="Konfirmasi Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                    isPassword
                    showPassword={!hideConfirmPassword}
                    onTogglePassword={() =>
                      setHideConfirmPassword(!hideConfirmPassword)
                    }
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-gradient-to-r from-primary-500 to-primary-600 
                text-white p-3 md:p-4 lg:p-5 rounded-lg font-medium text-base md:text-lg lg:text-xl
                hover:from-primary-600 hover:to-primary-700 
                transform transition-all duration-200 
                hover:shadow-lg hover:-translate-y-0.5
                focus:outline-none focus:ring-2 focus:ring-primary-300
                ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Loading...' : isLogin ? 'Sign in' : 'Sign up'}
              </button>

              <AuthToggle
                isLogin={isLogin}
                onToggle={() => setIsLogin(!isLogin)}
              />
            </form>
          </div>
        </div>
      </div>

      <SuccessAlert
        isVisible={showSuccessAlert}
        onClose={() => setShowSuccessAlert(false)}
      />
    </div>
  )
}

export default AuthPage
