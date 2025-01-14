// AuthPage.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Mail, Eye, EyeOff, User } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

const baseUrl =
  import.meta.env.VITE_API_URL || 'https://web-production-6881.up.railway.app'
const API_URL = `${baseUrl}/api`

const AuthHeader = () => (
  <div className="text-center">
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center mb-4"
    >
      <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
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
      <p className="text-base sm:text-lg lg:text-xl text-gray-700 font-medium">
        Virtual Lab Bahasa Inggris
      </p>
      <p className="text-sm sm:text-base lg:text-lg text-primary-500 font-medium mt-1">
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
  <div className="space-y-1">
    <div className="relative group">
      <div className="absolute inset-y-0 left-3 flex items-center text-gray-400 group-hover:text-primary-500 transition-colors">
        <Icon className="w-5 h-5" />
      </div>
      <input
        type={isPassword ? (showPassword ? 'text' : 'password') : type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full pl-10 pr-12 py-3 rounded-xl border-2 transition-all duration-300
          ${error ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white/90'}
          focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none
          text-base backdrop-blur-sm hover:border-primary-300`}
      />
      {isPassword && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      )}
    </div>
    {error && <p className="text-red-500 text-sm pl-3">{error}</p>}
  </div>
)

const SuccessAlert = ({ isVisible, onClose }) => {
  if (!isVisible) return null

  return (
    <Alert
      className={`fixed sm:bottom-4 sm:right-4 sm:top-auto top-4 right-4 left-4 sm:left-auto max-w-sm bg-white shadow-lg transform transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      }`}
    >
      <div className="flex items-start gap-4">
        <svg
          className="h-5 w-5 text-green-400"
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
            <p className="font-medium">Registration successful!</p>
            <p className="text-sm text-gray-500">
              Please sign in with your new account.
            </p>
          </AlertDescription>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
          <span className="sr-only">Close</span>
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
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
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-blue-50 via-white to-primary-50">
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
          className="absolute -top-16 -left-16 w-64 h-64 bg-primary-200/30 rounded-full blur-3xl"
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
          className="absolute top-1/4 -right-32 w-96 h-96 bg-primary-300/20 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <AuthHeader />

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 sm:p-8"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.submit && (
                <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center">
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
                  placeholder="Full Name"
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
                  placeholder="Confirm Password"
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
                  text-white py-3 rounded-xl font-medium text-base
                  hover:from-primary-600 hover:to-primary-700 
                  transform transition-all duration-200 
                  hover:shadow-lg hover:-translate-y-0.5
                  focus:outline-none focus:ring-2 focus:ring-primary-300
                  disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading
                  ? 'Please wait...'
                  : isLogin
                  ? 'Sign In'
                  : 'Create Account'}
              </button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  {isLogin
                    ? "Don't have an account? Sign Up"
                    : 'Already have an account? Sign In'}
                </button>
              </div>
            </form>
          </motion.div>
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
