'use client'

import LoadingSpinner from './LoadingSpinner'
import { motion } from 'framer-motion'
import Navbar from './Navbar'
import { ReactNode } from 'react'

interface PageLayoutProps {
  children: ReactNode
  loading?: boolean
}

const PageLayout = ({ children, loading = false }: PageLayoutProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        {children}
      </motion.div>
    </div>
  )
}

export default PageLayout 