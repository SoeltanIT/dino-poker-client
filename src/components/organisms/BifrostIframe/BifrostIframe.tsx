'use client'

import { useThemeToggle } from '@/utils/hooks/useTheme'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    fulla?: any
  }
}

interface BifrostIframeProps {
  brandToken?: string
  baseUrl?: string
  language?: string
  currency?: string
}

// ✅ Native debounce implementation
function debounce<T extends (...args: any[]) => void>(func: T, wait: number): T {
  let timeout: ReturnType<typeof setTimeout> | null
  return function (...args: any[]) {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  } as T
}

export const BifrostIframe = ({
  brandToken = '83d9b9fa-8b83-4e46-ab40-18e7a9e8276a',
  baseUrl = process.env.NEXT_PUBLIC_ODIN_URL ?? 'https://iframe.integration.fulla.bet',
  language = 'ko',
  currency = 'KRW'
}: BifrostIframeProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { data: session } = useSession()
  const token = session?.accessToken || ''
  const queryClient = useQueryClient() // ⬅️ ini akses query client

  const eventHandlerRef = useRef<(e: any) => void>()

  const { theme, toggleTheme } = useThemeToggle()

  const [iframeHeight, setIframeHeight] = useState('100vh')

  // ✅ Calculate dynamic iframe height
  useEffect(() => {
    const updateIframeHeight = () => {
      const headerHeight = 72
      const navbarHeight = 60
      const vh = window.innerHeight
      const calculatedHeight = vh - headerHeight - navbarHeight
      setIframeHeight(`${calculatedHeight}px`)
    }

    updateIframeHeight()
    window.addEventListener('resize', updateIframeHeight)
    return () => window.removeEventListener('resize', updateIframeHeight)
  }, [])

  // ✅ Define debounced handler only once
  useEffect(() => {
    eventHandlerRef.current = debounce((e: any) => {
      console.log('[FULLA] Event received:', e)

      if (e.type === 'ERROR') {
        console.error('[FULLA] ERROR code:', e.error)
        setIsLoading(false) // stop loading indicator
      }

      if (e.error === 0 || e.error === 'MAINTENANCE') {
        setIsLoading(false)
        // Optional: set a `isMaintenance` flag to show alternate content
      }

      if (e.type === 'LOADED') {
        console.log('[FULLA] iFrame loaded successfully.')
        setIsLoading(false) // stop loading indicator
      }

      if (e?.type === 'REQUEST_REFRESH_BALANCE') {
        console.log('Throttled balance refresh request')
        queryClient.invalidateQueries({ queryKey: ['user', 'me'] })
        queryClient.invalidateQueries({ queryKey: ['getBalance'] })
        queryClient.invalidateQueries({ queryKey: ['getBetHistory'] })
        queryClient.invalidateQueries({ queryKey: ['getMyPromotionOngoing'] })
        queryClient.invalidateQueries({ queryKey: ['getMyPromotionHistory'] })
      }

      if (e?.type === 'ROUTE_CHANGE') {
        console.log('route >>', e.route)
      }

      if (e?.type === 'ANALYTICS' && e?.action === 'bet-accepted') {
        console.log('Trigger bet accepted request')
        queryClient.invalidateQueries({ queryKey: ['getBetHistory'] })
        queryClient.invalidateQueries({ queryKey: ['getMyPromotionOngoing'] })
        queryClient.invalidateQueries({ queryKey: ['getMyPromotionHistory'] })
      }
    }, 1000)
  }, [])

  // 👁️ Lazy-load with IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isVisible) {
      setIsLoading(true) // start loading again when iFrame about to load
    }
  }, [isVisible])

  // 🧠 Load Fulla iframe script when visible
  useEffect(() => {
    if (!isVisible) return

    const script = document.createElement('script')
    script.src = `${baseUrl}/script.js`
    script.async = true

    const loadingTimeout = setTimeout(() => {
      console.warn('[FULLA] Loading timeout — no response from iframe.')
      setIsLoading(false)
    }, 3000)

    script.onload = () => {
      // Clean up before reinit
      window.fulla?.instance?.destroy?.()

      if (window.fulla?.buildIframe) {
        setIsLoading(true)
        window.fulla.buildIframe({
          token,
          brandToken,
          baseUrl,
          language,
          currency,
          contentElement: '#bifrost',
          darkMode: theme !== 'light',
          eventHandler: (e: any) => eventHandlerRef.current?.(e)
        })
      } else {
        console.error('Fulla script failed to load.')
        clearTimeout(loadingTimeout)
        setIsLoading(false)
      }
    }

    document.body.appendChild(script)

    return () => {
      clearTimeout(loadingTimeout)
      script.remove()
      window.fulla?.instance?.destroy?.()
    }
  }, [isVisible, token, brandToken, baseUrl, language, currency, theme])

  return (
    <div ref={containerRef} className='w-full min-h-screen'>
      <div className='relative w-full'>
        {isLoading && (
          <div className='absolute inset-0 z-10 flex items-center justify-center'>
            <Loader2 className='w-10 h-10 animate-spin text-app-primary' />
          </div>
        )}

        <div
          id='bifrost'
          className='w-full rounded-xl shadow-md border-none'
          style={{
            height: iframeHeight,
            willChange: 'transform',
            contain: 'layout paint'
          }}
        />
      </div>
    </div>
  )
}
