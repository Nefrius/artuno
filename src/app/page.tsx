'use client'

import PageLayout from '@/components/PageLayout'
import { motion } from 'framer-motion'
import { TrendingUp, ChartBar, Shield, Brain, Users } from 'lucide-react'
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
          className="flex justify-center gap-6 mb-32"
        >
          {!user ? (
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-6">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Hemen Katılın
                </h3>
                <p className="text-gray-600 mb-6">
                  Kripto para piyasalarını analiz edin, yapay zeka destekli tahminler yapın ve yatırımlarınızı daha bilinçli yönetin.
                </p>
                <button
                  onClick={() => signInWithGoogle()}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-indigo-700 transition-colors w-full"
                >
                  Google ile Giriş Yap
                </button>
              </div>
            </motion.div>
          ) : (
            <>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-6">
                    <ChartBar className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Dashboard
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Dashboard&apos;ınıza giderek piyasa verilerini takip edebilir ve portföyünüzü yönetebilirsiniz.
                  </p>
                  <Link
                    href="/dashboard"
                    className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-indigo-700 transition-colors w-full inline-block text-center"
                  >
                    Dashboard&apos;a Git
                  </Link>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-6">
                    <TrendingUp className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Tahminler
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Yeni tahminler oluşturabilir, mevcut tahminlerinizi görüntüleyebilir ve başarı oranınızı takip edebilirsiniz.
                  </p>
                  <Link
                    href="/predictions"
                    className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-indigo-700 transition-colors w-full inline-block text-center"
                  >
                    Tahminlere Git
                  </Link>
                </div>
              </motion.div>
            </>
          )}
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
