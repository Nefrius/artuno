'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { CoinData, getTopCoins } from '@/lib/services/crypto.service'
import { Prediction, createPrediction, getUserPredictions, deletePrediction } from '@/lib/services/prediction.service'
import { TrendingUp, TrendingDown, Clock, CheckCircle, XCircle, Trash2 } from 'lucide-react'
import Image from 'next/image'
import PageLayout from '@/components/PageLayout'
import { motion } from 'framer-motion'
import { useAlert } from '@/components/Alert'

export default function PredictionsPage() {
  const { user } = useAuth()
  const { showAlert } = useAlert()
  const [coins, setCoins] = useState<CoinData[]>([])
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [selectedCoin, setSelectedCoin] = useState<string>('')
  const [predictionType, setPredictionType] = useState<'up' | 'down'>('up')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coinsData, userPredictions] = await Promise.all([
          getTopCoins(10),
          user ? getUserPredictions(user.uid) : [],
        ])
        setCoins(coinsData)
        setPredictions(userPredictions)
      } catch (error) {
        console.error('Veri alınırken hata:', error)
        showAlert('Veriler alınırken bir hata oluştu.', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, showAlert])

  const handleCreatePrediction = async () => {
    if (!user || !selectedCoin) return

    try {
      setLoading(true)
      const targetDate = new Date()
      targetDate.setDate(targetDate.getDate() + 1)

      const newPrediction = await createPrediction({
        userId: user.uid,
        coinId: selectedCoin,
        targetDate: targetDate,
        predictedPrice: 0,
        prediction_type: predictionType
      }) as Prediction

      if (newPrediction) {
        setPredictions([newPrediction, ...predictions])
        setSelectedCoin('')
        showAlert('Tahmin başarıyla oluşturuldu!', 'success')
      }
    } catch (error) {
      console.error('Tahmin oluşturulurken hata:', error)
      showAlert('Tahmin oluşturulurken bir hata oluştu.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (predictionId: string) => {
    if (!window.confirm('Bu tahmini silmek istediğinize emin misiniz?')) {
      return
    }

    try {
      await deletePrediction(predictionId)
      setPredictions(predictions.filter(p => p.id !== predictionId))
      showAlert('Tahmin başarıyla silindi.', 'success')
    } catch (error) {
      console.error('Tahmin silinirken hata:', error)
      showAlert('Tahmin silinirken bir hata oluştu.', 'error')
    }
  }

  if (!user) {
    return (
      <PageLayout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Tahmin yapmak için giriş yapmalısınız
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Google hesabınızla giriş yaparak hemen tahminlerinizi oluşturmaya başlayabilirsiniz.
          </p>
        </motion.div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
          <div className="px-6 py-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Yeni Tahmin Oluştur
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div>
                <label htmlFor="coin" className="block text-sm font-medium text-gray-700 mb-2">
                  Kripto Para
                </label>
                <select
                  id="coin"
                  value={selectedCoin}
                  onChange={(e) => setSelectedCoin(e.target.value)}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Seçiniz</option>
                  {coins.map((coin) => (
                    <option key={coin.id} value={coin.id}>
                      {coin.name} ({coin.symbol.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tahmin Yönü
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200 ease-in-out">
                    <input
                      type="radio"
                      className="hidden"
                      value="up"
                      checked={predictionType === 'up'}
                      onChange={(e) => setPredictionType(e.target.value as 'up' | 'down')}
                    />
                    <TrendingUp className={`w-5 h-5 ${predictionType === 'up' ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className={`ml-2 ${predictionType === 'up' ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                      Yükseliş
                    </span>
                  </label>
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200 ease-in-out">
                    <input
                      type="radio"
                      className="hidden"
                      value="down"
                      checked={predictionType === 'down'}
                      onChange={(e) => setPredictionType(e.target.value as 'up' | 'down')}
                    />
                    <TrendingDown className={`w-5 h-5 ${predictionType === 'down' ? 'text-red-600' : 'text-gray-400'}`} />
                    <span className={`ml-2 ${predictionType === 'down' ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                      Düşüş
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleCreatePrediction}
                  disabled={loading || !selectedCoin}
                  className="w-full h-12 flex items-center justify-center px-8 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ease-in-out"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Tahmin Oluştur'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Tahminleriniz
          </h3>
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
            <div className="divide-y divide-gray-200">
              {predictions.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Clock className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Henüz tahmin yapmadınız
                  </h3>
                  <p className="text-gray-500">
                    Yukarıdaki formu kullanarak ilk tahmininizi oluşturabilirsiniz.
                  </p>
                </div>
              ) : (
                predictions.map((prediction, index) => {
                  const coin = coins.find((c) => c.id === prediction.coin_id)
                  return (
                    <motion.div
                      key={prediction.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                      className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200 ease-in-out"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {coin && (
                            <div className="w-10 h-10 rounded-full overflow-hidden mr-4">
                              <Image
                                src={coin.image}
                                alt={coin.name}
                                width={40}
                                height={40}
                              />
                            </div>
                          )}
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">
                              {coin?.name || prediction.coin_id}
                            </h4>
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
                              {prediction.result ? (
                                <CheckCircle className="w-4 h-4 mr-1" />
                              ) : (
                                <XCircle className="w-4 h-4 mr-1" />
                              )}
                              {prediction.result ? 'Doğru' : 'Yanlış'}
                            </span>
                          )}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(prediction.id)}
                            className="p-1 text-red-600 hover:text-red-800 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </PageLayout>
  )
} 