import CoinAnalysisContent from './CoinAnalysisContent'

export default async function CoinAnalysisPage({ params }: { params: { coinId: string } }) {
  return <CoinAnalysisContent coinId={params.coinId} />
} 