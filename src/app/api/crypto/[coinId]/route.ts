import { NextRequest, NextResponse } from 'next/server'
import { fetchFromCoinGecko } from '@/lib/services/predictions.service'

type RouteParams = {
  params: {
    coinId: string
  }
}

export async function GET(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const coinId = context.params.coinId
    const data = await fetchFromCoinGecko(`/coins/${coinId}`)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Coin verisi alınamadı:', error)
    return NextResponse.json(
      { error: 'Coin verisi alınamadı' },
      { status: 500 }
    )
  }
} 