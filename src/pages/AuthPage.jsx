// AuthPage.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Mail, Eye, EyeOff, User } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

// API Configuration
const baseUrl =
  import.meta.env.VITE_API_URL || 'https://web-production-6881.up.railway.app'
const API_URL = `${baseUrl}/api`

// API Helper Functions
const apiRequest = async (endpoint, options = {}) => {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  // Add authorization header if token exists
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config)

    // Handle different response types
    let data
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      data = await response.json()
    } else {
      data = { message: await response.text() }
    }

    if (!response.ok) {
      // Handle different error status codes
      const errorMessage =
        data.error ||
        data.message ||
        `HTTP ${response.status}: ${response.statusText}`
      throw new Error(errorMessage)
    }

    return data
  } catch (error) {
    // Network errors or JSON parsing errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server')
    }
    throw error
  }
}

const AuthHeader = () => (
  <div className="text-center">
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center mb-4 lg:mb-6 xl:mb-8"
    >
      <h1 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold tracking-tight">
        <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 bg-clip-text text-transparent">
          PowerVocab
        </span>
      </h1>
    </motion.div>
    <motion.div
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <p className="text-sm sm:text-base lg:text-xl xl:text-2xl text-gray-700 font-medium">
        Virtual Lab Bahasa Inggris
      </p>
      <p className="text-xs sm:text-sm lg:text-lg xl:text-xl text-primary-500 font-medium mt-1 lg:mt-2">
        "Build Your English Word Power"
      </p>
    </motion.div>
  </div>
)

const FormInput = ({
  icon: Icon,
  type = 'text',
  name,
  placeholder,
  value,
  onChange,
  error,
  isPassword,
  showPassword,
  onTogglePassword,
}) => (
  <div className="space-y-1 lg:space-y-2">
    <div className="relative group">
      <div className="absolute inset-y-0 z-10 left-4 lg:left-5 flex items-center text-gray-400 group-hover:text-primary-500 transition-colors">
        {Icon && (
          <Icon
            size={18}
            className="w-[18px] h-[18px] lg:w-6 lg:h-6 xl:w-7 xl:h-7"
          />
        )}
      </div>
      <input
        type={isPassword ? (showPassword ? 'text' : 'password') : type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete="off"
        className={`w-full pl-12 lg:pl-16 xl:pl-18 pr-12 lg:pr-16 py-3 lg:py-4 xl:py-5 rounded-xl lg:rounded-2xl border-2 transition-all duration-300
          ${error ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white/90'}
          focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none
          text-sm lg:text-lg xl:text-xl backdrop-blur-sm hover:border-primary-300`}
      />
      {isPassword && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute inset-y-0 right-4 lg:right-5 flex items-center text-gray-400 hover:text-gray-600"
        >
          {showPassword ? (
            <EyeOff size={18} className="lg:w-6 lg:h-6 xl:w-7 xl:h-7" />
          ) : (
            <Eye size={18} className="lg:w-6 lg:h-6 xl:w-7 xl:h-7" />
          )}
        </button>
      )}
    </div>
    {error && (
      <p className="text-red-500 text-xs lg:text-base xl:text-lg pl-4 lg:pl-5">
        {error}
      </p>
    )}
  </div>
)

const SuccessAlert = ({ isVisible, onClose }) => {
  if (!isVisible) return null

  return (
    <Alert
      className={`fixed sm:bottom-4 sm:right-4 sm:top-auto top-4 right-4 left-4 sm:left-auto max-w-sm lg:max-w-md bg-white shadow-lg transform transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      }`}
    >
      <div className="flex items-start gap-4">
        <svg
          className="h-5 w-5 lg:h-6 lg:w-6 text-green-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="flex-1">
          <AlertDescription>
            <p className="font-medium lg:text-lg">Registration successful!</p>
            <p className="text-sm lg:text-base text-gray-500">
              Please sign in with your new account.
            </p>
          </AlertDescription>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
          <span className="sr-only">Close</span>
          <svg
            className="h-5 w-5 lg:h-6 lg:w-6"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </Alert>
  )
}

