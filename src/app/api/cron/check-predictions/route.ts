import { NextResponse } from 'next/server'

export const dynamic = "force-static"

export async function GET(): Promise<Response> {
  return NextResponse.json({ message: 'Predictions check endpoint is static' })
} 