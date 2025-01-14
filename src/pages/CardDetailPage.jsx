import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { ArrowLeft, PlayCircle, Library, BookOpen } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const CardDetailPage = () => {
  const { cardId } = useParams()
  const navigate = useNavigate()
  const [cardData, setCardData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchCardDetail = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('token')

      if (!token) {
        toast({
          title: 'Error',
          description: 'Authentication token not found',
          variant: 'destructive',
        })
        navigate('/')
        return
      }

      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const response = await fetch(`${baseUrl}/api/cards/${cardId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
      })

      if (response.status === 404) {
        toast({
          title: 'Error',
          description: 'Card not found',
          variant: 'destructive',
        })
        navigate('/learning-cards')
        return
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setCardData(data)
    } catch (error) {
      console.error('Error fetching card details:', error)
      toast({
        title: 'Error',
        description: 'Failed to load card details. Please try again.',
        variant: 'destructive',
      })
      navigate('/learning-cards')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (cardId) {
      fetchCardDetail()
    }
  }, [cardId])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-accent-50 to-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-primary-600 text-lg font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  if (!cardData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-accent-50 to-white">
        <div className="text-error-600 text-xl font-medium flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          Card not found
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section with Left-aligned Back Button */}
        <div className="mb-8">
          <div className="flex flex-col space-y-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/learning-cards')}
              className="text-primary-400 hover:text-primary-500 hover:bg-accent-100 transition-colors duration-200 w-fit"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              <span className="font-medium">Back to Cards</span>
            </Button>

            <div className="text-center space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-600 tracking-tight">
                {cardData.title}
              </h1>
              <div className="flex flex-wrap justify-center gap-4 text-primary-400">
                <div className="bg-primary-50 px-4 py-2 rounded-full">
                  <span className="font-medium">Target Days:</span>{' '}
                  {cardData.targetDays}
                </div>
                <div className="bg-primary-50 px-4 py-2 rounded-full">
                  <span className="font-medium">Progress:</span>{' '}
                  {cardData.progress}%
                </div>
                <div className="bg-primary-50 px-4 py-2 rounded-full">
                  <span className="font-medium">Words:</span>{' '}
                  {cardData.totalWords || 0}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Button
            className="bg-secondary-600 hover:bg-secondary-700 text-white p-6 rounded-xl transition-all duration-200 ease-in-out shadow-lg hover:shadow-xl group"
            onClick={() => navigate(`/cards/${cardId}/flashcard`)}
          >
            <PlayCircle className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
            <span className="text-lg font-medium">Flashcard Mode</span>
          </Button>
          <Button
            className="bg-primary-500 hover:bg-primary-600 text-white p-6 rounded-xl transition-all duration-200 ease-in-out shadow-lg hover:shadow-xl group"
            onClick={() => navigate(`/cards/${cardId}/games`)}
          >
            <Library className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
            <span className="text-lg font-medium">Game Mode</span>
          </Button>
        </div>

        {/* Word Pairs Table with Fixed Header */}
        <Card className="overflow-hidden shadow-lg rounded-xl border border-accent-200">
          <div className="relative">
            {/* Fixed Header */}
            <div className="sticky top-0 z-20 bg-accent-50 border-b border-accent-200">
              <div className="flex py-4 px-6">
                <div className="w-16 text-primary-600 font-semibold">#</div>
                <div className="flex-1 text-primary-600 font-semibold">
                  English
                </div>
                <div className="flex-1 text-primary-600 font-semibold">
                  Indonesian
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto max-h-[432px]">
              {cardData.wordPairs?.map((pair, index) => (
                <div
                  key={index}
                  className="flex py-4 px-6 hover:bg-accent-50 transition-colors duration-150 border-b border-accent-100 last:border-0"
                >
                  <div className="w-16 font-medium text-primary-400">
                    {index + 1}
                  </div>
                  <div className="flex-1 text-primary-600 font-medium">
                    {pair.english}
                  </div>
                  <div className="flex-1 text-primary-600 font-medium">
                    {pair.indonesian}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default CardDetailPage
