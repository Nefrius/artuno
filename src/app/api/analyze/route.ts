import { NextResponse } from 'next/server'
import { HfInference } from '@huggingface/inference'

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

interface TechnicalIndicators {
  rsi: number
  macd: number
  sma20: number
  ema50: number
}

interface NewsItem {
  title: string
  url: string
  publishedAt: string
  sentiment: 'positive' | 'negative' | 'neutral'
}

interface MarketAnalysis {
  source: string
  summary: string
  sentiment: 'bullish' | 'bearish' | 'neutral'
  timestamp: string
}

interface CryptoPanicResult {
  title: string
  url: string
  published_at: string
}

interface TradingViewResult {
  author: {
    username: string
  }
  description: string
  direction: 'long' | 'short' | 'neutral'
  created_at: string
}

interface CryptoPanicResponse {
  results: CryptoPanicResult[]
}

type TradingViewResponse = TradingViewResult[]

async function fetchNews(coinId: string): Promise<NewsItem[]> {
  try {
    const response = await fetch(
      `https://cryptopanic.com/api/v1/posts/?auth_token=${process.env.CRYPTOPANIC_API_KEY}&currencies=${coinId}&kind=news`
    )
    
    if (!response.ok) {
      throw new Error('Haber verileri alınamadı')
    }

    const data = await response.json() as CryptoPanicResponse
    return data.results.map((item: CryptoPanicResult) => ({
      title: item.title,
      url: item.url,
      publishedAt: item.published_at,
      sentiment: analyzeSentiment(item.title)
    }))
  } catch (error) {
    console.error('Haber alma hatası:', error)
    return []
  }
}

