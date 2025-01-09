const COINGECKO_API = 'https://api.coingecko.com/api/v3'
const COINGECKO_API_KEY = process.env.NEXT_PUBLIC_COINGECKO_API_KEY

const headers = COINGECKO_API_KEY
  ? { 'x-cg-demo-api-key': COINGECKO_API_KEY }
  : undefined

export interface CoinData {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  total_volume: number
  price_change_percentage_24h: number
}

export interface CoinDetail extends CoinData {
  description: { tr?: string; en: string }
  market_data: {
    current_price: { usd: number }
    price_change_percentage_24h: number
    price_change_percentage_7d: number
    price_change_percentage_30d: number
    market_cap: { usd: number }
    total_volume: { usd: number }
  }
  market_cap_rank: number
}

export async function getTopCoins(limit = 10): Promise<CoinData[]> {
  try {
    const response = await fetch(`/api/coingecko?endpoint=/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`)
    
    if (!response.ok) {
      throw new Error('API isteği başarısız oldu')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Kripto para verileri alınırken hata:', error)
    throw error
  }
}

export const getCoinDetail = async (coinId: string): Promise<CoinDetail> => {
  const response = await fetch(
    `${COINGECKO_API}/coins/${coinId}?localization=true&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
    { headers }
  )
  
  if (!response.ok) {
    throw new Error('Kripto para detayları alınamadı')
  }
  
  return response.json()
}

export const getCoinPriceHistory = async (
  coinId: string,
  days: number = 7
): Promise<{ prices: [number, number][] }> => {
  const response = await fetch(
    `${COINGECKO_API}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,
    { headers }
  )
  
  if (!response.ok) {
    throw new Error('Fiyat geçmişi alınamadı')
  }
  
  return response.json()
} 