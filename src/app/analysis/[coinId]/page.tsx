import { Suspense } from 'react'
import CoinAnalysisContent from './CoinAnalysisContent'
import LoadingSpinner from '@/components/LoadingSpinner'
import PageLayout from '@/components/PageLayout'

interface AnalysisPageProps {
  params: {
    coinId: string
  }
}

export default function AnalysisPage({ params }: AnalysisPageProps) {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<LoadingSpinner />}>
          <CoinAnalysisContent coinId={params.coinId} />
        </Suspense>
      </div>
    </PageLayout>
  )
} 