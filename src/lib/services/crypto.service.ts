export interface CoinData {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
  last_updated: string
}

const BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'

export async function getTopCoins(limit: number = 20) {
  try {
    console.log('API isteği gönderiliyor:', `${BASE_URL}/api/crypto/markets?limit=${limit}`)
    
    const response = await fetch(`${BASE_URL}/api/crypto/markets?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })

    console.log('API yanıt durumu:', response.status)

    if (!response.ok) {
      const errorData = await response.text()
      console.error('API hata yanıtı:', errorData)
      try {
        const jsonError = JSON.parse(errorData)
        throw new Error(jsonError.error || `API hatası: ${response.status}`)
      } catch {
        throw new Error(`API hatası: ${response.status} - ${errorData}`)
      }
    }

    const data = await response.json()
    console.log('Veriler başarıyla alındı:', data.length, 'coin')
    return data
  } catch (error) {
    console.error('getTopCoins hatası:', error)
    throw error
  }
}

export async function getCoinData(coinId: string): Promise<CoinData> {
  try {
    const response = await fetch(`${BASE_URL}/api/crypto/${coinId}?type=info`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Veri alınamadı')
    }

    const data = await response.json()
    return {
      id: data.id,
      symbol: data.symbol,
      name: data.name,
      image: data.image.large,
      current_price: data.market_data.current_price.usd,
      market_cap: data.market_data.market_cap.usd,
      market_cap_rank: data.market_cap_rank,
      total_volume: data.market_data.total_volume.usd,
      high_24h: data.market_data.high_24h.usd,
      low_24h: data.market_data.low_24h.usd,
      price_change_24h: data.market_data.price_change_24h,
      price_change_percentage_24h: data.market_data.price_change_percentage_24h,
      market_cap_change_24h: data.market_data.market_cap_change_24h,
      market_cap_change_percentage_24h: data.market_data.market_cap_change_percentage_24h,
      last_updated: data.last_updated
    }
  } catch (error) {
    console.error('getCoinData hatası:', error)
    throw error
  }
}

export async function getHistoricalData(coinId: string) {
  try {
    const response = await fetch(`${BASE_URL}/api/crypto/${coinId}?type=history`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Veri alınamadı')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('getHistoricalData hatası:', error)
    throw error
  }
} 