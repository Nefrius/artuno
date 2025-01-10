'use client'

import { useEffect, useState } from 'react'
import { getTopCoins } from '@/lib/services/crypto.service'
import PageLayout from '@/components/PageLayout'
import CoinList from '@/components/CoinList'
import LoadingSpinner from '@/components/LoadingSpinner'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react'
import Image from 'next/image'

interface MarketStats {
  totalMarketCap: number
  totalVolume: number
  btcDominance: number
  marketCapChange: number
}

interface CoinData {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  total_volume: number
  market_cap_change_percentage_24h: number
  price_change_percentage_24h: number
  market_cap_rank: number
}

export default function DashboardPage() {
  const [coins, setCoins] = useState<CoinData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [marketStats, setMarketStats] = useState<MarketStats>({
    totalMarketCap: 0,
    totalVolume: 0,
    btcDominance: 0,
    marketCapChange: 0
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await getTopCoins(20)
        setCoins(data)

        // Market istatistiklerini hesapla
        const btcData = data.find((coin: CoinData) => coin.id === 'bitcoin')
        const totalMarketCap = data.reduce((sum: number, coin: CoinData) => sum + coin.market_cap, 0)
        const totalVolume = data.reduce((sum: number, coin: CoinData) => sum + coin.total_volume, 0)
        const btcDominance = btcData ? (btcData.market_cap / totalMarketCap) * 100 : 0
        const marketCapChange = data.reduce((sum: number, coin: CoinData) => sum + (coin.market_cap_change_percentage_24h || 0), 0) / data.length

        setMarketStats({
          totalMarketCap,
          totalVolume,
          btcDominance,
          marketCapChange
        })
      } catch (error) {
        console.error('Veri alınırken hata:', error)
        setError('Veriler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatNumber = (num: number) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T'
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B'
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K'
    return num.toFixed(2)
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Kripto Para Piyasası</h1>
          <p className="text-gray-600">En güncel kripto para verileri ve piyasa istatistikleri</p>
        </motion.div>

        {/* Market İstatistikleri */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                marketStats.marketCapChange >= 0 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
              }`}>
                {marketStats.marketCapChange >= 0 ? '+' : ''}
                {marketStats.marketCapChange.toFixed(2)}%
              </span>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Toplam Piyasa Değeri</h3>
            <p className="text-2xl font-bold text-gray-900">${formatNumber(marketStats.totalMarketCap)}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">24s İşlem Hacmi</h3>
            <p className="text-2xl font-bold text-gray-900">${formatNumber(marketStats.totalVolume)}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Image
                  src="/bitcoin.png"
                  alt="Bitcoin"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Bitcoin Dominansı</h3>
            <p className="text-2xl font-bold text-gray-900">{marketStats.btcDominance.toFixed(2)}%</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                {marketStats.marketCapChange >= 0 
                  ? <TrendingUp className="w-6 h-6 text-purple-600" />
                  : <TrendingDown className="w-6 h-6 text-purple-600" />
                }
              </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Piyasa Trendi</h3>
            <p className="text-2xl font-bold text-gray-900">
              {marketStats.marketCapChange >= 0 ? 'Yükseliş' : 'Düşüş'}
            </p>
          </div>
        </motion.div>

        {loading && (
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          >
            {error}
          </motion.div>
        )}

        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CoinList coins={coins} />
          </motion.div>
        )}
      </div>
    </PageLayout>
  )
} 