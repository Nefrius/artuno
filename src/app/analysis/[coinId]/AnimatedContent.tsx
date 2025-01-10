'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from 'lucide-react'
import Link from 'next/link'
import CoinImage from '@/components/CoinImage'
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
  Filler,
  TimeScale
} from 'chart.js'
import type { ChartData, ChartOptions, TooltipItem } from 'chart.js'
import 'chartjs-adapter-date-fns'
import { tr } from 'date-fns/locale'

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

  const chartData: ChartData<'line'> = {
    labels: Array.from({ length: 24 }, (_, i) => {
      const date = new Date()
      date.setHours(date.getHours() - (23 - i))
      return date
    }),
    datasets: [
      {
        label: 'Gerçek Fiyat',
        data: prediction.historicalPrices,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Tahmin',
        data: Array(23).fill(null).concat(prediction.predictedPrice),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderDash: [5, 5],
        fill: true,
        tension: 0.4
      }
    ]
  }

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            family: 'system-ui'
          },
          padding: 20,
          usePointStyle: true,
        }
      },
      title: {
        display: true,
        text: '24 Saatlik Fiyat Tahmini',
        font: {
          size: 16,
          family: 'system-ui',
          weight: 'bold' as const
        },
        padding: 20
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1f2937',
        bodyColor: '#1f2937',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        bodyFont: {
          size: 14,
          family: 'system-ui'
        },
        titleFont: {
          size: 14,
          family: 'system-ui',
          weight: 'bold'
        },
        callbacks: {
          label: function(tooltipItem: TooltipItem<'line'>) {
            if (tooltipItem.dataset.label && tooltipItem.formattedValue) {
              return `${tooltipItem.dataset.label}: $${tooltipItem.formattedValue}`
            }
            return ''
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time',
        adapters: {
          date: {
            locale: tr
          }
        },
        time: {
          unit: 'hour',
          displayFormats: {
            hour: 'HH:mm'
          },
          tooltipFormat: 'HH:mm'
        },
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12
          },
          maxRotation: 0
        }
      },
      y: {
        grid: {
          color: '#f3f4f6'
        },
        ticks: {
          font: {
            size: 12,
            family: 'system-ui'
          },
          callback: function(tickValue: number | string) {
            const value = typeof tickValue === 'string' ? parseFloat(tickValue) : tickValue
            return '$' + value.toFixed(2)
          }
        }
      }
    }
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
              ${prediction.historicalPrices[prediction.historicalPrices.length - 1].toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="bg-gray-50 p-4 rounded-lg" style={{ height: '400px' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">AI Tahmini</h2>
            <div className="flex items-center justify-between mb-2">
              <span className={highlightColor}>24h Sonrası Tahmin:</span>
              <div className="flex items-center">
                <ArrowIcon className={`w-5 h-5 ${trendColor} mr-2`} />
                <span className={`font-bold ${trendColor}`}>${prediction.predictedPrice.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className={highlightColor}>Güven Seviyesi:</span>
              <div className="flex items-center">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${prediction.trend === 'up' ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${prediction.confidence * 100}%` }}
                  />
                </div>
                <span className="ml-2 font-semibold">{(prediction.confidence * 100).toFixed(0)}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={highlightColor}>Trend:</span>
              <div className="flex items-center">
                <TrendIcon className={`w-5 h-5 ${trendColor} mr-2`} />
                <span className={`font-semibold ${trendColor}`}>
                  {prediction.trend === 'up' ? 'Yükseliş' : 'Düşüş'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">Teknik Göstergeler</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-gray-600 text-sm mb-2">RSI</div>
                <div className="text-2xl font-bold text-gray-900">{prediction.technicalIndicators.rsi.toFixed(2)}</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-gray-600 text-sm mb-2">MACD</div>
                <div className="text-2xl font-bold text-gray-900">{prediction.technicalIndicators.macd.toFixed(2)}</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-gray-600 text-sm mb-2">SMA (20)</div>
                <div className="text-2xl font-bold text-gray-900">{prediction.technicalIndicators.sma20.toFixed(2)}</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-gray-600 text-sm mb-2">EMA (50)</div>
                <div className="text-2xl font-bold text-gray-900">{prediction.technicalIndicators.ema50.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">Piyasa Analizi</h2>
            {prediction.marketAnalysis.map((analysis, index) => (
              <div key={index} className="mb-4">
                <p className="text-gray-700">{analysis.summary}</p>
                <div className="mt-2 text-sm text-gray-500">
                  {new Date(analysis.timestamp).toLocaleString('tr-TR')}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">Analiz Detayları</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {prediction.reasoning.map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">Model Bilgileri</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2 text-blue-700">Teknik Detaylar</h3>
            <p className="text-gray-700 mb-2">Model: {prediction.modelInfo.name}</p>
            <p className="text-gray-700 mb-2">Tip: {prediction.modelInfo.type}</p>
            <p className="text-gray-700">Güncelleme Sıklığı: {prediction.modelInfo.updateFrequency}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-blue-700">Doğruluk Oranları</h3>
            <p className="text-gray-700 mb-2">Genel: {prediction.modelInfo.accuracy.overall}</p>
            <p className="text-gray-700 mb-2">Kısa Vadeli: {prediction.modelInfo.accuracy.shortTerm}</p>
            <p className="text-gray-700">Uzun Vadeli: {prediction.modelInfo.accuracy.longTerm}</p>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold mb-2 text-blue-700">Kullanılan Teknolojiler</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {prediction.modelInfo.components.map((component, index) => (
              <li key={index}>{component}</li>
            ))}
          </ul>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold mb-2 text-blue-700">Metodoloji</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {prediction.modelInfo.methodology.map((method, index) => (
              <li key={index}>{method}</li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  )
} 