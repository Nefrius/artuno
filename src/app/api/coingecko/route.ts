import { NextResponse } from 'next/server'

const API_KEY = process.env.NEXT_PUBLIC_COINGECKO_API_KEY

export const dynamic = "force-static"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const endpoint = searchParams.get('endpoint')

  if (!endpoint) {
    return NextResponse.json({ error: 'Endpoint parametresi gerekli' }, { status: 400 })
  }

  try {
    const response = await fetch(`https://api.coingecko.com/api/v3${endpoint}`, {
      headers: {
        'x-cg-demo-api-key': API_KEY || '',
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 60 // 60 saniye cache
      }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('CoinGecko API hatası:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      })
      
      return NextResponse.json(
        { error: 'API isteği başarısız oldu', details: errorData },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('CoinGecko API hatası:', error)
    return NextResponse.json(
      { error: 'API isteği başarısız oldu', details: error },
      { status: 500 }
    )
  }
} 