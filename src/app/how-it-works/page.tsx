'use client'

import Navbar from '@/components/Navbar'
import { Brain, TrendingUp, Users, Shield } from 'lucide-react'

export default function HowItWorksPage() {
  const features = [
    {
      name: 'Yapay Zeka Desteği',
      description: 'Gelişmiş yapay zeka modelleri ile daha isabetli tahminler yapın.',
      icon: Brain,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      name: 'Gerçek Zamanlı Veriler',
      description: 'En güncel kripto para verilerine anında erişin.',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Topluluk',
      description: 'Diğer kullanıcılarla yarışın ve deneyimlerinizi paylaşın.',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Güvenli',
      description: 'Google hesabınızla güvenli bir şekilde giriş yapın.',
      icon: Shield,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ]

  const steps = [
    {
      number: '01',
      title: 'Giriş Yapın',
      description: 'Google hesabınızla hızlıca giriş yapın ve platformu kullanmaya başlayın.'
    },
    {
      number: '02',
      title: 'Kripto Para Seçin',
      description: 'Tahmin yapmak istediğiniz kripto parayı listeden seçin.'
    },
    {
      number: '03',
      title: 'Yön Belirleyin',
      description: 'Seçtiğiniz kripto paranın yükseleceğini mi, düşeceğini mi tahmin ediyorsunuz?'
    },
    {
      number: '04',
      title: 'Sonuçları Takip Edin',
      description: '24 saat sonra tahmininizin doğru mu yanlış mı olduğunu öğrenin.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Kripto Para Tahminleri
            <span className="block text-indigo-600">Nasıl Çalışır?</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Artuno'nun yapay zeka destekli tahmin sistemini kullanarak kripto para piyasalarında daha isabetli tahminler yapın.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Özellikler
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Artuno'yu özel yapan özellikleri keşfedin
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              {features.map((feature) => (
                <div key={feature.name} className="relative">
                  <div>
                    <div className={`absolute h-12 w-12 rounded-md flex items-center justify-center ${feature.bgColor}`}>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} aria-hidden="true" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                  </div>
                  <div className="mt-2 ml-16 text-base text-gray-500">
                    {feature.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Nasıl Kullanılır?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Dört basit adımda tahmin yapmaya başlayın
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              {steps.map((step) => (
                <div key={step.number} className="relative">
                  <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 ease-in-out">
                    <span className="text-4xl font-bold text-indigo-600">{step.number}</span>
                    <h3 className="mt-4 text-xl font-medium text-gray-900">{step.title}</h3>
                    <p className="mt-2 text-base text-gray-500">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 