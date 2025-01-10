import { fetchFromCoinGecko } from '@/lib/services/predictions.service'

export const dynamic = "force-static"

export async function generateStaticParams(): Promise<{ coinId: string }[]> {
  return Promise.resolve([
    { coinId: 'bitcoin' },
    { coinId: 'ethereum' },
    { coinId: 'binancecoin' },
    { coinId: 'ripple' },
    { coinId: 'cardano' }
  ])
}

export async function GET(
  request: Request,
  context: { params: Promise<{ coinId: string }> }
) {
  const params = await context.params
  const coinId = params.coinId
  
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'info'
    
    let endpoint = ''
    switch (type) {
      case 'info':
        endpoint = `/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
        break
      case 'history':
        endpoint = `/coins/${coinId}/market_chart?vs_currency=usd&days=1`
        break
      default:
        return Response.json({ error: 'Geçersiz istek tipi' }, { status: 400 })
    }

    const data = await fetchFromCoinGecko(endpoint)
    return Response.json(data, { status: 200 })
  } catch (error) {
    console.error('Coin verisi alınamadı:', error)
    return Response.json({ error: 'Coin verisi alınamadı' }, { status: 500 })
  }
} 