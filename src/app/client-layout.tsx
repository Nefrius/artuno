'use client'

import { AuthProvider } from '@/context/AuthContext'
import { AlertProvider } from '@/components/Alert'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <AlertProvider>
        {children}
      </AlertProvider>
    </AuthProvider>
  )
} 