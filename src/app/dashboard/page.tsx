'use client'

import { useEffect, useState } from 'react'
import { CoinData, getTopCoins } from '@/lib/services/crypto.service'
import { TrendingUp, TrendingDown } from 'lucide-react'
import Image from 'next/image'
import PageLayout from '@/components/PageLayout'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [coins, setCoins] = useState<CoinData[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTopCoins(10)
        setCoins(data)
      } catch (error) {
        console.error('Veri alınırken hata:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleCoinClick = (coinId: string) => {
    router.push(`/analysis/${coinId}`)
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En Popüler Kripto Paralar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-lg rounded-2xl p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            En Popüler Kripto Paralar
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coin
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fiyat
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    24s Değişim
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Piyasa Değeri
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {coins.map((coin) => (
                  <motion.tr
                    key={coin.id}
                    whileHover={{ backgroundColor: 'rgba(243, 244, 246, 0.5)' }}
                    className="cursor-pointer"
                    onClick={() => handleCoinClick(coin.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {coin.market_cap_rank}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <Image
                            src={coin.image}
                            alt={coin.name}
                            width={40}
                            height={40}
                            className="rounded-full w-10 h-10"
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {coin.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {coin.symbol.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      ${coin.current_price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          coin.price_change_percentage_24h >= 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {coin.price_change_percentage_24h >= 0 ? (
                          <TrendingUp className="w-4 h-4 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 mr-1" />
                        )}
                        {coin.price_change_percentage_24h.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      ${coin.market_cap.toLocaleString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  )
} 