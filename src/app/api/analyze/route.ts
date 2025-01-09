import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

interface HistoricalData {
  prices: [number, number][]
  total_volumes: [number, number][]
}

interface AIAnalysis {
  prediction: number
  confidence: number
  trend: 'up' | 'down'
  explanation: string
}

export async function POST(request: Request) {
  try {
    const { coinId, historicalData } = await request.json() as { 
      coinId: string
      historicalData: HistoricalData 
    }

    // Son 24 saatlik verileri analiz et
    const prices = historicalData.prices
    const lastPrice = prices[prices.length - 1][1]
    const firstPrice = prices[0][1]
    const priceChange = ((lastPrice - firstPrice) / firstPrice) * 100

    // Teknik analiz göstergelerini hesapla
    const volumes = historicalData.total_volumes.map((v: [number, number]) => v[1])
    const avgVolume = volumes.reduce((a: number, b: number) => a + b, 0) / volumes.length
    const lastVolume = volumes[volumes.length - 1]
    const volumeChange = ((lastVolume - avgVolume) / avgVolume) * 100

    // Fiyat hareketlerini analiz et
    const priceMovements = []
    for (let i = 1; i < prices.length; i++) {
      const change = ((prices[i][1] - prices[i-1][1]) / prices[i-1][1]) * 100
      priceMovements.push(change)
    }

    // Volatiliteyi hesapla
    const volatility = Math.sqrt(
      priceMovements.reduce((sum: number, change: number) => sum + change * change, 0) / priceMovements.length
    )

    // OpenAI'ye gönderilecek prompt
    const prompt = `Aşağıdaki kripto para verilerini analiz ederek, gelecek 24 saat için fiyat tahmini yap:

Coin: ${coinId}
Son fiyat: $${lastPrice.toFixed(2)}
24s fiyat değişimi: %${priceChange.toFixed(2)}
24s ortalama işlem hacmi: $${avgVolume.toFixed(2)}
Hacim değişimi: %${volumeChange.toFixed(2)}
Volatilite: ${volatility.toFixed(2)}

Lütfen aşağıdaki bilgileri içeren bir analiz yap:
1. 24 saat sonrası için fiyat tahmini (prediction)
2. Tahminin güven oranı (confidence) - 0-100 arası bir sayı
3. Fiyat trendi (trend) - "up" veya "down"
4. Detaylı açıklama (explanation)

Yanıtı JSON formatında ver. Örnek:
{
  "prediction": 45000.50,
  "confidence": 75,
  "trend": "up",
  "explanation": "Detaylı analiz açıklaması..."
}`

    // OpenAI'den analiz al
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-1106-preview",
      temperature: 0.5,
      response_format: { type: "json_object" }
    })

    const content = completion.choices[0].message.content
    if (!content) {
      throw new Error('OpenAI yanıt vermedi')
    }

    const analysis = JSON.parse(content) as AIAnalysis

    // Tahmin sonucunu döndür
    return NextResponse.json({
      prediction: analysis.prediction,
      confidence: analysis.confidence,
      trend: analysis.trend,
      explanation: analysis.explanation
    })

  } catch (error) {
    console.error('Analiz hatası:', error)
    return NextResponse.json(
      { error: 'Analiz yapılırken bir hata oluştu' },
      { status: 500 }
    )
  }
} 