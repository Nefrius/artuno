'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getUserData } from '@/lib/services/user.service'
import { getUserPredictions, Prediction } from '@/lib/services/prediction.service'
import PageLayout from '@/components/PageLayout'
import { motion } from 'framer-motion'
import { Settings, Award, TrendingUp, TrendingDown } from 'lucide-react'
import Image from 'next/image'

interface UserStats {
  totalPredictions: number
  successfulPredictions: number
  failedPredictions: number
  successRate: number
}

export default function ProfilePage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [userStats, setUserStats] = useState<UserStats>({
    totalPredictions: 0,
    successfulPredictions: 0,
    failedPredictions: 0,
    successRate: 0
  })
  const [predictions, setPredictions] = useState<Prediction[]>([])

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return

      try {
        setLoading(true)
        const [userData, userPredictions] = await Promise.all([
          getUserData(user.uid),
          getUserPredictions(user.uid)
        ])

        // İstatistikleri hesapla
        const completedPredictions = userPredictions.filter(p => 'result' in p && p.result !== null) as Prediction[]
        const successful = completedPredictions.filter(p => p.result === true).length
        const failed = completedPredictions.filter(p => p.result === false).length
        const successRate = completedPredictions.length > 0
          ? (successful / completedPredictions.length) * 100
          : 0

        setUserStats({
          totalPredictions: userData.total_predictions || 0,
          successfulPredictions: successful,
          failedPredictions: failed,
          successRate
        })

        setPredictions(userPredictions as Prediction[])
      } catch (error) {
        console.error('Kullanıcı verileri alınırken hata:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [user])

  if (!user) {
    return (
      <PageLayout>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Profil sayfasını görüntülemek için giriş yapmalısınız
          </h2>
        </div>
      </PageLayout>
    )
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profil Başlığı */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-lg rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {user.photoURL && (
                <Image
                  src={user.photoURL}
                  alt={user.displayName || 'Profil'}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.displayName || 'Kullanıcı'}
                </h1>
                <p className="text-gray-500">{user.email}</p>
              </div>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
              <Settings className="w-5 h-5" />
              <span>Ayarlar</span>
            </button>
          </div>
        </motion.div>

        {/* İstatistikler */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6"
        >
          <div className="bg-white shadow-lg rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Toplam Tahmin</h3>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {userStats.totalPredictions}
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Başarılı</h3>
              <Award className="w-8 h-8 text-green-500" />
            </div>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {userStats.successfulPredictions}
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Başarısız</h3>
              <TrendingDown className="w-8 h-8 text-red-500" />
            </div>
            <p className="mt-2 text-3xl font-bold text-red-600">
              {userStats.failedPredictions}
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Başarı Oranı</h3>
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-bold">%</span>
              </div>
            </div>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {userStats.successRate.toFixed(1)}%
            </p>
          </div>
        </motion.div>

        {/* Son Tahminler */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white shadow-lg rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Son Tahminler</h2>
          <div className="divide-y divide-gray-200">
            {predictions.map((prediction, index) => (
              <motion.div
                key={prediction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="py-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {prediction.coin_id.toUpperCase()}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(prediction.created_at).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        prediction.prediction_type === 'up'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {prediction.prediction_type === 'up' ? (
                        <TrendingUp className="w-4 h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                      )}
                      {prediction.prediction_type === 'up' ? 'Yükseliş' : 'Düşüş'}
                    </span>
                    {prediction.result !== null && (
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          prediction.result
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {prediction.result ? 'Doğru' : 'Yanlış'}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </PageLayout>
  )
} 