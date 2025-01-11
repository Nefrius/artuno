'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { getUserRole, type UserProfile } from '@/lib/supabase'
import { supabase } from '@/lib/supabase'
import { Trash2, Send, Users } from 'lucide-react'

type NotificationType = 'info' | 'success' | 'warning' | 'error';

export default function AdminPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: '',
    type: 'info' as NotificationType
  })

  const checkAdminStatus = useCallback(async () => {
    if (!user) return
    const role = await getUserRole(user.uid)
    setIsAdmin(role === 'admin')
    if (role !== 'admin') {
      router.push('/')
    }
  }, [user, router])

  useEffect(() => {
    if (!user) {
      router.push('/')
      return
    }

    checkAdminStatus()
    fetchUsers()
  }, [user, router, checkAdminStatus])

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('email')

      if (error) throw error
      if (data) setUsers(data)
    } catch (error) {
      console.error('Kullanıcılar alınamadı:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) return

    try {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId)

      if (error) throw error
      setUsers(users.filter(u => u.id !== userId))
    } catch (error) {
      console.error('Kullanıcı silinemedi:', error)
    }
  }

  const handleSendNotification = async () => {
    try {
      // Tüm kullanıcılara bildirim gönder
      const notifications = users.map(user => ({
        user_id: user.id,
        title: notificationForm.title,
        message: notificationForm.message,
        type: notificationForm.type,
        read: false
      }))

      const { error } = await supabase
        .from('notifications')
        .insert(notifications)

      if (error) throw error

      setNotificationForm({
        title: '',
        message: '',
        type: 'info'
      })

      alert('Bildirimler başarıyla gönderildi!')
    } catch (error) {
      console.error('Bildirimler gönderilemedi:', error)
      alert('Bildirimler gönderilirken bir hata oluştu.')
    }
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl font-bold mb-8">Admin Paneli</h1>

        {/* Bildirim Gönderme Formu */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Toplu Bildirim Gönder</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Başlık
              </label>
              <input
                type="text"
                value={notificationForm.title}
                onChange={(e) => setNotificationForm(prev => ({
                  ...prev,
                  title: e.target.value
                }))}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Bildirim başlığı"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mesaj
              </label>
              <textarea
                value={notificationForm.message}
                onChange={(e) => setNotificationForm(prev => ({
                  ...prev,
                  message: e.target.value
                }))}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Bildirim mesajı"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tip
              </label>
              <select
                value={notificationForm.type}
                onChange={(e) => setNotificationForm(prev => ({
                  ...prev,
                  type: e.target.value as NotificationType
                }))}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="info">Bilgi</option>
                <option value="success">Başarılı</option>
                <option value="warning">Uyarı</option>
                <option value="error">Hata</option>
              </select>
            </div>

            <button
              onClick={handleSendNotification}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              <Send className="h-5 w-5" />
              Bildirimi Gönder
            </button>
          </div>
        </div>

        {/* Kullanıcı Listesi */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Users className="h-6 w-6 text-indigo-600" />
            <h2 className="text-xl font-semibold">Kullanıcılar</h2>
          </div>

          {loading ? (
            <div className="text-center text-gray-500 py-8">
              Yükleniyor...
            </div>
          ) : (
            <div className="divide-y">
              {users.map(user => (
                <div
                  key={user.id}
                  className="py-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{user.email}</p>
                    <p className="text-sm text-gray-500">
                      Rol: {user.role}
                    </p>
                  </div>
                  
                  {user.role !== 'admin' && (
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
} 