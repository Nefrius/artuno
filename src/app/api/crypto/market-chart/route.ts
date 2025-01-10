import { NextRequest, NextResponse } from 'next/server'
import { getHistoricalData } from '@/lib/services/predictions.service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const coinId = searchParams.get('coinId')
    const days = searchParams.get('days') || '1'

    if (!coinId) {
      return NextResponse.json(
        { error: 'coinId parametresi gerekli' },
        { status: 400 }
      )
    }

    const data = await getHistoricalData(coinId, parseInt(days))
    return NextResponse.json(data)
  } catch (error) {
    console.error('Market chart verisi alınamadı:', error)
    return NextResponse.json(
      { error: 'Market chart verisi alınamadı' },
      { status: 500 }
    )
  }
} 