import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import LearningCardsPage from './pages/LearningCardPage'
import './App.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthPage />,
  },
  {
    path: '/learning-cards',
    element: <LearningCardsPage />,
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
