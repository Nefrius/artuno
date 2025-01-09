'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getUserData } from '@/lib/services/user.service'
import { getUserPredictions, Prediction, deletePrediction } from '@/lib/services/prediction.service'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Award, Trash2 } from 'lucide-react'
import Image from 'next/image'

interface UserData {
  id: string
  email: string
  total_predictions: number
  daily_predictions_left: number
}

interface UserStats {
  totalPredictions: number
  successfulPredictions: number
  failedPredictions: number
  successRate: number
}

interface UserProfileContentProps {
  userId: string
}

export default function UserProfileContent({ userId }: UserProfileContentProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [stats, setStats] = useState<UserStats>({
    totalPredictions: 0,
    successfulPredictions: 0,
    failedPredictions: 0,
    successRate: 0
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const [userDataResponse, userPredictions] = await Promise.all([
          getUserData(userId),
          getUserPredictions(userId)
        ])

        setUserData(userDataResponse)
        setPredictions(userPredictions)

        // İstatistikleri hesapla
        const completedPredictions = userPredictions.filter(p => p.result !== null)
        const successful = completedPredictions.filter(p => p.result === true).length
        const failed = completedPredictions.filter(p => p.result === false).length
        const successRate = completedPredictions.length > 0
          ? (successful / completedPredictions.length) * 100
          : 0

        setStats({
          totalPredictions: userDataResponse.total_predictions || 0,
          successfulPredictions: successful,
          failedPredictions: failed,
          successRate
        })
      } catch (error) {
        console.error('Kullanıcı verileri alınırken hata:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [userId])

  const handleDelete = async (predictionId: string) => {
    if (!window.confirm('Bu tahmini silmek istediğinize emin misiniz?')) {
      return
    }

    try {
      await deletePrediction(predictionId)
      // Tahminleri güncelle
      const updatedPredictions = predictions.filter(p => p.id !== predictionId)
      setPredictions(updatedPredictions)
      
      // İstatistikleri güncelle
      const completedPredictions = updatedPredictions.filter(p => p.result !== null)
      const successful = completedPredictions.filter(p => p.result === true).length
      const failed = completedPredictions.filter(p => p.result === false).length
      const successRate = completedPredictions.length > 0
        ? (successful / completedPredictions.length) * 100
        : 0

      setStats({
        totalPredictions: updatedPredictions.length,
        successfulPredictions: successful,
        failedPredictions: failed,
        successRate
      })
    } catch (error) {
      console.error('Tahmin silinirken hata:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Kullanıcı bulunamadı
        </h2>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Profil Başlığı */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg rounded-2xl p-4 sm:p-6 mb-6"
      >
        <div className="flex flex-col sm:flex-row items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="h-20 w-20 sm:h-16 sm:w-16 rounded-full bg-indigo-100 flex items-center justify-center">
              <Image
                src={user?.photoURL || '/default-avatar.png'}
                alt={userData.email}
                width={80}
                height={80}
                className="rounded-full"
              />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900">
                {userData.email.split('@')[0]}
              </h1>
              <p className="text-gray-500">{userData.email}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* İstatistikler */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col gap-4 sm:grid sm:grid-cols-2 md:grid-cols-4 sm:gap-6 mb-6"
      >
        <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6 w-full">
          <div className="flex items-center justify-between mb-2 sm:mb-0">
            <h3 className="text-base sm:text-lg font-medium text-gray-900">Toplam Tahmin</h3>
            <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
          </div>
          <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-gray-900">
            {stats.totalPredictions}
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6 w-full">
          <div className="flex items-center justify-between mb-2 sm:mb-0">
            <h3 className="text-base sm:text-lg font-medium text-gray-900">Başarılı</h3>
            <Award className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
          </div>
          <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-green-600">
            {stats.successfulPredictions}
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6 w-full">
          <div className="flex items-center justify-between mb-2 sm:mb-0">
            <h3 className="text-base sm:text-lg font-medium text-gray-900">Başarısız</h3>
            <TrendingDown className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
          </div>
          <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-red-600">
            {stats.failedPredictions}
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6 w-full">
          <div className="flex items-center justify-between mb-2 sm:mb-0">
            <h3 className="text-base sm:text-lg font-medium text-gray-900">Başarı Oranı</h3>
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm sm:text-base">%</span>
            </div>
          </div>
          <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-blue-600">
            {stats.successRate.toFixed(1)}%
          </p>
        </div>
      </motion.div>

      {/* Son Tahminler */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white shadow-lg rounded-2xl p-4 sm:p-6"
      >
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Son Tahminler</h2>
        <div className="divide-y divide-gray-200">
          {predictions.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              Henüz tahmin yapılmamış
            </div>
          ) : (
            predictions.map((prediction, index) => (
              <motion.div
                key={prediction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="py-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <div>
                    <h3 className="text-base sm:text-lg font-medium text-gray-900">
                      {prediction.coin_id.toUpperCase()}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {new Date(prediction.created_at).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:space-x-4">
                    <span
                      className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                        prediction.prediction_type === 'up'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {prediction.prediction_type === 'up' ? (
                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      )}
                      {prediction.prediction_type === 'up' ? 'Yükseliş' : 'Düşüş'}
                    </span>
                    {prediction.result !== null && (
                      <span
                        className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                          prediction.result
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {prediction.result ? 'Doğru' : 'Yanlış'}
                      </span>
                    )}
                    {user?.uid === userId && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(prediction.id)}
                        className="p-1 text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  )
} 