'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Trash2, Bell, Mail, Lock, AlertTriangle } from 'lucide-react'
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { motion } from 'framer-motion'

export default function SettingsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleDeleteAccount = async () => {
    if (!user) return
    
    setLoading(true)
    setError('')
    
    try {
      const credential = EmailAuthProvider.credential(user.email!, password)
      await reauthenticateWithCredential(user, credential)
      await deleteUser(user)
      router.push('/')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    router.push('/')
    return null
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <motion.div 
        className="max-w-4xl mx-auto px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="bg-white rounded-2xl shadow-sm overflow-hidden"
          variants={itemVariants}
        >
          <div className="border-b border-gray-100 p-6">
            <h1 className="text-2xl font-bold text-gray-900">Hesap Ayarları</h1>
          </div>

          <div className="p-6 space-y-8">
            {/* Profil Bilgileri */}
            <motion.section variants={itemVariants} className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-gray-900">Profil Bilgileri</h2>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Adresi</label>
                  <input
                    type="email"
                    value={user.email || ''}
                    readOnly
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giriş Yöntemi</label>
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700">
                    <Lock className="w-4 h-4 text-gray-500" />
                    {user.providerData[0]?.providerId === 'password' ? 'Email/Şifre' : 'Google ile Giriş'}
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Bildirim Ayarları */}
            <motion.section variants={itemVariants} className="space-y-4 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-gray-900">Bildirim Ayarları</h2>
              </div>
              <div className="space-y-4">
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all duration-200"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-gray-900">Uygulama Bildirimleri</p>
                    <p className="text-sm text-gray-500">Önemli güncellemeler ve fiyat uyarıları</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all duration-200"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-gray-900">Email Bildirimleri</p>
                    <p className="text-sm text-gray-500">Haftalık özet ve özel teklifler</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </motion.div>
              </div>
            </motion.section>

            {/* Hesap Silme */}
            <motion.section variants={itemVariants} className="space-y-4 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h2 className="text-lg font-semibold text-red-600">Tehlikeli Bölge</h2>
              </div>
              
              {!showDeleteConfirm ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2 px-4 py-2.5 text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-all duration-200"
                >
                  <Trash2 className="w-5 h-5" />
                  Hesabı Sil
                </motion.button>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 bg-red-50 p-6 rounded-xl border border-red-200"
                >
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="w-5 h-5" />
                    <p className="font-medium">Bu işlem geri alınamaz</p>
                  </div>
                  
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-600 text-sm bg-red-100 p-3 rounded-xl border border-red-200"
                    >
                      {error}
                    </motion.div>
                  )}
                  
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Şifrenizi girin"
                    className="w-full px-4 py-2.5 border border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  />
                  
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleDeleteAccount}
                      disabled={loading}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 transition-all duration-200"
                    >
                      {loading ? 'Siliniyor...' : 'Hesabı Sil'}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-6 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all duration-200"
                    >
                      İptal
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </motion.section>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
} 