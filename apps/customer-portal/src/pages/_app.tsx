import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import { ThemeProvider } from '../contexts/ThemeContext'

function AppContent({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    console.log('🔍 _app.tsx: Auth state check - isLoading:', isLoading, 'isAuthenticated:', isAuthenticated, 'pathname:', router.pathname);
    
    if (!isLoading && !isAuthenticated) {
      const publicPages = ['/login', '/', '/help', '/services', '/tickets', '/ratings', '/profile', '/account', '/knowledge', '/settings']
      if (!publicPages.includes(router.pathname)) {
        console.log('🔍 _app.tsx: Redirecting unauthenticated user to login');
        // Redirect to admin dashboard login
        window.location.href = 'http://localhost:3001/login'
      }
    }
  }, [isAuthenticated, isLoading, router.pathname])

  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return <Component {...pageProps} />
}

export default function App(props: AppProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent {...props} />
      </AuthProvider>
    </ThemeProvider>
  )
}
