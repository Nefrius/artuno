import { use } from 'react'
import AnimatedContent from './AnimatedContent'

interface PageProps {
  params: Promise<{
    coinId: string
  }>
}

export async function generateStaticParams() {
  return [
    { coinId: 'bitcoin' },
    { coinId: 'ethereum' }
  ]
}

export default function CoinAnalysisPage({ params }: PageProps) {
  const { coinId } = use(params)
  return <AnimatedContent coinId={coinId} />
} 