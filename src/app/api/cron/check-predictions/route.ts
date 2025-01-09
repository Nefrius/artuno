import { NextResponse } from 'next/server'
import { checkPredictionResults } from '@/lib/services/prediction.service'

export async function GET(request: Request) {
  try {
    // API anahtarını kontrol et
    const authHeader = request.headers.get('authorization')
    const expectedApiKey = process.env.CRON_API_KEY

    if (!authHeader || authHeader !== `Bearer ${expectedApiKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Tahminleri kontrol et
    await checkPredictionResults()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Tahmin kontrolü API hatası:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 