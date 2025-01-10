import { NextRequest, NextResponse } from 'next/server'
import { getHistoricalData } from '@/lib/services/predictions.service'

export const dynamic = 'force-dynamic'
export const revalidate = 0

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

    // Rate limit için bekleme
    await new Promise(resolve => setTimeout(resolve, 1000))

    try {
      const data = await getHistoricalData(coinId, parseInt(days))
      return NextResponse.json(data)
    } catch (error) {
      // Rate limit hatası durumunda tekrar dene
      if (error instanceof Error && error.message.includes('429')) {
        await new Promise(resolve => setTimeout(resolve, 2000))
        const retryData = await getHistoricalData(coinId, parseInt(days))
        return NextResponse.json(retryData)
      }
      throw error
    }
  } catch (error) {
    console.error('Market chart verisi alınamadı:', error)
    return NextResponse.json(
      { error: 'Market chart verisi alınamadı' },
      { status: 500 }
    )
  }
} 