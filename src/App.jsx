import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import './App.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthPage />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
