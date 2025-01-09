'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { createOrUpdateUser, getUserData } from '@/lib/services/user.service'
import { Database } from '@/lib/database.types'

type UserData = Database['public']['Tables']['users']['Row']

interface AuthContextType {
  user: FirebaseUser | null
  userData: UserData | null
  loading: boolean
  error: string | null
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  error: null,
  signInWithGoogle: async () => {},
  logout: async () => {}
})

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'Bilinmeyen bir hata oluştu'
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Firebase auth durumunu izle
  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setUser(user)
        if (user) {
          try {
            // Firebase kullanıcısını Supabase'e kaydet/güncelle
            const dbUser = await createOrUpdateUser(user)
            setUserData(dbUser)
            setError(null)
          } catch (error) {
            console.error('Kullanıcı verisi güncellenirken hata:', error)
            setError(getErrorMessage(error))
          }
        } else {
          setUserData(null)
          setError(null)
        }
        setLoading(false)
      })

      return () => unsubscribe()
    } catch (error) {
      console.error('Firebase auth hatası:', error)
      setError(getErrorMessage(error))
      setLoading(false)
    }
  }, [])

  // Kullanıcı verilerini periyodik olarak güncelle
  useEffect(() => {
    if (!user) return

    let isMounted = true

    const updateUserData = async () => {
      try {
        const updatedUserData = await getUserData(user.uid)
        if (isMounted) {
          setUserData(updatedUserData)
          setError(null)
        }
      } catch (error) {
        console.error('Kullanıcı verisi güncellenirken hata:', error)
        if (isMounted) {
          setError(getErrorMessage(error))
          // Kritik hata durumunda kullanıcıyı çıkış yaptır
          if (error instanceof Error && error.message.includes('RLS')) {
            await auth.signOut()
          }
        }
      }
    }

    updateUserData()
    const interval = setInterval(updateUserData, 60000) // Her dakika güncelle

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [user])

  const signInWithGoogle = async () => {
    try {
      setError(null)
      setLoading(true)
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.error('Google ile giriş yapılırken hata:', error)
      setError(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setError(null)
      setLoading(true)
      await signOut(auth)
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error)
      setError(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, userData, loading, error, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) 