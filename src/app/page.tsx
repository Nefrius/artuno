'use client'

import PageLayout from '@/components/PageLayout'
import { motion } from 'framer-motion'
import { TrendingUp, ChartBar, Shield, Brain, ArrowRight, Users } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

export default function HomePage() {
  const { user, signInWithGoogle } = useAuth()

  const features = [
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Gerçek Zamanlı Veriler',
      description: 'Kripto para piyasalarını anlık olarak takip edin.'
    },
    {
      icon: <ChartBar className="h-6 w-6" />,
      title: 'Detaylı Analizler',
      description: 'Kapsamlı piyasa analizleri ve tahminler.'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Güvenli Platform',
      description: 'Verileriniz güvenle saklanır ve korunur.'
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: 'Yapay Zeka',
      description: 'AI destekli tahmin ve analiz sistemleri.'
    }
  ]

  const stats = [
    { number: '10K+', label: 'Aktif Kullanıcı' },
    { number: '50K+', label: 'Tahmin' },
    { number: '95%', label: 'Doğruluk Oranı' },
    { number: '24/7', label: 'Destek' }
  ]

  const testimonials = [
    {
      name: 'Ahmet Y.',
      role: 'Yatırımcı',
      content: 'Artuno sayesinde yatırımlarımı daha bilinçli yönetiyorum. Harika bir platform!'
    },
    {
      name: 'Mehmet K.',
      role: 'Trader',
      content: 'AI tahminleri gerçekten işe yarıyor. Artık daha güvenle işlem yapıyorum.'
    },
    {
      name: 'Ayşe S.',
      role: 'Analist',
      content: 'Kullanıcı dostu arayüzü ve detaylı analizleriyle vazgeçilmezim oldu.'
    }
  ]

  return (
    <PageLayout>
      {/* Hero Section */}
      <div className="text-center mb-24">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-8"
        >
          Kripto Para Analizi ve
          <span className="text-indigo-600"> AI Tahminleri</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto"
        >
          Yapay zeka teknolojisi ile kripto para piyasalarını analiz edin,
          güvenilir tahminler yapın ve yatırımlarınızı yönetin.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          {user ? (
            <Link
              href="/predictions"
              className="group inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transform hover:scale-105 transition-all duration-200"
            >
              Tahminlere Başla
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <Link
              href="/how-it-works"
              className="group inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transform hover:scale-105 transition-all duration-200"
            >
              Nasıl Çalışır?
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
          <Link
            href="/markets"
            className="inline-flex items-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transform hover:scale-105 transition-all duration-200"
          >
            Piyasaları Görüntüle
          </Link>
        </motion.div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-4 mx-auto">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mb-24">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-gray-900 mb-12"
          >
            Kullanıcılarımız Ne Diyor?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Users className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-3">
                    <div className="font-medium text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-500 text-sm">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-600">{testimonial.content}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="bg-indigo-600 text-white rounded-2xl p-12"
        >
          <h2 className="text-3xl font-bold mb-4">
            Hemen Başlayın
          </h2>
          <p className="text-lg mb-8">
            Kripto para piyasalarında bir adım önde olun.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => !user && signInWithGoogle()}
            className="bg-white text-indigo-600 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
          >
            {user ? 'Tahminlere Git' : 'Ücretsiz Deneyin'}
          </motion.button>
        </motion.div>
      </div>
    </PageLayout>
  )
}
