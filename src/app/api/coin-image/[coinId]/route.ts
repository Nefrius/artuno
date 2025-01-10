import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const DEFAULT_IMAGE = 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ coinId: string }> }
) {
  const { coinId } = await params
  
  try {
    const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY

    // Rate limit için bekleme
    await new Promise(resolve => setTimeout(resolve, 1000))

    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false`,
      {
        headers: {
          'x-cg-demo-api-key': apiKey || '',
          'Cache-Control': 'no-cache'
        },
        next: { revalidate: 3600 } // 1 saat cache
      }
    )

    if (!response.ok) {
      if (response.status === 429) {
        // Rate limit aşıldıysa 2 saniye bekle ve tekrar dene
        await new Promise(resolve => setTimeout(resolve, 2000))
        return GET(request, { params })
      }
      return NextResponse.redirect(DEFAULT_IMAGE)
    }

    const data = await response.json()
    const imageUrl = data.image?.large || data.image?.small || DEFAULT_IMAGE

    return NextResponse.redirect(imageUrl)
  } catch (error) {
    console.error('Error fetching coin image:', error)
    return NextResponse.redirect(DEFAULT_IMAGE)
  }
} 