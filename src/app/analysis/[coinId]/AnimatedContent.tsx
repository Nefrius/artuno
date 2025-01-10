'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Suspense } from 'react'
import CoinAnalysisContent from './CoinAnalysisContent'
import LoadingSpinner from '@/components/LoadingSpinner'
import PageLayout from '@/components/PageLayout'

interface AnimatedContentProps {
  coinId: string
}

export default function AnimatedContent({ coinId }: AnimatedContentProps) {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12">
              <Image
                src={`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${coinId.toLowerCase()}.png`}
                alt={`${coinId} logo`}
                width={48}
                height={48}
                className="rounded-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/generic.png'
                }}
              />
            </div>
            <div>
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-gray-900"
              >
                {coinId.toUpperCase()} Analizi
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-1 text-gray-500"
              >
                Yapay zeka destekli teknik ve temel analiz
              </motion.p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Suspense fallback={<LoadingSpinner />}>
            <CoinAnalysisContent coinId={coinId} />
          </Suspense>
        </motion.div>
      </div>
    </PageLayout>
  )
} 