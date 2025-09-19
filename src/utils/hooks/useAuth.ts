'use client'

import { useSession } from 'next-auth/react'
import { useCookies } from 'react-cookie'
import { useEffect, useState } from 'react'

export function useAuth() {
  const { data: session, status } = useSession()
  const [cookies] = useCookies(['_authorization'])
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [likelyLoggedIn, setLikelyLoggedIn] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if we have either a valid session or a valid authorization cookie
    const hasSession = !!session?.user && !!session?.accessToken
    const hasCookie = !!cookies._authorization
    
    // Set likely logged in state based on cookie presence
    if (hasCookie && likelyLoggedIn === null) {
      setLikelyLoggedIn(true)
    } else if (!hasCookie && likelyLoggedIn === null) {
      setLikelyLoggedIn(false)
    }
    
    // If session is still loading, wait
    if (status === 'loading') {
      setIsLoading(true)
      setIsAuthenticated(null)
      return
    }

    // If session is unauthenticated but we have a cookie, there might be a sync issue
    if (status === 'unauthenticated' && hasCookie) {
      // Wait a bit more to see if session loads
      const timer = setTimeout(() => {
        setIsAuthenticated(false)
        setIsLoading(false)
      }, 1000)
      
      return () => clearTimeout(timer)
    }

    // Set authentication state
    setIsAuthenticated(hasSession || hasCookie)
    setIsLoading(false)
  }, [session, status, cookies._authorization, likelyLoggedIn])

  return {
    session,
    isAuthenticated: isAuthenticated ?? false,
    isLoading,
    status,
    likelyLoggedIn: likelyLoggedIn ?? false
  }
} 