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
import { ArrowLeft, PlayCircle, Library } from 'lucide-react'
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
      <div className="flex justify-center items-center min-h-screen bg-accent-50">
        <div className="animate-pulse text-primary-600 text-xl">Loading...</div>
      </div>
    )
  }

  if (!cardData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-accent-50">
        <div className="text-error-600 text-xl">Card not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent-50 to-white">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-start gap-6 md:mb-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/learning-cards')}
            className="text-primary-400 hover:text-primary-500 hover:bg-accent-200 transition-colors duration-200 text-base md:text-lg lg:text-xl flex-shrink-0 mt-1"
          >
            <ArrowLeft className="mr-2 h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7" />
            <span className="hidden md:inline">Back to Cards</span>
            <span className="md:hidden">Back</span>
          </Button>
        </div>
        <div className="text-center mb-5 md:mb-10">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-primary-400 mb-3">
            {cardData.title}
          </h1>
          <p className="text-primary-300 text-base md:text-xl lg:text-2xl">
            Target Days: {cardData.targetDays} | Progress: {cardData.progress}%
            | Total Words: {cardData.totalWords || 0}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Button
            className="bg-secondary-600 hover:bg-secondary-700 text-white h-14 md:h-16 lg:h-20 transition-all duration-200 ease-in-out shadow-lg hover:shadow-xl text-base md:text-xl lg:text-2xl"
            onClick={() => navigate(`/cards/${cardId}/flashcard`)}
          >
            <PlayCircle className="mr-2 h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8" />
            Start Flashcard Mode
          </Button>
          <Button
            className="bg-primary-400 hover:bg-primary-500 text-white h-14 md:h-16 lg:h-20 transition-all duration-200 ease-in-out shadow-lg hover:shadow-xl text-base md:text-xl lg:text-2xl"
            onClick={() => navigate(`/cards/${cardId}/games`)}
          >
            <Library className="mr-2 h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8" />
            Start Game Mode
          </Button>
        </div>

        <Card className="overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-accent-50">
                  <TableHead className="w-16 text-primary-400 text-base md:text-xl lg:text-2xl p-4 md:p-6">
                    #
                  </TableHead>
                  <TableHead className="text-primary-400 text-base md:text-xl lg:text-2xl p-4 md:p-6 text-center">
                    English
                  </TableHead>
                  <TableHead className="text-primary-400 text-base md:text-xl lg:text-2xl p-4 md:p-6 text-center">
                    Indonesian
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cardData.wordPairs &&
                  cardData.wordPairs.map((pair, index) => (
                    <TableRow
                      key={index}
                      className="hover:bg-accent-50 transition-colors duration-150"
                    >
                      <TableCell className="font-medium text-primary-300 text-base md:text-lg lg:text-xl p-4 md:p-6">
                        {index + 1}
                      </TableCell>
                      <TableCell className="text-primary-400 text-base md:text-lg lg:text-xl p-4 md:p-6">
                        {pair.english}
                      </TableCell>
                      <TableCell className="text-primary-400 text-base md:text-lg lg:text-xl p-4 md:p-6">
                        {pair.indonesian}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default CardDetailPage
