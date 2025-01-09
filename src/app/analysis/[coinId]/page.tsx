import CoinAnalysisContent from './CoinAnalysisContent'

interface PageProps {
  params: {
    coinId: string
  }
}

export default function CoinAnalysisPage({ params }: PageProps) {
  return <CoinAnalysisContent coinId={params.coinId} />
} 