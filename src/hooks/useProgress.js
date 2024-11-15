import { create } from 'zustand'

const useProgress = create((set) => ({
  progress: {},
  setProgress: (cardId, value) =>
    set((state) => ({
      progress: {
        ...state.progress,
        [cardId]: value,
      },
    })),
  updateProgress: async (cardId, value) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/cards/${cardId}/progress`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ progress: value }),
        credentials: 'include',
      })

      if (!response.ok) throw new Error('Failed to update progress')

      set((state) => ({
        progress: {
          ...state.progress,
          [cardId]: value,
        },
      }))

      return true
    } catch (error) {
      console.error('Error updating progress:', error)
      return false
    }
  },
}))

export default useProgress
