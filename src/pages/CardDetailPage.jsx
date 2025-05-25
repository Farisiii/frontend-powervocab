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
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-primary-700 text-xl font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  if (!cardData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-primary-100">
        <div className="text-error-600 text-2xl font-medium flex items-center gap-3">
          <BookOpen className="w-8 h-8" />
          Card not found
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary-100">
      <div className="w-full px-6 lg:px-12 xl:px-16 2xl:px-24 py-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div className="flex justify-start">
              <Button
                variant="ghost"
                onClick={() => navigate('/learning-cards')}
                className="text-primary-600 hover:text-primary-700 hover:bg-primary-200 transition-all duration-200 p-3 lg:p-4"
              >
                <ArrowLeft className="mr-2 lg:mr-3 h-5 w-5 lg:h-6 lg:w-6" />
                <span className="font-medium text-base lg:text-lg">
                  Back to Cards
                </span>
              </Button>
            </div>

            {/* Stats Cards - Enhanced with better contrast and larger text */}
            <div className="flex flex-wrap gap-4 lg:gap-6">
              <div className="bg-white border border-primary-200 px-6 py-3 lg:px-8 lg:py-4 rounded-lg shadow-soft-sm">
                <span className="font-medium text-primary-600 text-base lg:text-lg">
                  Target Days:
                </span>{' '}
                <span className="text-primary-800 font-semibold text-base lg:text-lg">
                  {cardData.targetDays}
                </span>
              </div>
              <div className="bg-success-50 border border-success-200 px-6 py-3 lg:px-8 lg:py-4 rounded-lg shadow-soft-sm">
                <span className="font-medium text-success-700 text-base lg:text-lg">
                  Progress:
                </span>{' '}
                <span className="text-success-800 font-semibold text-base lg:text-lg">
                  {cardData.progress}%
                </span>
              </div>
              <div className="bg-secondary-50 border border-secondary-200 px-6 py-3 lg:px-8 lg:py-4 rounded-lg shadow-soft-sm">
                <span className="font-medium text-secondary-700 text-base lg:text-lg">
                  Words:
                </span>{' '}
                <span className="text-secondary-800 font-semibold text-base lg:text-lg">
                  {cardData.totalWords || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary-800 tracking-tight">
              {cardData.title}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-12 gap-8">
          {/* Left Column - Action Buttons */}
          <div className="lg:col-span-3 xl:col-span-2 space-y-6">
            <div className="sticky top-6">
              <h2 className="text-xl lg:text-2xl font-semibold text-primary-700 mb-6">
                Learning Modes
              </h2>
              <div className="space-y-4">
                <Button
                  className="w-full bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white p-5 lg:p-6 rounded-xl transition-all duration-200 ease-in-out shadow-soft-md hover:shadow-soft-xl group justify-start border-0"
                  onClick={() => navigate(`/cards/${cardId}/flashcard`)}
                >
                  <PlayCircle className="mr-3 lg:mr-4 h-6 w-6 lg:h-7 lg:w-7 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium text-base lg:text-lg">
                    Flashcard Mode
                  </span>
                </Button>
                <Button
                  className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white p-5 lg:p-6 rounded-xl transition-all duration-200 ease-in-out shadow-soft-md hover:shadow-soft-xl group justify-start border-0"
                  onClick={() => navigate(`/cards/${cardId}/games`)}
                >
                  <Library className="mr-3 lg:mr-4 h-6 w-6 lg:h-7 lg:w-7 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium text-base lg:text-lg">
                    Game Mode
                  </span>
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Word Pairs Table */}
          <div className="lg:col-span-9 xl:col-span-10">
            <h2 className="text-xl lg:text-2xl font-semibold text-primary-700 mb-6">
              Word Pairs
            </h2>
            <Card className="overflow-hidden shadow-soft-xl rounded-xl border border-primary-200 bg-white">
              <div className="relative">
                {/* Fixed Header */}
                <div className="sticky top-0 z-20 bg-gradient-to-r from-primary-50 to-primary-100 border-b border-primary-200">
                  <div className="grid grid-cols-12 gap-8 lg:gap-12 py-5 lg:py-6 px-8 lg:px-12">
                    <div className="col-span-1 text-primary-700 font-semibold text-center text-base lg:text-lg xl:text-xl">
                      #
                    </div>
                    <div className="col-span-5 lg:col-span-6 text-primary-700 font-semibold text-base lg:text-lg xl:text-xl">
                      English
                    </div>
                    <div className="col-span-6 lg:col-span-5 text-primary-700 font-semibold text-base lg:text-lg xl:text-xl">
                      Indonesian
                    </div>
                  </div>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto max-h-[500px] lg:max-h-[600px] xl:max-h-[700px] 2xl:max-h-[800px]">
                  {cardData.wordPairs?.map((pair, index) => (
                    <div
                      key={index}
                      className={`grid grid-cols-12 gap-8 lg:gap-12 py-6 lg:py-7 xl:py-8 px-8 lg:px-12 transition-colors duration-150 border-b border-primary-100 last:border-0 ${
                        index % 2 === 0
                          ? 'bg-white hover:bg-primary-25'
                          : 'bg-primary-25 hover:bg-primary-50'
                      }`}
                    >
                      <div className="col-span-1 font-medium text-primary-500 text-center text-base lg:text-lg xl:text-xl">
                        {index + 1}
                      </div>
                      <div className="col-span-5 lg:col-span-6 text-primary-700 font-medium break-words text-base lg:text-lg xl:text-xl leading-relaxed">
                        {pair.english}
                      </div>
                      <div className="col-span-6 lg:col-span-5 text-primary-700 font-medium break-words text-base lg:text-lg xl:text-xl leading-relaxed">
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
