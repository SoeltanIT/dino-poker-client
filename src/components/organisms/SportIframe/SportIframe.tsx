'use client'

import { GetData, useMutationQuery } from '@/@core/hooks/use-query'
import { UserMeResponse } from '@/@core/interface/User'
import { LiveChatButton } from '@/components/atoms/Button/LiveChatButton'
import RegisterFormState from '@/components/layout/header/views/register/RegisterFormState'
import DepositWithdrawSheet from '@/components/layout/header/views/transaction/DepositWithdrawSheet'
import LocaleSwitcherDropdown from '@/components/molecules/LocaleSwitcher'
import BetbySkeleton from '@/components/molecules/Skeleton/BetbySkeleton'
import { Locale } from '@/i18n-config'
import { cn } from '@/lib/utils'
import { LangProps } from '@/types/langProps'
import { useLiveChatContext } from '@/utils/context/LiveChatProvider'
import { useThemeToggle } from '@/utils/hooks/useTheme'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import LoginModal from '../Login'

declare global {
  interface Window {
    BTRenderer: any
    __betbyScriptLoaded?: boolean
  }
}

interface BetbyIframeProps {
  brandId?: string
  token?: string | null
  lang: LangProps
  locale?: Locale
  baseUrl?: string
}

export const BetByIframe = ({
  brandId = process.env.NEXT_PUBLIC_BETBY_BRAND_ID ?? '',
  baseUrl = process.env.NEXT_PUBLIC_BETBY_SCRIPT_URL ?? '',
  lang,
  locale = 'ko'
}: BetbyIframeProps) => {
  const { ready } = useLiveChatContext()
  const { data: userData, isLoading: userDataLoading } = GetData<UserMeResponse>(
    '/me', // hits your Next.js API route, not the real backend
    ['user', 'me']
  )
  const { mutateAsync: dataBetby, isPending: betbyPending } = useMutationQuery<any, any>(
    ['betbyToken'],
    'post',
    'json',
    false
  )

  // Keep the most recent token and prevent duplicate requests
  const tokenRef = useRef<string | null>(null)
  const tokenRequestInFlight = useRef<Promise<string | null> | null>(null)

  const getDataBetby = async (): Promise<string | null> => {
    if (tokenRequestInFlight.current) return tokenRequestInFlight.current

    const p = (async () => {
      try {
        const resp = await dataBetby({
          url: '/betbyToken',
          body: { type: 'betby', lang: locale }
        })
        // Your API shape: { data: { token }, status: 'success' }
        const t = resp?.data?.token ?? null
        tokenRef.current = typeof t === 'string' ? t : null
        return tokenRef.current
      } catch (e) {
        console.warn('[BETBY] getDataBetby failed', e)
        tokenRef.current = null
        return null
      } finally {
        tokenRequestInFlight.current = null
      }
    })()

    tokenRequestInFlight.current = p
    return p
  }
  // =================================================

  const containerRef = useRef<HTMLDivElement>(null)

  const { theme } = useThemeToggle()
  const [iframeHeight, setIframeHeight] = useState(768)
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { data: session, status } = useSession()
  const hasInitialized = useRef(false)
  const token = (session?.user as any)?.betbyToken ?? null
  const rendererRef = useRef<any>(null)
  const prevBtPathRef = useRef<string | null | undefined>(undefined)

  const sp = useSearchParams()
  const btPath = useMemo(() => {
    const raw = sp.get('bt-path')
    return raw ? decodeURIComponent(raw) : null
  }, [sp])

  const [isOpenBetSlip, setIsOpenBetSlip] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isOpenDeposit, setIsOpenDeposit] = useState(false)

  // ✅ Calculate dynamic iframe height
  useEffect(() => {
    const updateIframeHeight = () => {
      const headerHeight = 72
      const navbarHeight = 60
      const vh = window.innerHeight
      const calculatedHeight = vh - headerHeight - navbarHeight
      setIframeHeight(calculatedHeight)
    }

    updateIframeHeight()
    window.addEventListener('resize', updateIframeHeight)
    return () => window.removeEventListener('resize', updateIframeHeight)
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
      setIsLoading(true)
    }
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) {
      return
    }

    if (status === 'loading') {
      return
    }

    if (hasInitialized.current) {
      return
    }
    hasInitialized.current = true
    setIsLoading(true)

    const mount = async () => {
      const el = document.getElementById('betby')
      if (!el || !window.BTRenderer) {
        setIsLoading(false)
        return
      }

      // If user is authenticated, fetch a token before initialize.
      // If unauthenticated, initialize without token (guest mode).
      let initialToken: string | null = null
      if (status === 'authenticated') {
        initialToken = await getDataBetby()
      }

      const instance = new window.BTRenderer()
      rendererRef.current = instance.initialize({
        brand_id: brandId,
        token: initialToken ?? undefined,
        lang: locale,
        target: el,
        betslipZIndex: 999,
        themeName: theme === 'dark' ? 'gowin-dark-tile' : 'gowin-light-tile',
        currency: 'KRW',
        betSlipOffsetBottom: window.innerWidth >= 768 ? 0 : 60,
        betSlipOffsetTop: window.innerWidth >= 768 ? 81 : 72,
        stickyTop: window.innerWidth >= 768 ? 81 : 72,
        onLogin: () => {
          setIsModalOpen(true)
        },
        onRegister: () => {
          setIsRegisterOpen(true)
        },
        onRecharge: () => {
          setIsOpenDeposit(true)
        },
        onTokenExpired: async () => {
          console.log('[BETBY] onTokenExpired → fetching new token')
          const t = await getDataBetby()
          if (!t) console.warn('[BETBY] Token refresh failed.')
          return t
        },
        onBetSlipStateChange: (payload: { isOpen: boolean }) => {
          const next = typeof payload?.isOpen === 'boolean' ? payload.isOpen : false
          setIsOpenBetSlip(next)
        },
        onSessionRefresh: () => console.log('[BETBY] Session refreshed')
      })
      setIsLoading(false) //added
    }

    const ensureScript = () => {
      if (window.__betbyScriptLoaded) {
        mount()
        return
      }
      const exists = Array.from(document.scripts).some(s => s.src === baseUrl)
      if (exists) {
        window.__betbyScriptLoaded = true
        mount()
        return
      }
      const script = document.createElement('script')
      script.src = baseUrl
      script.async = true
      script.onload = () => {
        console.log('[BETBY] Script loaded successfully')
        window.__betbyScriptLoaded = true
        mount()
      }
      script.onerror = () => {
        console.error('[BETBY] script failed to load')
        setIsLoading(false)
      }
      document.body.appendChild(script)
    }

    const timeout = setTimeout(() => {
      console.warn('[BETBY] Loading timeout — no response from iframe.')
      setIsLoading(false)
    }, 2500)

    ensureScript()

    return () => {
      clearTimeout(timeout)
      try {
        rendererRef.current?.kill?.()
        console.log('[BETBY] Renderer killed on cleanup')
      } catch {}
      rendererRef.current = null
      setIsLoading(false)
      setIsOpenBetSlip(false) // restore buttons if iframe unmounts
    }
  }, [isVisible, status, baseUrl, brandId, locale])

  // 🔁 Respond to theme/lang updates
  useEffect(() => {
    if (!rendererRef.current?.updateOptions) return
    rendererRef.current.updateOptions({
      themeName: theme === 'dark' ? 'gowin-dark-tile' : 'gowin-light-tile',
      betSlipOffsetTop: window.innerWidth >= 768 ? 81 : 72,
      betSlipOffsetBottom: window?.innerWidth >= 768 ? 0 : 60,
      stickyTop: window.innerWidth >= 768 ? 81 : 72
    })

    // Track previous btPath to detect transitions
    const prev = prevBtPathRef.current
    const now = btPath

    const firstHome = prev === undefined && now == null
    const transitionedToHome = prev != null && now == null

    if (firstHome || transitionedToHome) {
      rendererRef.current.updateOptions({ url: '/' })
    }

    // update the previous value
    prevBtPathRef.current = now
  }, [theme, iframeHeight, btPath])

  return (
    <>
      <div ref={containerRef} className='relative w-full z-10' style={{ minHeight: iframeHeight }}>
        {/* Betby target - always mounted */}
        <div id='betby' className='w-full rounded-xl shadow-md border-none' />

        {/* Skeleton overlay - visible until content detected */}
        {isLoading && (
          <div className='absolute inset-0 flex' aria-label='Betby is loading'>
            <BetbySkeleton />
          </div>
        )}
      </div>
      {/* {isLoading && (
        <div className='flex min-w-full overflow-hidden' style={{ height: iframeHeight }}>
          <BetbySkeleton />
        </div>
      )}

      <div ref={containerRef} className='w-full'>
        <div className='relative w-full'>
          <div id='betby' className='w-full rounded-xl shadow-md border-none' />
        </div>
      </div> */}

      {!isOpenBetSlip && (
        <div className={cn('fixed bottom-[70px] md:bottom-16 right-4 z-[50]')}>
          <div className='flex md:hidden items-center justify-center w-14 h-14 bg-app-primary hover:bg-app-primary-hover rounded-full shadow-lg'>
            <LocaleSwitcherDropdown lang={locale} />
          </div>
          {ready && <LiveChatButton user={userData} ready={ready} />}
        </div>
      )}

      <DepositWithdrawSheet
        open={isOpenDeposit}
        onClose={() => setIsOpenDeposit(false)}
        defaultValue={'DEPOSIT'}
        lang={lang}
        locale={locale}
        data={userData}
      />
      <LoginModal open={isModalOpen} onClose={() => setIsModalOpen(false)} lang={lang} locale={locale} />
      <RegisterFormState lang={lang} locale={locale} open={isRegisterOpen} setOpen={setIsRegisterOpen} />
    </>
  )
}
