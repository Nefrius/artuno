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
  historicalPrices?: number[]
}

export default function CoinAnalysisContent({ coinId }: CoinAnalysisContentProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [prediction, setPrediction] = useState<PredictionData | null>(null)
  const [historicalPrices, setHistoricalPrices] = useState<number[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Market verileri
        const marketResponse = await fetch(`/api/crypto/market-chart?coinId=${coinId}`, {
          method: 'GET',
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        })

        if (!marketResponse.ok) {
          const errorData = await marketResponse.json().catch(() => ({}))
          throw new Error(errorData.error || 'Market verileri alınamadı')
        }

        const marketData = await marketResponse.json()

        if (!marketData || !marketData.prices || !marketData.timestamps) {
          throw new Error('Geçersiz market verisi formatı')
        }

        // AI analizi
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          },
          cache: 'no-store',
          body: JSON.stringify({
            coinId,
            prices: marketData.timestamps.map((timestamp: number, index: number) => [
              timestamp,
              marketData.prices[index]
            ]),
            timeframe: '24h'
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || 'Analiz yapılamadı')
        }

        const result = await response.json()
        setPrediction(result)
        setHistoricalPrices(marketData.prices)

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
    return <div className="text-red-500">{error}</div>
  }

  if (!prediction) {
    return null
  }

  const predictionWithHistory = {
    ...prediction,
    historicalPrices
  }

  return <AnimatedContent coinId={coinId} prediction={predictionWithHistory} />
} 