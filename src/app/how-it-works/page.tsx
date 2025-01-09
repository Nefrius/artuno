'use client'

import PageLayout from '@/components/PageLayout'
import { motion } from 'framer-motion'
import { Code, ChartBar, Brain, Lock, Search, TrendingUp } from 'lucide-react'

export default function HowItWorksPage() {
  const features = [
    {
      icon: <Search className="w-12 h-12 text-indigo-500" />,
      title: "Kripto Para Arama",
      description: "Binlerce kripto para arasından istediğinizi kolayca bulun ve detaylı bilgilere ulaşın."
    },
    {
      icon: <ChartBar className="w-12 h-12 text-indigo-500" />,
      title: "Gerçek Zamanlı Veriler",
      description: "24 saatlik fiyat değişimleri, işlem hacimleri ve diğer önemli metrikleri anlık olarak takip edin."
    },
    {
      icon: <Brain className="w-12 h-12 text-indigo-500" />,
      title: "Yapay Zeka Analizi",
      description: "Gelişmiş yapay zeka algoritmaları ile fiyat tahminleri ve trend analizleri alın."
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-indigo-500" />,
      title: "Teknik Analiz",
      description: "Detaylı grafikler ve teknik göstergeler ile piyasayı daha iyi analiz edin."
    },
    {
      icon: <Lock className="w-12 h-12 text-indigo-500" />,
      title: "Güvenli Giriş",
      description: "Google hesabınız ile güvenli bir şekilde giriş yapın ve kişiselleştirilmiş deneyim yaşayın."
    },
    {
      icon: <Code className="w-12 h-12 text-indigo-500" />,
      title: "Modern Teknoloji",
      description: "En son web teknolojileri ile geliştirilmiş hızlı ve güvenilir platform."
    }
  ]

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Artuno Nasıl Çalışır?
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Kripto para analizi ve tahminleri için modern ve kullanıcı dostu platform
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Hemen Başlayın
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Kripto para piyasasını daha iyi anlamak için Artuno&apos;yu kullanmaya başlayın
          </p>
          <a
            href="/markets"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Piyasaları İncele
          </a>
        </motion.div>
      </div>
    </PageLayout>
  )
} 