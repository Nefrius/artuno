import './globals.css'
import { Inter } from 'next/font/google'
import ClientLayout from './client-layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Artuno - Kripto Para Analiz ve Tahmin Platformu',
  description: 'Bitcoin ve altcoin verilerini analiz edin, grafiksel olarak görüntüleyin ve yapay zeka ile gelecek tahminlerini alın.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
