import { NextRequest, NextResponse } from 'next/server'
import { getTopCoins } from '@/lib/services/predictions.service'

export const dynamic = "force-static"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') || '20'

    const data = await getTopCoins(parseInt(limit))
    return NextResponse.json(data)
  } catch (error) {
    console.error('Market verisi alınamadı:', error)
    return NextResponse.json(
      { error: 'Market verisi alınamadı' },
      { status: 500 }
    )
  }
} 