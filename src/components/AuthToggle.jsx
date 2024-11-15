import React from 'react'

const AuthToggle = ({ isLogin, onToggle }) => {
  return (
    <div className="text-center">
      <p className="text-xs md:text-sm text-gray-600">
        {isLogin ? 'Belum punya account? ' : 'Sudah punya account? '}
        <button type="button" className="text-blue-500" onClick={onToggle}>
          {isLogin ? 'Sign up now' : 'Log in'}
        </button>
      </p>
    </div>
  )
}

export default AuthToggle
