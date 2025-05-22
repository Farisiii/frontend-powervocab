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
      <div className="flex justify-center items-center min-h-screen bg-primary-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-primary-700 text-lg font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  if (!cardData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-primary-100">
        <div className="text-error-600 text-xl font-medium flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          Card not found
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary-100">
      <div className="container mx-auto px-4 py-6 max-w-none lg:max-w-6xl xl:max-w-7xl">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/learning-cards')}
              className="text-primary-600 hover:text-primary-700 hover:bg-primary-200 transition-all duration-200 p-2 sm:p-3"
            >
              <ArrowLeft className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="font-medium text-sm sm:text-base">
                Back to Cards
              </span>
            </Button>

            {/* Stats Cards - Enhanced with better contrast */}
            <div className="flex flex-wrap gap-3 lg:gap-4">
              <div className="bg-white border border-primary-200 px-4 py-2 rounded-lg text-sm shadow-soft-sm">
                <span className="font-medium text-primary-600">
                  Target Days:
                </span>{' '}
                <span className="text-primary-800 font-semibold">
                  {cardData.targetDays}
                </span>
              </div>
              <div className="bg-success-50 border border-success-200 px-4 py-2 rounded-lg text-sm shadow-soft-sm">
                <span className="font-medium text-success-700">Progress:</span>{' '}
                <span className="text-success-800 font-semibold">
                  {cardData.progress}%
                </span>
              </div>
              <div className="bg-secondary-50 border border-secondary-200 px-4 py-2 rounded-lg text-sm shadow-soft-sm">
                <span className="font-medium text-secondary-700">Words:</span>{' '}
                <span className="text-secondary-800 font-semibold">
                  {cardData.totalWords || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-800 tracking-tight">
              {cardData.title}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Action Buttons */}
          <div className="lg:col-span-1 space-y-4">
            <div className="sticky top-6">
              <h2 className="text-lg font-semibold text-primary-700 mb-4">
                Learning Modes
              </h2>
              <div className="space-y-3">
                <Button
                  className="w-full bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white p-4 rounded-xl transition-all duration-200 ease-in-out shadow-soft-md hover:shadow-soft-xl group justify-start border-0"
                  onClick={() => navigate(`/cards/${cardId}/flashcard`)}
                >
                  <PlayCircle className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">Flashcard Mode</span>
                </Button>
                <Button
                  className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white p-4 rounded-xl transition-all duration-200 ease-in-out shadow-soft-md hover:shadow-soft-xl group justify-start border-0"
                  onClick={() => navigate(`/cards/${cardId}/games`)}
                >
                  <Library className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">Game Mode</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Word Pairs Table */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-primary-700 mb-4">
              Word Pairs
            </h2>
            <Card className="overflow-hidden shadow-soft-xl rounded-xl border border-primary-200 bg-white">
              <div className="relative">
                {/* Fixed Header */}
                <div className="sticky top-0 z-20 bg-gradient-to-r from-primary-50 to-primary-100 border-b border-primary-200">
                  <div className="grid grid-cols-12 gap-4 py-4 px-6">
                    <div className="col-span-1 text-primary-700 font-semibold text-center">
                      #
                    </div>
                    <div className="col-span-5 text-primary-700 font-semibold">
                      English
                    </div>
                    <div className="col-span-6 text-primary-700 font-semibold">
                      Indonesian
                    </div>
                  </div>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto max-h-96 xl:max-h-[450px]">
                  {cardData.wordPairs?.map((pair, index) => (
                    <div
                      key={index}
                      className={`grid grid-cols-12 gap-4 py-4 px-6 transition-colors duration-150 border-b border-primary-100 last:border-0 ${
                        index % 2 === 0
                          ? 'bg-white hover:bg-primary-25'
                          : 'bg-primary-25 hover:bg-primary-50'
                      }`}
                    >
                      <div className="col-span-1 font-medium text-primary-500 text-center">
                        {index + 1}
                      </div>
                      <div className="col-span-5 text-primary-700 font-medium break-words">
                        {pair.english}
                      </div>
                      <div className="col-span-6 text-primary-700 font-medium break-words">
                        {pair.indonesian}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardDetailPage
