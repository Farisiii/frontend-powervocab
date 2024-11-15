// hooks/useAuth.js
import { useState } from 'react'
import axios from 'axios'

export const useAuth = () => {
  const [user, setUser] = useState(null)

  const login = async (username, password) => {
    const { data } = await axios.post('/api/login', { username, password })
    setUser(data.user)
    localStorage.setItem('token', data.token)
  }

  const logout = async () => {
    await axios.post('/api/logout')
    setUser(null)
    localStorage.removeItem('token')
  }

  return { user, login, logout }
}
