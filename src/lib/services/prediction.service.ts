import { supabase } from '../supabase'
import { Database } from '../database.types'
import { updateDailyPredictions, incrementTotalPredictions } from './user.service'

type PredictionRow = Database['public']['Tables']['predictions']['Row']

export interface Prediction extends PredictionRow {
  id: string
  user_id: string
  coin_id: string
  created_at: string
  prediction_type: 'up' | 'down'
  result: boolean | null
}

export interface CreatePredictionData {
  userId: string
  coinId: string
  targetDate: Date
  predictedPrice: number
  prediction_type: 'up' | 'down'
}

export const createPrediction = async (data: CreatePredictionData): Promise<PredictionRow> => {
  try {
    const { data: prediction, error } = await supabase
      .from('predictions')
      .insert({
        user_id: data.userId,
        coin_id: data.coinId,
        target_date: data.targetDate.toISOString(),
        predicted_price: data.predictedPrice,
        prediction_type: data.prediction_type
      })
      .select('*')
      .single()

    if (error) {
      console.error('Supabase tahmin oluşturma hatası:', JSON.stringify(error, null, 2))
      throw error
    }

    if (!prediction) {
      throw new Error('Tahmin oluşturulamadı')
    }

    // Kullanıcının günlük tahmin hakkını azalt
    await updateDailyPredictions(data.userId, 0)

    // Toplam tahmin sayısını artır
    await incrementTotalPredictions(data.userId)

    return prediction
  } catch (error) {
    console.error('createPrediction hatası:', JSON.stringify(error, null, 2))
    throw error
  }
}

export const getUserPredictions = async (userId: string): Promise<Prediction[]> => {
  try {
    const { data: predictions, error } = await supabase
      .from('predictions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase tahmin listeleme hatası:', JSON.stringify(error, null, 2))
      throw error
    }

    return (predictions || []) as Prediction[]
  } catch (error) {
    console.error('getUserPredictions hatası:', JSON.stringify(error, null, 2))
    throw error
  }
}

export const updatePredictionActualPrice = async (
  predictionId: string,
  actualPrice: number
): Promise<PredictionRow> => {
  try {
    const { data: prediction, error } = await supabase
      .from('predictions')
      .update({ actual_price: actualPrice })
      .eq('id', predictionId)
      .select('*')
      .single()

    if (error) {
      console.error('Supabase tahmin güncelleme hatası:', JSON.stringify(error, null, 2))
      throw error
    }

    if (!prediction) {
      throw new Error('Tahmin güncellenemedi')
    }

    return prediction
  } catch (error) {
    console.error('updatePredictionActualPrice hatası:', JSON.stringify(error, null, 2))
    throw error
  }
}

export const checkPredictionResults = async (): Promise<void> => {
  try {
    const now = new Date()
    
    // Süresi dolmuş ve sonucu henüz kontrol edilmemiş tahminleri al
    const { data: predictions, error } = await supabase
      .from('predictions')
      .select('*')
      .is('result', null)
      .lt('target_date', now.toISOString())

    if (error) throw error

    if (!predictions || predictions.length === 0) return

    // Her tahmin için sonucu kontrol et
    for (const prediction of predictions) {
      try {
        // Tahmin zamanındaki ve şu andaki fiyatları al
        const response = await fetch(`/api/coingecko?endpoint=/coins/${prediction.coin_id}/market_chart?vs_currency=usd&days=1`)
        const data = await response.json()
        
        if (!data.prices || data.prices.length < 2) continue

        const startPrice = data.prices[0][1]
        const endPrice = data.prices[data.prices.length - 1][1]
        const priceChange = ((endPrice - startPrice) / startPrice) * 100
        
        // Tahmin sonucunu belirle
        const isCorrect = 
          (prediction.prediction_type === 'up' && priceChange > 0) ||
          (prediction.prediction_type === 'down' && priceChange < 0)

        // Sonucu güncelle
        await supabase
          .from('predictions')
          .update({
            result: isCorrect,
            actual_price: endPrice,
            price_change_percentage: priceChange
          })
          .eq('id', prediction.id)

      } catch (predictionError) {
        console.error(`Tahmin kontrolü hatası (ID: ${prediction.id}):`, predictionError)
        continue
      }
    }
  } catch (error) {
    console.error('checkPredictionResults hatası:', error)
    throw error
  }
}

export async function deletePrediction(predictionId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('predictions')
      .delete()
      .eq('id', predictionId)

    if (error) {
      throw error
    }
  } catch (error) {
    console.error('Tahmin silme hatası:', error)
    throw error
  }
} 