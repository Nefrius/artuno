export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') || '10'

    const response = await fetch(
      `${COINGECKO_API_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        next: { revalidate: 60 } // 60 saniyelik önbellek
      }
    )

    if (!response.ok) {
      if (response.status === 429) {
        return NextResponse.json(
          { error: 'API rate limit aşıldı. Lütfen biraz bekleyin.' },
          { status: 429 }
        )
      }
      throw new Error(`CoinGecko API hatası: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('API hatası:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Veri alınamadı' },
      { status: 500 }
    )
  }
} 