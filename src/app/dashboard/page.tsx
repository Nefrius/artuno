'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CoinData, getTopCoins } from '@/lib/services/crypto.service'
import CoinImage from '@/components/CoinImage'

export default function Dashboard() {
  const { user, userData, loading, error, logout } = useAuth()
  const router = useRouter()
  const [coins, setCoins] = useState<CoinData[]>([])
  const [coinsLoading, setCoinsLoading] = useState(true)
  const [coinsError, setCoinsError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        setCoinsError(null)
        const data = await getTopCoins(5)
        setCoins(data)
      } catch (error) {
        console.error('Kripto para verileri alınırken hata:', error)
        setCoinsError('Kripto para verileri alınamadı')
      } finally {
        setCoinsLoading(false)
      }
    }

    fetchCoins()
    const interval = setInterval(fetchCoins, 120000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Artuno</h1>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">{user?.email}</span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900">Günlük Tahmin Hakkı</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {userData?.daily_predictions_left || 0}
                </p>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900">Toplam Tahmin</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {userData?.total_predictions || 0}
                </p>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900">Son Güncelleme</h3>
                <p className="mt-2 text-sm text-gray-500">
                  {coinsLoading ? 'Yükleniyor...' : new Date().toLocaleTimeString('tr-TR')}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">En Popüler Kripto Paralar</h2>
            {coinsError && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{coinsError}</p>
                  </div>
                </div>
              </div>
            )}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {coinsLoading ? (
                  <li className="p-4 text-center">Yükleniyor...</li>
                ) : (
                  coins.map((coin) => (
                    <li key={coin.id} className="px-6 py-4 hover:bg-gray-50 cursor-pointer" onClick={() => router.push(`/coins/${coin.id}`)}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CoinImage src={coin.image} name={coin.name} size="sm" />
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">{coin.name}</p>
                            <p className="text-sm text-gray-500">{coin.symbol.toUpperCase()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            ${coin.current_price.toLocaleString()}
                          </p>
                          <p className={`text-sm ${
                            coin.price_change_percentage_24h >= 0
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}>
                            {coin.price_change_percentage_24h.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 