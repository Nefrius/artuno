'use client'

import { useEffect, useState, ReactElement } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import type { CoinDetail } from '@/lib/services/crypto.service'
import { getCoinDetail } from '@/lib/services/crypto.service'
import { use } from 'react'
import CoinImage from '@/components/CoinImage'

interface PageProps {
  params: Promise<{ id: string }>
}

function formatDescription(description: string): ReactElement {
  // HTML içeriğini güvenli bir şekilde render et
  return (
    <div
      className="prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{
        __html: description.replace(
          /<a\s+href="([^"]+)"[^>]*>([^<]+)<\/a>/g,
          (match, url, text) => {
            // Harici bağlantıları yeni sekmede aç
            return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800">${text}</a>`
          }
        )
      }}
    />
  )
}

export default function CoinDetailPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { user, loading } = useAuth()
  const [coin, setCoin] = useState<CoinDetail | null>(null)
  const [coinLoading, setCoinLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchCoinDetail = async () => {
      try {
        const data = await getCoinDetail(resolvedParams.id)
        setCoin(data)
      } catch (error) {
        console.error('Kripto para detayları alınırken hata:', error)
      } finally {
        setCoinLoading(false)
      }
    }

    fetchCoinDetail()
  }, [resolvedParams.id])

  if (loading || coinLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Yükleniyor...</div>
      </div>
    )
  }

  if (!coin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Kripto para bulunamadı</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-500 hover:text-gray-700"
              >
                ← Geri
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex items-center">
                <CoinImage src={coin.image} name={coin.name} size="md" />
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {coin.name} ({coin.symbol.toUpperCase()})
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Piyasa Değeri: ${new Intl.NumberFormat('en-US').format(coin.market_data.market_cap.usd)}
                  </p>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Güncel Fiyat</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    ${coin.market_data.current_price.usd.toLocaleString()}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">24s Değişim</dt>
                  <dd className={`mt-1 text-sm ${
                    coin.market_data.price_change_percentage_24h >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    {coin.market_data.price_change_percentage_24h.toFixed(2)}%
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">7g Değişim</dt>
                  <dd className={`mt-1 text-sm ${
                    coin.market_data.price_change_percentage_7d >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    {coin.market_data.price_change_percentage_7d.toFixed(2)}%
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">30g Değişim</dt>
                  <dd className={`mt-1 text-sm ${
                    coin.market_data.price_change_percentage_30d >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    {coin.market_data.price_change_percentage_30d.toFixed(2)}%
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Açıklama</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatDescription(coin.description.tr || coin.description.en)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 