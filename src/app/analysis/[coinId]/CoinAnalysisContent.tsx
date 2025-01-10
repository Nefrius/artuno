'use client'

import { useState, useEffect } from 'react'
import LoadingSpinner from '@/components/LoadingSpinner'
import AnimatedContent from './AnimatedContent'

interface CoinAnalysisContentProps {
  coinId: string
}

interface PredictionData {
  prediction: number
  predictedPrice: number
  confidence: number
  trend: 'up' | 'down'
  technicalIndicators: {
    rsi: number
    macd: number
    sma20: number
    ema50: number
  }
  marketAnalysis: {
    source: string
    summary: string
    sentiment: string
    timestamp: string
  }[]
  reasoning: string[]
  modelInfo: {
    name: string
    type: string
    components: string[]
    methodology: string[]
    accuracy: {
      overall: string
      shortTerm: string
      longTerm: string
    }
    updateFrequency: string
  }
}

export default function CoinAnalysisContent({ coinId }: CoinAnalysisContentProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [prediction, setPrediction] = useState<PredictionData | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Market verileri
        const marketResponse = await fetch(`/api/crypto/market-chart?coinId=${coinId}`)
        if (!marketResponse.ok) {
          throw new Error('Market verileri alınamadı')
        }
        const marketData = await marketResponse.json()

        // AI analizi
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            coinId,
            prices: marketData.prices,
            timeframe: '24h'
          }),
        })

        if (!response.ok) {
          throw new Error('Analiz yapılamadı')
        }

        const result = await response.json()
        setPrediction(result)

      } catch (err) {
        console.error('Veri alma hatası:', err)
        setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [coinId])

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Tekrar Dene
        </button>
      </div>
    )
  }

  if (!prediction) {
    return null
  }

  return <AnimatedContent coinId={coinId} prediction={prediction} />
} 