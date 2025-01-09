'use client'

import { useEffect, useState } from 'react'
import { getCoinData, getHistoricalData, CoinData } from '@/lib/services/crypto.service'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import PageLayout from '@/components/PageLayout'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, DollarSign, Clock } from 'lucide-react'
import Image from 'next/image'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface HistoricalData {
  prices: [number, number][]
  market_caps: [number, number][]
  total_volumes: [number, number][]
}

interface PriceAnalysis {
  prediction: number
  confidence: number
  trend: 'up' | 'down'
  explanation: string
}

interface CoinAnalysisContentProps {
  coinId: string
}

export default function CoinAnalysisContent({ coinId }: CoinAnalysisContentProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [coinData, setCoinData] = useState<CoinData | null>(null)
  const [historicalData, setHistoricalData] = useState<HistoricalData | null>(null)
  const [analysis, setAnalysis] = useState<PriceAnalysis | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const [coin, history] = await Promise.all([
          getCoinData(coinId),
          getHistoricalData(coinId)
        ])
        setCoinData(coin)
        setHistoricalData(history)

        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            coinId: coinId,
            historicalData: history
          })
        })

        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Analiz yapılırken bir hata oluştu')
        }

        setAnalysis(data)
      } catch (error) {
        console.error('Veri alınırken hata:', error)
        setError(error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [coinId])

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </PageLayout>
    )
  }

  if (error) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Hata!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        </div>
      </PageLayout>
    )
  }

  if (!coinData || !historicalData || !analysis) {
    return (
      <PageLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">
            Veri bulunamadı
          </h2>
        </div>
      </PageLayout>
    )
  }

  const chartData = {
    labels: historicalData.prices.map(([timestamp]) => 
      new Date(timestamp).toLocaleDateString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    ),
    datasets: [
      {
        label: 'Fiyat (USD)',
        data: historicalData.prices.map(([, price]) => price),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: '24 Saatlik Fiyat Grafiği'
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      }
    }
  }

  return (
    <PageLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* Coin Başlığı */}
        <div className="bg-white shadow-lg rounded-2xl p-6 mb-8">
          <div className="flex items-center space-x-4">
            <Image
              src={coinData.image}
              alt={coinData.name}
              width={64}
              height={64}
              className="rounded-full"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {coinData.name} ({coinData.symbol.toUpperCase()})
              </h1>
              <p className="text-xl text-gray-600">
                ${coinData.current_price.toLocaleString()}
              </p>
            </div>
            <span
              className={`ml-auto inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                coinData.price_change_percentage_24h >= 0
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {coinData.price_change_percentage_24h >= 0 ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              {coinData.price_change_percentage_24h.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Fiyat Grafiği */}
        <div className="bg-white shadow-lg rounded-2xl p-6 mb-8">
          <Line data={chartData} options={chartOptions} className="h-[400px]" />
        </div>

        {/* İstatistikler */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white shadow-lg rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-gray-900">Piyasa Değeri</h3>
              <DollarSign className="w-6 h-6 text-indigo-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ${coinData.market_cap.toLocaleString()}
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-gray-900">24s Hacim</h3>
              <Clock className="w-6 h-6 text-indigo-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ${coinData.total_volume.toLocaleString()}
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-gray-900">24s En Yüksek</h3>
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ${coinData.high_24h.toLocaleString()}
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-gray-900">24s En Düşük</h3>
              <TrendingDown className="w-6 h-6 text-red-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ${coinData.low_24h.toLocaleString()}
            </p>
          </div>
        </div>

        {/* AI Analizi */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white shadow-lg rounded-2xl p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Yapay Zeka Analizi
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium text-gray-900">
                  24 Saat Sonrası İçin Tahmin:
                </p>
                <p className="text-3xl font-bold text-indigo-600">
                  ${analysis.prediction.toLocaleString()}
                </p>
              </div>
              <span
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  analysis.trend === 'up'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {analysis.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                Güven: %{analysis.confidence}
              </span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Analiz Açıklaması:
              </h3>
              <p className="text-gray-600">
                {analysis.explanation}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </PageLayout>
  )
} 