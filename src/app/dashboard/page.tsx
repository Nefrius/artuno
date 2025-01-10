'use client'

import { useEffect, useState } from 'react'
import { getTopCoins } from '@/lib/services/crypto.service'
import PageLayout from '@/components/PageLayout'
import CoinList from '../../components/CoinList'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function DashboardPage() {
  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await getTopCoins(20)
        setCoins(data)
      } catch (error) {
        console.error('Veri alınırken hata:', error)
        setError('Veriler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Kripto Para Piyasası</h1>
        
        {loading && (
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!loading && !error && <CoinList coins={coins} />}
      </div>
    </PageLayout>
  )
} 