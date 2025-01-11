import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const generateHistoricalPrices = (currentPrice: number, priceChange: number) => {
  const previousPrice = currentPrice / (1 + priceChange / 100)
  const prices = []
  const numPoints = 48

  for (let i = 0; i < numPoints; i++) {
    const progress = i / (numPoints - 1)
    const basePrice = previousPrice + (currentPrice - previousPrice) * progress
    // Gerçekçi dalgalanmalar ekle
    const volatility = Math.sin(progress * Math.PI * 2) * (priceChange / 200)
    prices.push(Number((basePrice * (1 + volatility)).toFixed(2)))
  }

  return prices
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const coinId = searchParams.get('coinId')

    if (!coinId) {
      return new Response(
        JSON.stringify({ error: 'coinId parametresi gerekli' }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store'
          }
        }
      )
    }

    console.log('CoinGecko API isteği başlatılıyor...')
    await sleep(1500)

    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      }
    )

    console.log('API Yanıt Durumu:', response.status)

    if (!response.ok) {
      throw new Error(`CoinGecko API hatası: ${response.status}`)
    }

    const data = await response.json()
    
    if (!data || !data[coinId]) {
      throw new Error('Geçersiz veri formatı')
    }

    const currentPrice = data[coinId].usd
    const priceChange = data[coinId].usd_24h_change || 0
    const now = Date.now()
    const hourInMs = 3600000

    const historicalPrices = generateHistoricalPrices(currentPrice, priceChange)
    const timestamps = Array.from({ length: 48 }, (_, i) => now - (47 - i) * (hourInMs / 2))

    const result = {
      prices: historicalPrices,
      timestamps,
      currentPrice,
      priceChange
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    })
  } catch (error) {
    console.error('Market chart verisi alınamadı:', error)
    return new Response(
      JSON.stringify({ error: 'Market chart verisi alınamadı' }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        }
      }
    )
  }
} 