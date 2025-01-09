'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import LoadingSpinner from '@/components/LoadingSpinner'
import PageLayout from '@/components/PageLayout'
import { motion } from 'framer-motion'
import { Users, Shield, Zap, Heart } from 'lucide-react'

export default function AboutPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const values = [
    {
      icon: <Users className="w-12 h-12 text-indigo-500" />,
      title: "Topluluk Odaklı",
      description: "Kripto para topluluğuna değer katmak ve kullanıcılarımıza en iyi deneyimi sunmak için çalışıyoruz."
    },
    {
      icon: <Shield className="w-12 h-12 text-indigo-500" />,
      title: "Güvenilir",
      description: "En güncel güvenlik önlemleri ve şeffaf yaklaşımımızla kullanıcılarımızın güvenini kazanıyoruz."
    },
    {
      icon: <Zap className="w-12 h-12 text-indigo-500" />,
      title: "Yenilikçi",
      description: "En son teknolojileri kullanarak sürekli kendimizi geliştiriyor ve yeniliklere öncülük ediyoruz."
    },
    {
      icon: <Heart className="w-12 h-12 text-indigo-500" />,
      title: "Tutkulu",
      description: "Kripto para teknolojilerine olan tutkumuzla her gün daha iyisini sunmak için çalışıyoruz."
    }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navbar />
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Hakkımızda
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Artuno, kripto para piyasasını herkes için daha anlaşılır ve erişilebilir kılma misyonuyla yola çıktı.
            Yapay zeka teknolojileri ve kullanıcı dostu arayüzümüzle, yatırımcılara değer katmayı hedefliyoruz.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-indigo-50 rounded-2xl p-8 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Vizyonumuz
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Kripto para piyasasında güvenilir bir rehber olmak ve yapay zeka teknolojileri ile
            kullanıcılarımıza değer katmaya devam etmek.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a
              href="/markets"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Piyasaları İncele
            </a>
            <a
              href="/how-it-works"
              className="inline-flex items-center px-6 py-3 border border-indigo-600 text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
            >
              Nasıl Çalışır?
            </a>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  )
} 