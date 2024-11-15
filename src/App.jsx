import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import LoadingSpinner from './components/LoadingSpinner' // Anda perlu membuat komponen ini

// Lazy load semua pages
const AuthPage = lazy(() => import('./pages/AuthPage'))
const LearningCardsPage = lazy(() => import('./pages/LearningCardsPage'))
const CardDetailPage = lazy(() => import('./pages/CardDetailPage'))
const FlashCardPage = lazy(() => import('./pages/FlashCardPage'))
const GameModePage = lazy(() => import('./pages/GameModePage'))
const BubbleBathGame = lazy(() => import('./pages/BubbleBathGame'))
const TranslationGame = lazy(() => import('./pages/TranslationGame'))
const DragDropWordGame = lazy(() => import('./pages/DragDropWordGame'))

// Helper untuk wrapping routes dengan Suspense
const withSuspense = (Component) => (
  <Suspense
    fallback={
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    }
  >
    <Component />
  </Suspense>
)

const router = createBrowserRouter([
  {
    path: '/',
    element: withSuspense(AuthPage),
  },
  {
    path: '/learning-cards',
    element: withSuspense(LearningCardsPage),
  },
  {
    path: '/cards/:cardId',
    element: withSuspense(CardDetailPage),
  },
  {
    path: '/cards/:cardId/flashcard',
    element: withSuspense(FlashCardPage),
  },
  {
    path: '/cards/:cardId/games',
    element: withSuspense(GameModePage),
  },
  {
    path: '/cards/:cardId/games/bubble-bath',
    element: withSuspense(BubbleBathGame),
  },
  {
    path: '/cards/:cardId/games/translation-game',
    element: withSuspense(TranslationGame),
  },
  {
    path: '/cards/:cardId/games/drag-drop-word-game',
    element: withSuspense(DragDropWordGame),
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
