'use client'

import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, ChevronDown, Settings, LogOut, User, Loader } from 'lucide-react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useAlert } from './Alert'

export default function Navbar() {
  const { user, loading, signInWithGoogle, logout } = useAuth()
  const { showAlert } = useAlert()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isAuthLoading, setIsAuthLoading] = useState(false)

  const navigation = [
    { name: 'Ana Sayfa', href: '/' },
    { name: 'Piyasalar', href: '/markets' },
    { name: 'Tahminler', href: '/predictions', requireAuth: true },
    { name: 'Nasıl Çalışır?', href: '/how-it-works' },
    { name: 'Hakkında', href: '/about' },
  ]

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }

  const handleSignIn = async () => {
    try {
      setIsAuthLoading(true)
      showAlert('Giriş yapılıyor...', 'info')
      await signInWithGoogle()
      showAlert('Giriş başarıyla yapıldı!', 'success')
    } catch {
      showAlert('Giriş işlemi iptal edildi.', 'error')
    } finally {
      setIsAuthLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      setIsAuthLoading(true)
      await logout()
      showAlert('Çıkış yapıldı.', 'info')
    } catch {
      showAlert('Çıkış yapılırken bir hata oluştu.', 'error')
    } finally {
      setIsAuthLoading(false)
    }
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="bg-white shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
                Artuno
              </Link>
            </motion.div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                if (item.requireAuth && !user) return null
                return (
                  <motion.div
                    key={item.href}
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                  >
                    <Link
                      href={item.href}
                      className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                        pathname === item.href
                          ? 'border-b-2 border-indigo-500 text-gray-900'
                          : 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      } transition-all duration-200`}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </div>

          <div className="flex items-center">
            {!loading && (
              <>
                {user ? (
                  <div className="relative ml-3">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        disabled={isAuthLoading}
                      >
                        <span className="sr-only">Kullanıcı menüsünü aç</span>
                        {user.photoURL ? (
                          <Image
                            className="h-8 w-8 rounded-full"
                            src={user.photoURL}
                            alt=""
                            width={32}
                            height={32}
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-indigo-600" />
                          </div>
                        )}
                        <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />
                      </button>
                    </motion.div>
                    <AnimatePresence>
                      {isProfileOpen && (
                        <motion.div
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          variants={menuVariants}
                          className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                        >
                          <div className="py-1">
                            <div className="px-4 py-2 text-sm text-gray-700 border-b">
                              {user.email}
                            </div>
                            <motion.div
                              whileHover={{ x: 5 }}
                              className="block w-full text-left"
                            >
                              <Link
                                href="/settings"
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Settings className="mr-2 h-4 w-4" />
                                Ayarlar
                              </Link>
                            </motion.div>
                            <motion.button
                              whileHover={{ x: 5 }}
                              onClick={handleLogout}
                              disabled={isAuthLoading}
                              className="flex w-full items-center px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                            >
                              {isAuthLoading ? (
                                <Loader className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <LogOut className="mr-2 h-4 w-4" />
                              )}
                              Çıkış Yap
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSignIn}
                    disabled={isAuthLoading}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors flex items-center"
                  >
                    {isAuthLoading ? (
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Google ile Giriş Yap
                  </motion.button>
                )}
              </>
            )}

            <div className="flex items-center sm:hidden ml-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <span className="sr-only">Menüyü aç</span>
                {isOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={menuVariants}
              className="sm:hidden"
            >
              <div className="pt-2 pb-3 space-y-1">
                {navigation.map((item) => {
                  if (item.requireAuth && !user) return null
                  return (
                    <motion.div
                      key={item.href}
                      whileHover={{ x: 5 }}
                      whileTap={{ x: 0 }}
                    >
                      <Link
                        href={item.href}
                        className={`block pl-3 pr-4 py-2 text-base font-medium ${
                          pathname === item.href
                            ? 'bg-indigo-50 border-l-4 border-indigo-500 text-indigo-700'
                            : 'border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                        } transition-all duration-200`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
} 