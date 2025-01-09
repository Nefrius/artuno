'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import LoadingSpinner from '@/components/LoadingSpinner'
import { motion } from 'framer-motion'
import { Rocket, Brain, Lock, TrendingUp, Users, Shield } from 'lucide-react'

export default function AboutPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const features = [
    {
      icon: <Rocket className="w-8 h-8" />,
      title: 'Hızlı ve Güvenilir',
      description: 'Gerçek zamanlı kripto para verileri ve anlık tahmin oluşturma.'
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'Yapay Zeka Destekli',
      description: 'Gelişmiş AI modelleri ile güvenilir tahmin skorları.'
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: 'Güvenli Kimlik Doğrulama',
      description: 'Google hesabınızla güvenli ve hızlı giriş yapın.'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Detaylı Analizler',
      description: 'Kripto para piyasalarını detaylı şekilde analiz edin.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Topluluk Odaklı',
      description: 'Diğer yatırımcılarla etkileşime geçin ve deneyimlerinizi paylaşın.'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Veri Güvenliği',
      description: 'Verileriniz en üst düzey güvenlik önlemleriyle korunur.'
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Artuno Hakkında
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Artuno, kripto para piyasalarını yapay zeka ile analiz eden ve yatırımcılara
            güvenilir tahminler sunan yenilikçi bir platformdur.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Misyonumuz
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Kripto para piyasalarında yatırımcılara yardımcı olmak ve yapay zeka
            teknolojileri ile daha güvenilir yatırım kararları almalarını sağlamak.
          </p>
        </motion.div>
      </div>
    </div>
  )
} 