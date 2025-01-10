import { Suspense } from 'react'
import CoinAnalysisContent from './CoinAnalysisContent'
import LoadingSpinner from '@/components/LoadingSpinner'
import PageLayout from '@/components/PageLayout'

interface AnalysisPageProps {
  params: Promise<{ coinId: string }>
}

export default async function AnalysisPage({ params }: AnalysisPageProps) {
  const { coinId } = await params
  
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<LoadingSpinner />}>
          <CoinAnalysisContent coinId={coinId} />
        </Suspense>
      </div>
    </PageLayout>
  )
} 