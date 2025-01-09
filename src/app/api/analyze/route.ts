import { NextResponse } from 'next/server'

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

async function analyzeWithHuggingFace(prompt: string): Promise<AIAnalysis> {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/facebook/bart-large",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      },
      method: "POST",
      body: JSON.stringify({ inputs: prompt }),
    }
  )

  const result = await response.json()
  
  // Basit bir kural tabanlı analiz yapalım
  const priceMatch = prompt.match(/Son fiyat: \$(\d+\.?\d*)/)
  const changeMatch = prompt.match(/24s fiyat değişimi: %(-?\d+\.?\d*)/)
  const volumeChangeMatch = prompt.match(/Hacim değişimi: %(-?\d+\.?\d*)/)
  
  const currentPrice = priceMatch ? parseFloat(priceMatch[1]) : 0
  const priceChange = changeMatch ? parseFloat(changeMatch[1]) : 0
  const volumeChange = volumeChangeMatch ? parseFloat(volumeChangeMatch[1]) : 0
  
  // Trend belirleme
  const trend = priceChange > 0 && volumeChange > 0 ? 'up' : 'down'
  
  // Fiyat tahmini
  const prediction = trend === 'up' 
    ? currentPrice * (1 + Math.abs(priceChange) / 100)
    : currentPrice * (1 - Math.abs(priceChange) / 100)
  
  // Güven oranı hesaplama
  const confidence = Math.min(
    Math.round(
      (Math.abs(priceChange) + Math.abs(volumeChange)) / 2
    ),
    100
  )
  
  return {
    prediction: parseFloat(prediction.toFixed(2)),
    confidence,
    trend,
    explanation: result[0]?.generated_text || 'Mevcut piyasa koşullarına göre analiz yapıldı.'
  }
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

    const prompt = `Aşağıdaki kripto para verilerini analiz et:

Coin: ${coinId}
Son fiyat: $${lastPrice.toFixed(2)}
24s fiyat değişimi: %${priceChange.toFixed(2)}
24s ortalama işlem hacmi: $${avgVolume.toFixed(2)}
Hacim değişimi: %${volumeChange.toFixed(2)}
Volatilite: ${volatility.toFixed(2)}

Bu verilere göre detaylı bir piyasa analizi yap.`

    const analysis = await analyzeWithHuggingFace(prompt)

    return NextResponse.json(analysis)

  } catch (error) {
    console.error('Analiz hatası:', error)
    return NextResponse.json(
      { error: 'Analiz yapılırken bir hata oluştu' },
      { status: 500 }
    )
  }
} 