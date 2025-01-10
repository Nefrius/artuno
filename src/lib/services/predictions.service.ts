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

export async function fetchFromCoinGecko(endpoint: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_COINGECKO_API_URL
    const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY

    // Rate limit için bekleme
    await new Promise(resolve => setTimeout(resolve, 1000))

    const response = await fetch(`${baseUrl}${endpoint}`, {
      headers: {
        'x-cg-demo-api-key': apiKey || '',
        'Cache-Control': 'no-cache'
      },
      next: { revalidate: 60 } // 1 dakika cache
    })
    
    if (!response.ok) {
      if (response.status === 429) {
        // Rate limit aşıldıysa 2 saniye bekle ve tekrar dene
        await new Promise(resolve => setTimeout(resolve, 2000))
        return fetchFromCoinGecko(endpoint)
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('CoinGecko API hatası:', error)
    throw error
  }
}

export async function getTopCoins(limit = 20) {
  try {
    const coins = await fetchFromCoinGecko(`/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&sparkline=false`)
    return coins
  } catch (error) {
    console.error('Coin listesi alınamadı:', error)
    return []
  }
}

export async function getCoinDetails(coinId: string) {
  try {
    const data = await fetchFromCoinGecko(`/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`)
    return data
  } catch (error) {
    console.error('Coin detayları alınamadı:', error)
    throw error
  }
}

export async function getHistoricalData(coinId: string, days = 1) {
  try {
    const data = await fetchFromCoinGecko(`/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=hourly`)
    if (!data || !data.prices || !Array.isArray(data.prices)) {
      throw new Error('Geçersiz veri formatı')
    }
    return {
      prices: data.prices.map((price: [number, number]) => price[1]),
      timestamps: data.prices.map((price: [number, number]) => price[0])
    }
  } catch (error) {
    console.error('Geçmiş veriler alınamadı:', error)
    throw error
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