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

export async function getTopCoins(limit: number = 10): Promise<CoinData[]> {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`
    )

    if (!response.ok) {
      throw new Error('API isteği başarısız oldu')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('getTopCoins hatası:', error)
    throw error
  }
}

export async function getCoinData(coinId: string): Promise<CoinData> {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
    )

    if (!response.ok) {
      throw new Error('API isteği başarısız oldu')
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

export async function getHistoricalData(coinId: string, days: number = 1) {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
    )

    if (!response.ok) {
      throw new Error('API isteği başarısız oldu')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('getHistoricalData hatası:', error)
    throw error
  }
} 