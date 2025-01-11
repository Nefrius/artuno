'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, ChartBar, Activity, BarChart2, FileText, Clock } from 'lucide-react'
import Link from 'next/link'
import CoinImage from '@/components/CoinImage'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale
} from 'chart.js'
import 'chartjs-adapter-date-fns'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale
)

interface AnimatedContentProps {
  coinId: string
  prediction: {
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
    historicalPrices: number[]
  }
}

export default function AnimatedContent({ coinId, prediction }: AnimatedContentProps) {
  const TrendIcon = prediction.trend === 'up' ? TrendingUp : TrendingDown
  const ArrowIcon = prediction.trend === 'up' ? ArrowUpRight : ArrowDownRight
  const trendColor = prediction.trend === 'up' ? 'text-green-500' : 'text-red-500'
  const highlightColor = 'text-blue-700 font-semibold'

  const formatPrice = (price: number | undefined | null): number => {
    if (typeof price !== 'number' || isNaN(price)) return 0
    return Number(price.toFixed(2))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-white rounded-lg shadow-lg"
    >
      <div className="flex items-center mb-6">
        <Link href="/dashboard" className="mr-4">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </Link>
        <div className="flex items-center">
          <CoinImage src={`/api/coin-image/${coinId}`} size="lg" className="mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              {coinId.charAt(0).toUpperCase() + coinId.slice(1)} Analizi
            </h1>
            <div className="text-xl font-semibold text-gray-700 mt-1">
              ${formatPrice(prediction.historicalPrices?.[prediction.historicalPrices.length - 1])}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
        <div className="flex items-center justify-center mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700 mr-3"></div>
          <h2 className="text-xl font-bold text-blue-700">Grafik Görünümü Bakım Aşamasında</h2>
        </div>
        <p className="text-blue-600 text-center">
          Daha iyi bir deneyim sunmak için grafik görünümümüzü güncelliyoruz. 
          Bu süreçte size daha detaylı analiz verileri sunmaya devam ediyoruz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-blue-700 flex items-center">
              <ChartBar className="w-6 h-6 mr-2" />
              AI Tahmini
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                <span className={highlightColor}>24h Sonrası Tahmin:</span>
                <div className="flex items-center">
                  <ArrowIcon className={`w-5 h-5 ${trendColor} mr-2`} />
                  <span className={`font-bold ${trendColor} text-lg`}>
                    ${formatPrice(prediction.predictedPrice)}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                <span className={highlightColor}>Güven Seviyesi:</span>
                <div className="flex items-center">
                  <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${prediction.trend === 'up' ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${(prediction.confidence || 0) * 100}%` }}
                    />
                  </div>
                  <span className="ml-3 font-bold text-lg">{((prediction.confidence || 0) * 100).toFixed(0)}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                <span className={highlightColor}>Trend Analizi:</span>
                <div className="flex items-center">
                  <TrendIcon className={`w-5 h-5 ${trendColor} mr-2`} />
                  <span className={`font-bold ${trendColor} text-lg`}>
                    {prediction.trend === 'up' ? 'Yükseliş Trendi' : 'Düşüş Trendi'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-blue-700 flex items-center">
              <Activity className="w-6 h-6 mr-2" />
              Teknik Göstergeler
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <div className="text-gray-600 text-sm mb-1">RSI</div>
                <div className="text-2xl font-bold text-gray-900">{prediction.technicalIndicators.rsi.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">Göreceli Güç İndeksi</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <div className="text-gray-600 text-sm mb-1">MACD</div>
                <div className="text-2xl font-bold text-gray-900">{prediction.technicalIndicators.macd.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">Hareketli Ortalama</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <div className="text-gray-600 text-sm mb-1">SMA (20)</div>
                <div className="text-2xl font-bold text-gray-900">{prediction.technicalIndicators.sma20.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">Basit Hareketli Ortalama</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <div className="text-gray-600 text-sm mb-1">EMA (50)</div>
                <div className="text-2xl font-bold text-gray-900">{prediction.technicalIndicators.ema50.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">Üssel Hareketli Ortalama</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-blue-700 flex items-center">
              <BarChart2 className="w-6 h-6 mr-2" />
              Piyasa Analizi
            </h2>
            {prediction.marketAnalysis.map((analysis, index) => (
              <div key={index} className="mb-4 bg-white p-4 rounded-lg shadow-sm">
                <p className="text-gray-700">{analysis.summary}</p>
                <div className="mt-2 text-sm text-gray-500 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {new Date(analysis.timestamp).toLocaleString('tr-TR')}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-blue-700 flex items-center">
              <FileText className="w-6 h-6 mr-2" />
              Analiz Detayları
            </h2>
            <ul className="space-y-3">
              {prediction.reasoning.map((reason, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-blue-700 text-sm font-bold">{index + 1}</span>
                  </div>
                  <p className="text-gray-700">{reason}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  )
} 