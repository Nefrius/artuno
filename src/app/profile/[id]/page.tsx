// Server Component
import { Suspense } from 'react'
import PageLayout from '@/components/PageLayout'
import UserProfileContent from './UserProfileContent'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return [
    { id: 'default' }
  ]
}

export default async function UserProfilePage({ params }: Props) {
  const { id } = await params
  return (
    <PageLayout>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      }>
        <UserProfileContent userId={id} />
      </Suspense>
    </PageLayout>
  )
} 