async function fetchMarketAnalysis(coinId: string): Promise<MarketAnalysis[]> {
  try {
    const response = await fetch(
      `https://api.tradingview.com/v1/markets/crypto/ideas?symbol=${coinId.toUpperCase()}USDT&limit=5`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.TRADINGVIEW_API_KEY}`
        }
      }
    )
    
    if (!response.ok) {
      throw new Error('Analiz verileri alınamadı')
    }

    const data = await response.json() as TradingViewResponse
    return data.map((item: TradingViewResult) => ({
      source: item.author.username,
      summary: item.description,
      sentiment: item.direction === 'long' ? 'bullish' : item.direction === 'short' ? 'bearish' : 'neutral',
      timestamp: item.created_at
    }))
  } catch (error) {
    console.error('Analiz alma hatası:', error)
    return []
  }
}

function analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
  const positiveWords = ['yükseliş', 'artış', 'kazanç', 'büyüme', 'olumlu', 'güçlü', 'başarı']
  const negativeWords = ['düşüş', 'kayıp', 'zarar', 'olumsuz', 'zayıf', 'risk', 'endişe']
  
  const textLower = text.toLowerCase()
  let positiveScore = 0
  let negativeScore = 0

  positiveWords.forEach(word => {
    const matches = textLower.match(new RegExp(word, 'g'))
    if (matches) {
      positiveScore += matches.length
    }
  })

  negativeWords.forEach(word => {
    const matches = textLower.match(new RegExp(word, 'g'))
    if (matches) {
      negativeScore += matches.length
    }
  })

  if (positiveScore > negativeScore) return 'positive'
  if (negativeScore > positiveScore) return 'negative'
  return 'neutral'
}

function calculateTechnicalIndicators(prices: [number, number][]): TechnicalIndicators {
  const closePrices = prices.map(([, price]) => price)

  const rsi = calculateRSI(closePrices, 14)
  const macd = calculateMACD(closePrices)
  const sma20 = calculateSMA(closePrices, 20)
  const ema50 = calculateEMA(closePrices, 50)

  return {
    rsi,
    macd,
    sma20,
    ema50
  }
}

function calculateRSI(prices: number[], period: number): number {
  if (prices.length < period + 1) {
    return 50
  }

  let gains = 0
  let losses = 0

  for (let i = 1; i <= period; i++) {
    const difference = prices[prices.length - i] - prices[prices.length - i - 1]
    if (difference >= 0) {
      gains += difference
    } else {
      losses -= difference
    }
  }

  const avgGain = gains / period
  const avgLoss = losses / period
  const rs = avgGain / avgLoss
  return 100 - (100 / (1 + rs))
}

function calculateMACD(prices: number[]): number {
  const ema12 = calculateEMA(prices, 12)
  const ema26 = calculateEMA(prices, 26)
  return ema12 - ema26
}

function calculateSMA(prices: number[], period: number): number {
  if (prices.length < period) {
    return prices[prices.length - 1]
  }

  const sum = prices.slice(-period).reduce((a, b) => a + b, 0)
  return sum / period
}

function calculateEMA(prices: number[], period: number): number {
  if (prices.length < period) {
    return prices[prices.length - 1]
  }

  const multiplier = 2 / (period + 1)
  let ema = prices[0]

  for (let i = 1; i < prices.length; i++) {
    ema = (prices[i] - ema) * multiplier + ema
  }

  return ema
}

function generateReasoning(
  technicalIndicators: TechnicalIndicators,
  news: NewsItem[],
  marketAnalysis: MarketAnalysis[],
  timeframe: string
): string[] {
  const reasons: string[] = []

  // Teknik analiz bazlı nedenler
  if (technicalIndicators.rsi > 70) {
    reasons.push(`RSI göstergesi (${Math.round(technicalIndicators.rsi)}) aşırı alım bölgesinde, kısa vadede düzeltme görülebilir.`)
  } else if (technicalIndicators.rsi < 30) {
    reasons.push(`RSI göstergesi (${Math.round(technicalIndicators.rsi)}) aşırı satım bölgesinde, tepki yükselişi beklenebilir.`)
  }

  if (technicalIndicators.macd > 0) {
    reasons.push(`MACD pozitif bölgede (${technicalIndicators.macd.toFixed(2)}), yükseliş trendi devam edebilir.`)
  } else {
    reasons.push(`MACD negatif bölgede (${technicalIndicators.macd.toFixed(2)}), düşüş trendi devam edebilir.`)
  }

  if (technicalIndicators.sma20 > technicalIndicators.ema50) {
    reasons.push('Kısa vadeli ortalama (SMA20) uzun vadeli ortalamanın (EMA50) üzerinde, yükseliş trendi güçlü.')
  } else {
    reasons.push('Kısa vadeli ortalama (SMA20) uzun vadeli ortalamanın (EMA50) altında, düşüş trendi güçlü.')
  }

  // Haber bazlı nedenler
  const positiveNews = news.filter(n => n.sentiment === 'positive').length
  const negativeNews = news.filter(n => n.sentiment === 'negative').length
  
  if (positiveNews > negativeNews) {
    reasons.push(`Son haberlerin çoğunluğu (${positiveNews}/${news.length}) olumlu, bu ${timeframe} içinde yukarı yönlü hareketi destekleyebilir.`)
  } else if (negativeNews > positiveNews) {
    reasons.push(`Son haberlerin çoğunluğu (${negativeNews}/${news.length}) olumsuz, bu ${timeframe} içinde aşağı yönlü baskı oluşturabilir.`)
  }

  // Piyasa analizi bazlı nedenler
  const bullishAnalysis = marketAnalysis.filter(a => a.sentiment === 'bullish').length
  const bearishAnalysis = marketAnalysis.filter(a => a.sentiment === 'bearish').length

  if (bullishAnalysis > bearishAnalysis) {
    reasons.push(`Analistlerin çoğunluğu (${bullishAnalysis}/${marketAnalysis.length}) yükseliş bekliyor.`)
  } else if (bearishAnalysis > bullishAnalysis) {
    reasons.push(`Analistlerin çoğunluğu (${bearishAnalysis}/${marketAnalysis.length}) düşüş bekliyor.`)
  }

  return reasons
}

async function predictNextDayPrice(
  prices: [number, number][],
  technicalIndicators: TechnicalIndicators,
  news: NewsItem[],
  marketAnalysis: MarketAnalysis[],
  coinId: string,
  timeframe: string
) {
  const lastPrice = prices[prices.length - 1][1]
  const normalizedPrices = normalizeData(prices.map(([, price]) => price))
  
  try {
    // Hugging Face modelini kullan
    const prediction = await hf.textGeneration({
      model: 'TurkuNLP/gpt3-finnish-small',
      inputs: `Kripto para analizi:
Coin: ${coinId}
Zaman Dilimi: ${timeframe}
Son fiyatlar: ${normalizedPrices.slice(-5).join(', ')}
RSI: ${technicalIndicators.rsi}
MACD: ${technicalIndicators.macd}
SMA20: ${technicalIndicators.sma20}
EMA50: ${technicalIndicators.ema50}
Haberler: ${news.map(n => n.sentiment).join(', ')}
Analizler: ${marketAnalysis.map(a => a.sentiment).join(', ')}

${timeframe} sonrası için fiyat tahmini:`,
      parameters: {
        max_new_tokens: 50,
        temperature: 0.7,
      }
    })

    // Tahmin metnini işle ve sayısal değere dönüştür
    const predictedChange = interpretPrediction(prediction.generated_text)
    const predictedPrice = lastPrice * (1 + predictedChange)

    return {
      prediction: predictedPrice,
      confidence: calculateConfidence(technicalIndicators, news, marketAnalysis),
      trend: predictedPrice > lastPrice ? 'up' : 'down'
    }
  } catch (error) {
    console.error('AI tahmin hatası:', error)
    
    // Fallback: Teknik analiz bazlı basit tahmin
    const predictedChange = calculatePredictedChange(technicalIndicators, news, marketAnalysis)
    const predictedPrice = lastPrice * (1 + predictedChange)

    return {
      prediction: predictedPrice,
      confidence: 0.7,
      trend: predictedPrice > lastPrice ? 'up' : 'down'
    }
  }
}

function normalizeData(prices: number[]): number[] {
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  return prices.map(price => (price - min) / (max - min))
}

function interpretPrediction(text: string): number {
  // Basit bir yorumlama: pozitif/negatif kelimeleri say
  const positiveWords = ['artış', 'yükseliş', 'pozitif', 'büyüme']
  const negativeWords = ['düşüş', 'azalış', 'negatif', 'kayıp']
  
  const textLower = text.toLowerCase()
  const positiveCount = positiveWords.reduce((count, word) => 
    count + (textLower.match(new RegExp(word, 'g')) || []).length, 0
  )
  const negativeCount = negativeWords.reduce((count, word) => 
    count + (textLower.match(new RegExp(word, 'g')) || []).length, 0
  )
  
  const sentiment = (positiveCount - negativeCount) / (positiveCount + negativeCount + 1)
  return sentiment * 0.05 // Max %5 değişim
}

function calculateConfidence(
  indicators: TechnicalIndicators,
  news: NewsItem[],
  marketAnalysis: MarketAnalysis[]
): number {
  let confidence = 0.7 // Baz güven seviyesi

  // RSI bazlı güven ayarlaması
  if (indicators.rsi > 70 || indicators.rsi < 30) {
    confidence += 0.05
  }

  // MACD bazlı güven ayarlaması
  if (Math.abs(indicators.macd) > 100) {
    confidence += 0.05
  }

  // SMA ve EMA karşılaştırması
  if (Math.abs(indicators.sma20 - indicators.ema50) / indicators.sma20 < 0.01) {
    confidence += 0.05
  }

  // Haber sentiment analizi
  const positiveNews = news.filter(n => n.sentiment === 'positive').length
  const negativeNews = news.filter(n => n.sentiment === 'negative').length
  const newsSentiment = (positiveNews - negativeNews) / news.length
  confidence += Math.abs(newsSentiment) * 0.05

  // Piyasa analizi sentiment
  const bullishAnalysis = marketAnalysis.filter(a => a.sentiment === 'bullish').length
  const bearishAnalysis = marketAnalysis.filter(a => a.sentiment === 'bearish').length
  const analysisSentiment = (bullishAnalysis - bearishAnalysis) / marketAnalysis.length
  confidence += Math.abs(analysisSentiment) * 0.05

  return Math.min(confidence, 0.95) // Max %95 güven
}

function calculatePredictedChange(
  indicators: TechnicalIndicators,
  news: NewsItem[],
  marketAnalysis: MarketAnalysis[]
): number {
  let change = 0

  // RSI bazlı değişim
  if (indicators.rsi > 70) {
    change -= 0.02 // Aşırı alım: düşüş beklentisi
  } else if (indicators.rsi < 30) {
    change += 0.02 // Aşırı satım: yükseliş beklentisi
  }

  // MACD bazlı değişim
  if (indicators.macd > 0) {
    change += 0.01
  } else {
    change -= 0.01
  }

  // Trend bazlı değişim
  if (indicators.sma20 > indicators.ema50) {
    change += 0.01 // Yükseliş trendi
  } else {
    change -= 0.01 // Düşüş trendi
  }

  // Haber sentiment bazlı değişim
  const positiveNews = news.filter(n => n.sentiment === 'positive').length
  const negativeNews = news.filter(n => n.sentiment === 'negative').length
  const newsSentiment = (positiveNews - negativeNews) / news.length
  change += newsSentiment * 0.01

  // Piyasa analizi bazlı değişim
  const bullishAnalysis = marketAnalysis.filter(a => a.sentiment === 'bullish').length
  const bearishAnalysis = marketAnalysis.filter(a => a.sentiment === 'bearish').length
  const analysisSentiment = (bullishAnalysis - bearishAnalysis) / marketAnalysis.length
  change += analysisSentiment * 0.01

  return change
}

export async function POST(request: Request) {
  try {
    const { coinId, prices, timeframe } = await request.json()

    if (!coinId || !prices || !Array.isArray(prices) || !timeframe) {
      return NextResponse.json(
        { error: 'Geçersiz istek parametreleri' },
        { status: 400 }
      )
    }

    // Paralel olarak veri toplama
    const [technicalIndicators, news, marketAnalysis] = await Promise.all([
      Promise.resolve(calculateTechnicalIndicators(prices)),
      fetchNews(coinId),
      fetchMarketAnalysis(coinId)
    ])

    const prediction = await predictNextDayPrice(
      prices,
      technicalIndicators,
      news,
      marketAnalysis,
      coinId,
      timeframe
    )

    const reasoning = generateReasoning(technicalIndicators, news, marketAnalysis, timeframe)

    return NextResponse.json({
      prediction: prediction.prediction,
      confidence: prediction.confidence,
      trend: prediction.trend,
      technicalIndicators,
      news,
      marketAnalysis,
      reasoning
    })
  } catch (error) {
    console.error('Analiz hatası:', error)
    return NextResponse.json(
      { error: 'Analiz yapılırken bir hata oluştu' },
      { status: 500 }
    )
  }
} 