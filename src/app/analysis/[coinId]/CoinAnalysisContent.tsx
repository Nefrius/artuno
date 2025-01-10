'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Line } from 'react-chartjs-2'
import { useRouter } from 'next/navigation'
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
import { formatPrice, formatDate, getTimeAgo } from '../../../lib/utils'
import { FaArrowUp, FaArrowDown, FaNewspaper, FaChartLine, FaClock, FaArrowLeft } from 'react-icons/fa'
import { IconType } from 'react-icons'

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

interface CoinAnalysisContentProps {
  coinId: string
}

interface PriceData {
  prices: [number, number][]
}

interface NewsItem {
  title: string
  url: string
  publishedAt: string
  sentiment: 'positive' | 'negative' | 'neutral'
}

interface MarketAnalysis {
  source: string
  summary: string
  sentiment: 'bullish' | 'bearish' | 'neutral'
  timestamp: string
}

interface AIPrediction {
  prediction: number
  confidence: number
  trend: 'up' | 'down'
  technicalIndicators: {
    rsi: number
    macd: number
    sma20: number
    ema50: number
  }
  news: NewsItem[]
  marketAnalysis: MarketAnalysis[]
  reasoning: string[]
}

// Başlık bileşeni
const SectionTitle = ({ icon: Icon, text }: { icon: IconType, text: string }) => (
  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-800 border-b pb-3">
    <Icon className="text-blue-500 w-7 h-7" />
    <span>{text}</span>
  </h2>
)

