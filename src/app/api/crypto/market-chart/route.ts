import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const coinId = searchParams.get('coinId')

    if (!coinId) {
      return NextResponse.json(
        { error: 'coinId parametresi gerekli' },
        { status: 400 }
      )
    }

    console.log('CoinGecko API isteği başlatılıyor...')
    
    // Rate limit için bekleme
    await new Promise(resolve => setTimeout(resolve, 2000))

    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_last_updated_at=true`,
      {
        headers: {
          'x-cg-demo-api-key': 'CG-EiZXfV6mdcJDYUFmHrMSQyAo',
          'Accept': 'application/json'
        }
      }
    )

    console.log('API Yanıt Durumu:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('CoinGecko API Hata Yanıtı:', errorText)
      throw new Error(`CoinGecko API hatası: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    
    if (!data || !data[coinId]) {
      throw new Error('Geçersiz veri formatı')
    }

    // Son 24 saatlik fiyat değişimini kullanarak yapay veri oluştur
    const currentPrice = data[coinId].usd
    const priceChange24h = data[coinId].usd_24h_change || 0
    const startPrice = currentPrice / (1 + priceChange24h / 100)
    
    // 24 saatlik veriyi simüle et
    const timestamps = []
    const prices = []
    const now = Date.now()
    for (let i = 0; i < 24; i++) {
      const timestamp = now - (23 - i) * 3600 * 1000
      const progress = i / 23
      const price = startPrice + (currentPrice - startPrice) * progress
      timestamps.push(timestamp)
      prices.push(price)
    }

    return NextResponse.json({
      prices,
      timestamps
    })
  } catch (error) {
    console.error('Market chart verisi alınamadı:', error)
    return NextResponse.json(
      { error: 'Market chart verisi alınamadı' },
      { status: 500 }
    )
  }
} 