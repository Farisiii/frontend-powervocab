import { create } from 'zustand'

const useWordPairs = create((set) => ({
  wordPairs: {},
  setWordPairs: (cardId, pairs) =>
    set((state) => ({
      wordPairs: {
        ...state.wordPairs,
        [cardId]: pairs,
      },
    })),
  fetchWordPairs: async (cardId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/cards/${cardId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      if (!response.ok) throw new Error('Failed to fetch word pairs')

      const data = await response.json()
      set((state) => ({
        wordPairs: {
          ...state.wordPairs,
          [cardId]: data.wordPairs,
        },
      }))

      return data.wordPairs
    } catch (error) {
      console.error('Error fetching word pairs:', error)
      return []
    }
  },
}))

export default useWordPairs
