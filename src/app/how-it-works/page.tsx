'use client'

import PageLayout from '@/components/PageLayout'
import { motion } from 'framer-motion'

export default function HowItWorksPage() {
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-lg rounded-2xl p-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Nasıl Çalışır?
          </h1>

          <div className="space-y-6 text-gray-600">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                1. Google ile Giriş Yapın
              </h2>
              <p>
                Artuno&apos;yu kullanmaya başlamak için Google hesabınızla giriş yapmanız yeterli.
                Güvenli ve hızlı bir şekilde sisteme erişebilirsiniz.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                2. Kripto Para Seçin
              </h2>
              <p>
                Tahmin yapmak istediğiniz kripto parayı seçin. Popüler coinlerin
                güncel fiyatlarını ve trend bilgilerini görüntüleyebilirsiniz.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                3. Tahmininizi Yapın
              </h2>
              <p>
                Seçtiğiniz kripto paranın 24 saat içindeki yönünü tahmin edin.
                Yükseliş veya düşüş beklentinizi belirtin.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                4. Sonuçları Takip Edin
              </h2>
              <p>
                24 saat sonra tahmininizin sonucu otomatik olarak kontrol edilir.
                Profilinizden tüm tahminlerinizi ve başarı oranınızı görebilirsiniz.
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mt-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Önemli Notlar
              </h3>
              <ul className="list-disc list-inside space-y-2 text-blue-800">
                <li>Her gün sınırlı sayıda tahmin yapabilirsiniz</li>
                <li>Tahminler 24 saat geçerlidir</li>
                <li>Sonuçlar otomatik olarak kontrol edilir</li>
                <li>Başarılı tahminleriniz profilinizde görüntülenir</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  )
} 