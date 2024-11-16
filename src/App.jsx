import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import LearningCardsPage from './pages/LearningCardPage'
import './App.css'
import CardDetailPage from './pages/CardDetailPage'
import FlashCardPage from './pages/FlashCardPage'
import GameModePage from './pages/GameModePage'
import BubbleBathGame from './pages/BubbleBathGame'
import TranslationGame from './pages/TranslationGame'
import DragDropWordGame from './pages/DragDropWordGame'

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
    path: '/cards/:cardId',
    element: <CardDetailPage />,
  },
  {
    path: '/cards/:cardId/flashcard',
    element: <FlashCardPage />,
  },
  {
    path: '/cards/:cardId/games',
    element: <GameModePage />,
  },
  {
    path: '/cards/:cardId/games/bubble-bath',
    element: <BubbleBathGame />,
  },
  {
    path: '/cards/:cardId/games/translation-game',
    element: <TranslationGame />,
  },
  {
    path: '/cards/:cardId/games/drag-drop-word-game',
    element: <DragDropWordGame />,
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