export default function CoinAnalysisContent({ coinId }: CoinAnalysisContentProps) {
  const router = useRouter()
  const [priceData, setPriceData] = useState<PriceData | null>(null)
  const [aiPrediction, setAiPrediction] = useState<AIPrediction | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [timeframe, setTimeframe] = useState<'3h' | '12h' | '24h'>('24h')
  const [showNews, setShowNews] = useState(false)
  const [showAnalysis, setShowAnalysis] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fiyat verilerini al
        const priceResponse = await fetch(`/api/crypto/market-chart?coinId=${coinId}`)
        if (!priceResponse.ok) {
          throw new Error('Fiyat verileri alınamadı')
        }
        const priceData = await priceResponse.json()
        setPriceData(priceData)

        // AI tahminini al
        const aiResponse = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            coinId,
            prices: priceData.prices,
            timeframe
          }),
        })
        if (!aiResponse.ok) {
          throw new Error('AI tahmini alınamadı')
        }
        const aiData = await aiResponse.json()
        setAiPrediction(aiData)

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [coinId, timeframe])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-red-500 text-center p-4"
      >
        {error}
      </motion.div>
    )
  }

  if (!priceData || !aiPrediction) {
    return null
  }

  const chartData = {
    labels: priceData.prices.map(([timestamp]) => formatDate(timestamp)),
    datasets: [
      {
        label: 'Fiyat',
        data: priceData.prices.map(([, price]) => price),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Fiyat Grafiği',
        font: {
          size: 16,
          weight: 'bold' as const
        }
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          display: false
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-4 max-w-7xl mx-auto"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 bg-white rounded-lg shadow-lg px-6 py-3 text-lg"
      >
        <FaArrowLeft className="w-5 h-5" />
        <span>Geri Dön</span>
      </motion.button>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <SectionTitle icon={FaChartLine} text="Fiyat Grafiği" />
          <div className="flex gap-3">
            {(['3h', '12h', '24h'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-4 py-2 rounded-lg text-base font-medium transition-colors ${
                  timeframe === t
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="h-72">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="bg-white rounded-lg shadow-lg p-6">
          <SectionTitle icon={FaChartLine} text="AI Tahmini" />
          <div className="space-y-6">
            <div className="flex items-center justify-between p-5 bg-gray-50 rounded-lg border border-gray-100">
              <span className="text-gray-700 font-medium text-lg">
                {timeframe} Sonrası Tahmin:
              </span>
              <span className="font-bold text-2xl text-blue-600">
                {formatPrice(aiPrediction.prediction)}
              </span>
            </div>
            <div className="flex items-center justify-between p-5 bg-gray-50 rounded-lg border border-gray-100">
              <span className="text-gray-700 font-medium text-lg">Güven Seviyesi:</span>
              <div className="flex items-center">
                <div className="w-40 h-3 bg-gray-200 rounded-full mr-3">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${Math.round(aiPrediction.confidence * 100)}%` }}
                  />
                </div>
                <span className="font-bold text-xl">
                  %{Math.round(aiPrediction.confidence * 100)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between p-5 bg-gray-50 rounded-lg border border-gray-100">
              <span className="text-gray-700 font-medium text-lg">Trend:</span>
              <span className={`flex items-center font-bold text-xl ${
                aiPrediction.trend === 'up' ? 'text-green-500' : 'text-red-500'
              }`}>
                {aiPrediction.trend === 'up' ? (
                  <FaArrowUp className="mr-2 w-6 h-6" />
                ) : (
                  <FaArrowDown className="mr-2 w-6 h-6" />
                )}
                {aiPrediction.trend === 'up' ? 'Yükseliş' : 'Düşüş'}
              </span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowDetails(!showDetails)}
            className="mt-6 w-full bg-gray-100 text-gray-700 py-4 px-6 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-3 text-lg font-medium"
          >
            <FaClock className="w-5 h-5" />
            {showDetails ? 'Teknik Detayları Gizle' : 'Teknik Detayları Göster'}
          </motion.button>

          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: showDetails ? 'auto' : 0,
              opacity: showDetails ? 1 : 0
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mt-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-gray-50 rounded-lg border border-gray-100">
                <div className="text-base text-gray-600 mb-2">RSI (14)</div>
                <div className="font-bold text-2xl text-gray-800">
                  {Math.round(aiPrediction.technicalIndicators.rsi)}
                </div>
                <div className="text-sm mt-2 font-medium text-gray-500">
                  {aiPrediction.technicalIndicators.rsi > 70 ? 'Aşırı Alım' : 
                   aiPrediction.technicalIndicators.rsi < 30 ? 'Aşırı Satım' : 'Normal'}
                </div>
              </div>
              <div className="p-5 bg-gray-50 rounded-lg border border-gray-100">
                <div className="text-base text-gray-600 mb-2">MACD</div>
                <div className="font-bold text-2xl text-gray-800">
                  {aiPrediction.technicalIndicators.macd.toFixed(2)}
                </div>
                <div className="text-sm mt-2 font-medium text-gray-500">
                  {aiPrediction.technicalIndicators.macd > 0 ? 'Pozitif' : 'Negatif'}
                </div>
              </div>
              <div className="p-5 bg-gray-50 rounded-lg border border-gray-100">
                <div className="text-base text-gray-600 mb-2">SMA (20)</div>
                <div className="font-bold text-2xl text-gray-800">
                  {formatPrice(aiPrediction.technicalIndicators.sma20)}
                </div>
              </div>
              <div className="p-5 bg-gray-50 rounded-lg border border-gray-100">
                <div className="text-base text-gray-600 mb-2">EMA (50)</div>
                <div className="font-bold text-2xl text-gray-800">
                  {formatPrice(aiPrediction.technicalIndicators.ema50)}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <SectionTitle icon={FaNewspaper} text="Haberler ve Analizler" />
            
            <div className="space-y-4">
              <button
                onClick={() => setShowNews(!showNews)}
                className="w-full bg-gray-100 text-gray-700 py-4 px-6 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-between text-lg font-medium"
              >
                <span>Son Haberler</span>
                <FaArrowDown className={`transform transition-transform w-5 h-5 ${showNews ? 'rotate-180' : ''}`} />
              </button>
              
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ 
                  height: showNews ? 'auto' : 0,
                  opacity: showNews ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                {aiPrediction.news.map((item, index) => (
                  <div key={index} className="p-5 border-b last:border-b-0">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-lg text-gray-800">{item.title}</h3>
                      <span className={`text-base px-3 py-1 rounded-full font-medium ${
                        item.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                        item.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {item.sentiment === 'positive' ? 'Olumlu' :
                         item.sentiment === 'negative' ? 'Olumsuz' : 'Nötr'}
                      </span>
                    </div>
                    <div className="text-base text-gray-500">
                      {getTimeAgo(new Date(item.publishedAt).getTime())}
                    </div>
                  </div>
                ))}
              </motion.div>

              <button
                onClick={() => setShowAnalysis(!showAnalysis)}
                className="w-full bg-gray-100 text-gray-700 py-4 px-6 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-between text-lg font-medium"
              >
                <span>Piyasa Analizleri</span>
                <FaArrowDown className={`transform transition-transform w-5 h-5 ${showAnalysis ? 'rotate-180' : ''}`} />
              </button>

              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ 
                  height: showAnalysis ? 'auto' : 0,
                  opacity: showAnalysis ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                {aiPrediction.marketAnalysis.map((analysis, index) => (
                  <div key={index} className="p-5 border-b last:border-b-0">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-base font-medium text-gray-700">{analysis.source}</span>
                      <span className={`text-base px-3 py-1 rounded-full font-medium ${
                        analysis.sentiment === 'bullish' ? 'bg-green-100 text-green-700' :
                        analysis.sentiment === 'bearish' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {analysis.sentiment === 'bullish' ? 'Yükseliş' :
                         analysis.sentiment === 'bearish' ? 'Düşüş' : 'Nötr'}
                      </span>
                    </div>
                    <p className="text-gray-700 text-lg mb-3">{analysis.summary}</p>
                    <div className="text-base text-gray-500">
                      {getTimeAgo(new Date(analysis.timestamp).getTime())}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <SectionTitle icon={FaChartLine} text="AI Değerlendirmesi" />
            <div className="space-y-4">
              {aiPrediction.reasoning.map((reason, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                  <p className="text-gray-700 text-lg">{reason}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
} 