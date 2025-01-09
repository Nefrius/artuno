'use client'

import { useAuth } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'
import { User, Mail, Bell, Shield, LogOut } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const router = useRouter()

  if (!user) {
    router.push('/')
    return null
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Profil Kartı */}
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden mb-8">
            <div className="px-6 py-8">
              <div className="flex items-center">
                {user.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt="Profil fotoğrafı"
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center">
                    <User className="h-10 w-10 text-indigo-600" />
                  </div>
                )}
                <div className="ml-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {user.displayName || 'Kullanıcı'}
                  </h2>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ayarlar Listesi */}
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
            <div className="divide-y divide-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Hesap Ayarları
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">E-posta</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                        <Bell className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">Bildirimler</p>
                        <p className="text-sm text-gray-500">Bildirim tercihlerinizi yönetin</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">Güvenlik</p>
                        <p className="text-sm text-gray-500">Hesap güvenlik ayarlarınızı yönetin</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center w-full px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Çıkış Yap
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 