const AuthPage = () => {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email harus diisi'
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Format email tidak valid'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password harus diisi'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter'
    }

    // Full name validation for registration
    if (!isLogin && !formData.fullName.trim()) {
      newErrors.fullName = 'Nama lengkap harus diisi'
    }

    // Confirm password validation for registration
    if (!isLogin) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Konfirmasi password harus diisi'
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Password tidak sama'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setIsLoading(true)
    setErrors({}) // Clear previous errors

    try {
      const endpoint = isLogin ? '/login' : '/signup'
      const requestData = {
        email: formData.email.trim(),
        password: formData.password,
        ...(isLogin ? {} : { fullName: formData.fullName.trim() }),
      }

      console.log(
        `Making ${isLogin ? 'login' : 'signup'} request to:`,
        `${API_URL}${endpoint}`
      )

      const data = await apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(requestData),
      })

      if (isLogin) {
        // Login successful
        if (data.token && data.user) {
          localStorage.setItem('token', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))
          console.log('Login successful, navigating to learning cards')
          navigate('/learning-cards')
        } else {
          throw new Error('Invalid response format: missing token or user data')
        }
      } else {
        // Registration successful
        console.log('Registration successful')
        setShowSuccessAlert(true)

        // Auto-switch to login after success
        setTimeout(() => {
          setShowSuccessAlert(false)
          setIsLogin(true)
          setFormData({
            email: formData.email, // Keep email for convenience
            fullName: '',
            password: '',
            confirmPassword: '',
          })
          setErrors({})
        }, 3000)
      }
    } catch (error) {
      console.error('Authentication error:', error)

      // Handle specific error types
      let errorMessage = 'Terjadi kesalahan. Silakan coba lagi.'

      if (error.message.includes('Network error')) {
        errorMessage =
          'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.'
      } else if (error.message.includes('Invalid credentials')) {
        errorMessage = 'Email atau password salah.'
      } else if (error.message.includes('Email already registered')) {
        errorMessage =
          'Email sudah terdaftar. Silakan gunakan email lain atau login.'
      } else if (error.message.includes('Invalid email format')) {
        errorMessage = 'Format email tidak valid.'
      } else if (error.message) {
        errorMessage = error.message
      }

      setErrors({
        submit: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }

    // Clear submit error when user makes changes
    if (errors.submit) {
      setErrors((prev) => ({ ...prev, submit: '' }))
    }
  }

  const toggleAuthMode = () => {
    setIsLogin(!isLogin)
    setFormData({
      email: '',
      fullName: '',
      password: '',
      confirmPassword: '',
    })
    setErrors({})
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  return (
    <div className="min-h-screen flex flex-col overflow-hidden bg-primary-100">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="absolute -top-16 -left-16 w-64 h-64 lg:w-96 lg:h-96 bg-primary-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="absolute top-1/4 -right-32 w-96 h-96 lg:w-[32rem] lg:h-[32rem] bg-primary-300/20 rounded-full blur-3xl"
        />
      </div>

      {/* Content - Much larger for desktop/laptop */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-4 py-6 sm:py-8 lg:py-12 xl:py-16">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-2xl xl:max-w-4xl 2xl:max-w-5xl">
          {/* Increased spacing for larger screens */}
          <div className="space-y-4 lg:space-y-8 xl:space-y-12">
            <AuthHeader />

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl lg:rounded-3xl shadow-xl p-5 sm:p-6 lg:p-12 xl:p-16 2xl:p-20"
            >
              <h2 className="text-xl sm:text-2xl lg:text-4xl xl:text-5xl font-bold text-center mb-4 lg:mb-8 xl:mb-10 text-gray-800">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>

              <form
                onSubmit={handleSubmit}
                className="space-y-3 lg:space-y-6 xl:space-y-8"
                autoComplete="off"
              >
                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 text-red-600 p-3 lg:p-5 rounded-lg lg:rounded-xl text-xs lg:text-base xl:text-lg">
                    {errors.submit}
                  </div>
                )}

                <FormInput
                  icon={Mail}
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                />

                {!isLogin && (
                  <FormInput
                    icon={User}
                    name="fullName"
                    placeholder="Nama Lengkap"
                    value={formData.fullName}
                    onChange={handleChange}
                    error={errors.fullName}
                  />
                )}

                <FormInput
                  icon={Lock}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  isPassword
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                />

                {!isLogin && (
                  <FormInput
                    icon={Lock}
                    name="confirmPassword"
                    placeholder="Konfirmasi Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                    isPassword
                    showPassword={showConfirmPassword}
                    onTogglePassword={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  />
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-primary-500 to-primary-600 
                    text-white py-3 lg:py-5 xl:py-6 rounded-xl lg:rounded-2xl font-medium text-sm lg:text-xl xl:text-2xl
                    hover:from-primary-600 hover:to-primary-700 
                    transform transition-all duration-200 
                    hover:shadow-lg hover:-translate-y-0.5
                    focus:outline-none focus:ring-2 focus:ring-primary-300
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-4 w-4 lg:h-7 lg:w-7 xl:h-8 xl:w-8 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Tunggu sebentar...
                    </span>
                  ) : isLogin ? (
                    'Masuk'
                  ) : (
                    'Daftar'
                  )}
                </button>

                <div className="text-center mt-4 lg:mt-8">
                  <button
                    type="button"
                    onClick={toggleAuthMode}
                    className="text-primary-600 hover:text-primary-700 text-xs lg:text-lg xl:text-xl font-medium transition-colors"
                  >
                    {isLogin
                      ? 'Belum punya akun? Daftar di sini'
                      : 'Sudah punya akun? Masuk di sini'}
                  </button>
                </div>
              </form>
            </motion.div>
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
