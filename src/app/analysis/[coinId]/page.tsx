import CoinAnalysisContent from './CoinAnalysisContent'

type Props = {
  params: { coinId: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function CoinAnalysisPage({ params }: Props) {
  return <CoinAnalysisContent coinId={params.coinId} />
} 