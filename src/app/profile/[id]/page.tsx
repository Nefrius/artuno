// Server Component
import { Suspense } from 'react'
import PageLayout from '@/components/PageLayout'
import UserProfileContent from './UserProfileContent'

export default function UserProfilePage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <PageLayout>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      }>
        <UserProfileContent userId={params.id} />
      </Suspense>
    </PageLayout>
  )
} 