'use client'

import { useState } from 'react'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, AuthError } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { FcGoogle } from 'react-icons/fc'
import { HiMail } from 'react-icons/hi'
import { RiLockPasswordLine } from 'react-icons/ri'
import { IoClose } from 'react-icons/io5'
import { motion, AnimatePresence } from 'framer-motion'

interface LoginFormProps {
  onClose?: () => void
}

export default function LoginForm({ onClose }: LoginFormProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
    } catch (error) {
      const authError = error as AuthError
      setError(authError.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setLoading(true)
    const provider = new GoogleAuthProvider()
    
    try {
      await signInWithPopup(auth, provider)
    } catch (error) {
      const authError = error as AuthError
      setError(authError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl relative"
    >
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <IoClose className="w-6 h-6" />
        </button>
      )}
      
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
      >
        {isSignUp ? 'Hesap Oluştur' : 'Giriş Yap'}
      </motion.h2>
      
      <form onSubmit={handleEmailAuth} className="space-y-5">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiMail className="text-gray-400 h-5 w-5" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              placeholder="ornek@email.com"
              required
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Şifre</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <RiLockPasswordLine className="text-gray-400 h-5 w-5" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              placeholder="••••••••"
              required
            />
          </div>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-50 border border-red-200 rounded-xl p-3"
            >
              <p className="text-sm text-red-600">
                {error}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:opacity-90 transition-all duration-200 disabled:opacity-50"
        >
          {loading ? 'İşleniyor...' : (isSignUp ? 'Kayıt Ol' : 'Giriş Yap')}
        </motion.button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">veya</span>
        </div>
      </div>

      <motion.button
        onClick={handleGoogleSignIn}
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
      >
        <FcGoogle className="w-5 h-5" />
        <span className="font-medium text-gray-700">Google ile devam et</span>
      </motion.button>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-sm text-gray-600"
      >
        {isSignUp ? 'Zaten hesabınız var mı?' : 'Hesabınız yok mu?'}
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="ml-1 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
        >
          {isSignUp ? 'Giriş Yap' : 'Kayıt Ol'}
        </button>
      </motion.p>
    </motion.div>
  )
} 