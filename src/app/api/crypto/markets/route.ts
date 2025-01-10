import { NextRequest, NextResponse } from 'next/server'

export const fetchCache = 'force-no-store'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = searchParams.get('limit') || '20'

    console.log('CoinGecko API isteği başlatılıyor...')
    
    const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets'
    const params = new URLSearchParams({
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: limit,
      page: '1',
      sparkline: 'false'
    })

    console.log('API URL:', `${apiUrl}?${params}`)

    const response = await fetch(`${apiUrl}?${params}`, {
      method: 'GET',
      headers: {
        'x-cg-demo-api-key': 'CG-EiZXfV6mdcJDYUFmHrMSQyAo',
        'Accept': 'application/json'
      }
    })

    console.log('API Yanıt Durumu:', response.status)
    console.log('API Yanıt Başlıkları:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error('CoinGecko API Hata Yanıtı:', errorText)
      throw new Error(`CoinGecko API hatası: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('API Yanıtı Başarılı:', data.length, 'coin alındı')
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Markets API hatası:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Kripto para verileri alınırken bir hata oluştu' },
      { status: 500 }
    )
  }
} 