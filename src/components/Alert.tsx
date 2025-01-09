'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface AlertContextType {
  showAlert: (message: string, type: 'success' | 'error' | 'info') => void
  hideAlert: () => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alert, setAlert] = useState<{
    message: string
    type: 'success' | 'error' | 'info'
    visible: boolean
  } | null>(null)

  const showAlert = (message: string, type: 'success' | 'error' | 'info') => {
    setAlert({ message, type, visible: true })
    if (type === 'success') {
      setTimeout(() => {
        hideAlert()
      }, 5000)
    }
  }

  const hideAlert = () => {
    setAlert(prev => prev ? { ...prev, visible: false } : null)
    setTimeout(() => {
      setAlert(null)
    }, 500) // Fade-out animasyonu için bekle
  }

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <AnimatePresence>
        {alert && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
              alert.type === 'success'
                ? 'bg-green-600 text-white'
                : alert.type === 'error'
                ? 'bg-red-600 text-white'
                : 'bg-indigo-600 text-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="mr-8">{alert.message}</span>
              <button
                onClick={hideAlert}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AlertContext.Provider>
  )
}

export function useAlert() {
  const context = useContext(AlertContext)
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider')
  }
  return context
} 