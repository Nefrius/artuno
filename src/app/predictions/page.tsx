'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { CoinData, getTopCoins } from '@/lib/services/crypto.service'
import { Prediction, createPrediction, getUserPredictions, deletePrediction } from '@/lib/services/prediction.service'
import { TrendingUp, TrendingDown, Clock, CheckCircle, XCircle, Trash2 } from 'lucide-react'
import Image from 'next/image'
import PageLayout from '@/components/PageLayout'
import { motion, AnimatePresence } from 'framer-motion'
import { useAlert } from '@/components/Alert'
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal'

export default function PredictionsPage() {
  const { user } = useAuth()
  const { showAlert } = useAlert()
  const [coins, setCoins] = useState<CoinData[]>([])
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [selectedCoin, setSelectedCoin] = useState<string>('')
  const [predictionType, setPredictionType] = useState<'up' | 'down'>('up')
  const [predictedPrice, setPredictedPrice] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedPredictionId, setSelectedPredictionId] = useState<string | null>(null)

  const selectedCoinData = coins.find(coin => coin.id === selectedCoin)

  useEffect(() => {
    if (selectedCoinData && predictedPrice > 0) {
      setPredictionType(predictedPrice > selectedCoinData.current_price ? 'up' : 'down')
    }
  }, [predictedPrice, selectedCoinData])

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
    if (!user || !selectedCoin || predictedPrice <= 0) return

    try {
      setLoading(true)
      const targetDate = new Date()
      targetDate.setDate(targetDate.getDate() + 1)

      const newPrediction = await createPrediction({
        userId: user.uid,
        coinId: selectedCoin,
        targetDate: targetDate,
        prediction_type: predictionType,
        predicted_price: predictedPrice
      }) as Prediction

      if (newPrediction) {
        setPredictions([newPrediction, ...predictions])
        setSelectedCoin('')
        setPredictedPrice(0)
        showAlert('Tahmin başarıyla oluşturuldu!', 'success')
      }
    } catch (error) {
      console.error('Tahmin oluşturulurken hata:', error)
      showAlert('Tahmin oluşturulurken bir hata oluştu.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (predictionId: string) => {
    setSelectedPredictionId(predictionId)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedPredictionId) return

    try {
      await deletePrediction(selectedPredictionId)
      setPredictions(predictions.filter(p => p.id !== selectedPredictionId))
      showAlert('Tahmin başarıyla silindi.', 'success')
    } catch (error) {
      console.error('Tahmin silinirken hata:', error)
      showAlert('Tahmin silinirken bir hata oluştu.', 'error')
    } finally {
      setDeleteModalOpen(false)
      setSelectedPredictionId(null)
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
          <div className="px-4 sm:px-6 py-6 sm:py-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Yeni Tahmin Oluştur
            </h3>

            {/* Coin Seçimi */}
            <div className="space-y-6 sm:space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="coin" className="block text-sm font-medium text-gray-700 mb-1">
                      Kripto Para Seçin
                    </label>
                    <div className="relative">
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full rounded-lg border border-gray-300 bg-white shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 overflow-hidden"
                      >
                        <div className="max-h-48 overflow-y-auto">
                          <AnimatePresence>
                            {coins.map((coin, index) => (
                              <motion.div
                                key={coin.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                                onClick={() => setSelectedCoin(coin.id)}
                                className={`flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors ${
                                  selectedCoin === coin.id ? 'bg-indigo-50' : ''
                                }`}
                              >
                                <div className="relative w-6 h-6 mr-2">
                                  <Image
                                    src={coin.image}
                                    alt={coin.name}
                                    fill
                                    sizes="(max-width: 24px) 24px"
                                    className="rounded-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">{coin.name}</p>
                                      <p className="text-xs text-gray-500">{coin.symbol.toUpperCase()}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm font-medium text-gray-900">
                                        ${coin.current_price.toLocaleString()}
                                      </p>
                                      <p className={`text-xs ${
                                        coin.price_change_percentage_24h >= 0
                                          ? 'text-green-600'
                                          : 'text-red-600'
                                      }`}>
                                        {coin.price_change_percentage_24h >= 0 ? '+' : ''}
                                        {coin.price_change_percentage_24h.toFixed(2)}%
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {selectedCoinData && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="bg-gradient-to-br from-indigo-50 to-white p-4 rounded-xl shadow-sm border border-indigo-100"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="relative w-12 h-12">
                          <Image
                            src={selectedCoinData.image}
                            alt={selectedCoinData.name}
                            fill
                            sizes="(max-width: 48px) 48px"
                            className="rounded-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{selectedCoinData.name}</h4>
                          <p className="text-sm text-gray-500">Sıralama: #{selectedCoinData.market_cap_rank}</p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <p className="text-sm text-gray-500 mb-1">Mevcut Fiyat</p>
                          <p className="text-lg font-semibold text-gray-900">
                            ${selectedCoinData.current_price.toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <p className="text-sm text-gray-500 mb-1">24s Değişim</p>
                          <p className={`text-lg font-semibold ${
                            selectedCoinData.price_change_percentage_24h >= 0 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            {selectedCoinData.price_change_percentage_24h >= 0 ? '+' : ''}
                            {selectedCoinData.price_change_percentage_24h.toFixed(2)}%
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <p className="text-sm text-gray-500 mb-1">24s Hacim</p>
                          <p className="text-lg font-semibold text-gray-900">
                            ${(selectedCoinData.total_volume / 1000000).toFixed(1)}M
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <p className="text-sm text-gray-500 mb-1">Piyasa Değeri</p>
                          <p className="text-lg font-semibold text-gray-900">
                            ${(selectedCoinData.market_cap / 1000000000).toFixed(1)}B
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Fiyat Tahmini */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      24 Saat Sonraki Tahmini Fiyat
                    </label>
                    <div className="relative mt-1 rounded-lg shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <span className="text-gray-500 sm:text-lg">$</span>
                      </div>
                      <input
                        type="number"
                        step="0.000001"
                        value={predictedPrice || ''}
                        onChange={(e) => setPredictedPrice(parseFloat(e.target.value))}
                        className="block w-full rounded-lg border-gray-300 pl-8 pr-12 py-3 text-lg focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {selectedCoinData && predictedPrice > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-xl shadow-sm border ${
                        predictedPrice > selectedCoinData.current_price
                          ? 'bg-gradient-to-br from-green-50 to-white border-green-100'
                          : 'bg-gradient-to-br from-red-50 to-white border-red-100'
                      }`}
                    >
                      <div className="flex items-center mb-3">
                        {predictedPrice > selectedCoinData.current_price ? (
                          <TrendingUp className="w-6 h-6 text-green-600 mr-2" />
                        ) : (
                          <TrendingDown className="w-6 h-6 text-red-600 mr-2" />
                        )}
                        <span className="font-semibold text-lg">
                          {predictedPrice > selectedCoinData.current_price ? 'Yükseliş' : 'Düşüş'} Beklentisi
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <p className="text-sm text-gray-500 mb-1">Tahmini Değişim</p>
                          <p className={`text-lg font-semibold ${
                            predictedPrice > selectedCoinData.current_price
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}>
                            {(((predictedPrice - selectedCoinData.current_price) / selectedCoinData.current_price) * 100).toFixed(2)}%
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <p className="text-sm text-gray-500 mb-1">Fiyat Farkı</p>
                          <p className={`text-lg font-semibold ${
                            predictedPrice > selectedCoinData.current_price
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}>
                            ${Math.abs(predictedPrice - selectedCoinData.current_price).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreatePrediction}
                    disabled={loading || !selectedCoin || predictedPrice <= 0}
                    className="w-full mt-6 h-14 flex items-center justify-center px-8 border border-transparent text-lg font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out shadow-lg"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      'Tahmin Oluştur'
                    )}
                  </motion.button>
                </div>
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
                <AnimatePresence mode="popLayout">
                  {predictions.map((prediction, index) => {
                    const coin = coins.find((c) => c.id === prediction.coin_id)
                    return (
                      <motion.div
                        key={prediction.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ 
                          opacity: 0, 
                          x: -100,
                          transition: {
                            duration: 0.3,
                            ease: "easeInOut"
                          }
                        }}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                        layout
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
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                              {prediction.confidence_score}% Güven
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
                              onClick={() => handleDeleteClick(prediction.id)}
                              className="p-1 text-red-600 hover:text-red-800 transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setSelectedPredictionId(null)
        }}
        onConfirm={handleDeleteConfirm}
        title="Tahmini Sil"
        message="Bu tahmini silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
      />
    </PageLayout>
  )
} 