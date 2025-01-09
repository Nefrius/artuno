import { supabase } from '../supabaseClient'

export interface Prediction {
  id: string
  user_id: string
  coin_id: string
  prediction_type: 'up' | 'down'
  confidence_score: number
  created_at: string
  target_date: string
  result?: boolean
  actual_price_change?: number
}

interface CoinData {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  price_change_percentage_24h: number
}

async function fetchFromCoinGecko(endpoint: string) {
  const response = await fetch(`/api/coingecko?endpoint=${encodeURIComponent(endpoint)}`)
  if (!response.ok) {
    throw new Error('API isteği başarısız oldu')
  }
  return response.json()
}

export async function getTopCoins(limit = 10) {
  try {
    const data = await fetchFromCoinGecko('/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=' + limit + '&sparkline=false')
    return data.map((coin: CoinData) => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: coin.image,
      current_price: coin.current_price,
      market_cap: coin.market_cap,
      price_change_24h: coin.price_change_percentage_24h
    }))
  } catch (error) {
    console.error('Coin listesi alınamadı:', error)
    return []
  }
}

export async function createPrediction(userId: string, coinId: string, predictionType: 'up' | 'down'): Promise<Prediction | null> {
  try {
    const confidenceScore = await calculateConfidenceScore()
    const targetDate = new Date()
    targetDate.setHours(targetDate.getHours() + 24)

    const { data, error } = await supabase
      .from('predictions')
      .insert([
        {
          user_id: userId,
          coin_id: coinId,
          prediction_type: predictionType,
          confidence_score: confidenceScore,
          target_date: targetDate.toISOString(),
        },
      ])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Tahmin oluşturulurken hata:', error)
    return null
  }
}

export async function getUserPredictions(userId: string): Promise<Prediction[]> {
  try {
    const { data, error } = await supabase
      .from('predictions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Tahminler alınırken hata:', error)
    return []
  }
}

async function calculateConfidenceScore(): Promise<number> {
  // Şimdilik rastgele bir skor döndürüyoruz
  // İleride AI modeli entegre edilecek
  return Math.floor(Math.random() * 100)
}

export async function updatePredictionResult(prediction: Prediction): Promise<void> {
  try {
    const coinData = await fetchFromCoinGecko(`/coins/${prediction.coin_id}/market_chart?vs_currency=usd&days=1`)
    const prices = coinData.prices
    const startPrice = prices[0][1]
    const endPrice = prices[prices.length - 1][1]
    const actualPriceChange = ((endPrice - startPrice) / startPrice) * 100

    const { error } = await supabase
      .from('predictions')
      .update({
        result: actualPriceChange >= 0,
        actual_price_change: actualPriceChange,
      })
      .eq('id', prediction.id)

    if (error) throw error
  } catch (error) {
    console.error('Tahmin sonucu güncellenirken hata:', error)
  }
} 