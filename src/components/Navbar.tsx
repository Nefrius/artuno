'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { usePathname } from 'next/navigation'
import NotificationBell from './NotificationBell'
import { getUserRole } from '@/lib/supabase'
import { Menu, X, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const checkAdminStatus = useCallback(async () => {
    if (!user) return
    const role = await getUserRole(user.uid)
    setIsAdmin(role === 'admin')
  }, [user])

  useEffect(() => {
    if (user) {
      checkAdminStatus()
    }
  }, [user, checkAdminStatus])

  const navItems = [
    { href: '/', label: 'Ana Sayfa' },
    { href: '/markets', label: 'Piyasalar' },
    { href: '/how-it-works', label: 'Nasıl Çalışır?' },
    { href: '/about', label: 'Hakkında' },
  ]

  const userNavItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/settings', label: 'Ayarlar' },
  ]

  if (isAdmin) {
    userNavItems.unshift({ href: '/admin', label: 'Admin Panel' })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Arama işlemi burada yapılacak
    console.log('Arama yapılıyor:', searchQuery)
  }

  return (
    <motion.nav 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between px-4 py-3 space-y-3 lg:space-y-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex-shrink-0">
                <motion.span 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-2xl font-bold text-indigo-600"
                >
                  Artuno
                </motion.span>
              </Link>

              <div className="hidden lg:flex lg:space-x-8">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 ${
                        pathname === item.href
                          ? 'text-indigo-600'
                          : 'text-gray-500 hover:text-indigo-600'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mobil menü butonu */}
            <div className="flex items-center lg:hidden">
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-md text-gray-500 hover:text-indigo-600 hover:bg-gray-100 transition-colors duration-200"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
            </div>
          </div>

          {/* Arama çubuğu */}
          <div className="flex-1 max-w-2xl mx-auto lg:mx-8 w-full">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="Kullanıcı ara..."
                />
              </div>
            </form>
          </div>

          {/* Kullanıcı menüsü */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            {user ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-4"
              >
                <NotificationBell />
                {userNavItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className="text-gray-500 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: userNavItems.length * 0.1 }}
                  onClick={() => logout()}
                  className="text-gray-500 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Çıkış Yap
                </motion.button>
              </motion.div>
            ) : (
              <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => logout()}
                className="bg-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-700 transition-colors duration-200"
              >
                Google ile Giriş Yap
              </motion.button>
            )}
          </div>
        </div>

        {/* Mobil menü */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t border-gray-200"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map((item) => (
                  <motion.div
                    key={item.href}
                    variants={{
                      open: {
                        y: 0,
                        opacity: 1,
                        transition: {
                          y: { stiffness: 1000, velocity: -100 }
                        }
                      },
                      closed: {
                        y: 50,
                        opacity: 0,
                        transition: {
                          y: { stiffness: 1000 }
                        }
                      }
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                        pathname === item.href
                          ? 'text-indigo-600'
                          : 'text-gray-500 hover:text-indigo-600'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}

                {user ? (
                  <>
                    <div className="px-3 py-2">
                      <NotificationBell />
                    </div>
                    {userNavItems.map((item) => (
                      <motion.div
                        key={item.href}
                        variants={{
                          open: {
                            y: 0,
                            opacity: 1,
                            transition: {
                              y: { stiffness: 1000, velocity: -100 }
                            }
                          },
                          closed: {
                            y: 50,
                            opacity: 0,
                            transition: {
                              y: { stiffness: 1000 }
                            }
                          }
                        }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-indigo-600 transition-colors duration-200"
                        >
                          {item.label}
                        </Link>
                      </motion.div>
                    ))}
                    <motion.div
                      variants={{
                        open: {
                          y: 0,
                          opacity: 1,
                          transition: {
                            y: { stiffness: 1000, velocity: -100 }
                          }
                        },
                        closed: {
                          y: 50,
                          opacity: 0,
                          transition: {
                            y: { stiffness: 1000 }
                          }
                        }
                      }}
                    >
                      <button
                        onClick={() => {
                          logout()
                          setIsOpen(false)
                        }}
                        className="block w-full text-left px-3 py-2 text-base font-medium text-gray-500 hover:text-indigo-600 transition-colors duration-200"
                      >
                        Çıkış Yap
                      </button>
                    </motion.div>
                  </>
                ) : (
                  <motion.div
                    variants={{
                      open: {
                        y: 0,
                        opacity: 1,
                        transition: {
                          y: { stiffness: 1000, velocity: -100 }
                        }
                      },
                      closed: {
                        y: 50,
                        opacity: 0,
                        transition: {
                          y: { stiffness: 1000 }
                        }
                      }
                    }}
                    className="px-3 py-2"
                  >
                    <button
                      onClick={() => {
                        logout()
                        setIsOpen(false)
                      }}
                      className="w-full bg-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-700 transition-colors duration-200"
                    >
                      Google ile Giriş Yap
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
} 