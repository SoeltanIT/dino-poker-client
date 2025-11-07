'use client'
import { cn } from '@/lib/utils'
import { useThemeToggle } from '@/utils/hooks/useTheme'
import { isTMA as _isTMA, openLink as _openLink, OpenLinkBrowser } from '@tma.js/sdk'
import { getSession, signIn } from 'next-auth/react'
import Image from 'next/image'
import Script from 'next/script'
import { createContext, type PropsWithChildren, useContext, useState } from 'react'
import { useCookies } from 'react-cookie'

async function initTelegramMiniApp() {
  const webApp = window.Telegram.WebApp
  const initData = webApp.initData
  const { user, auth_date, hash } = webApp.initDataUnsafe
  if (!user) return

  try {
    const telegramData = {
      type: 'miniapp',
      ...user,
      auth_date: +auth_date,
      init_data: initData,
      hash
    }

    const response = await signIn('telegram', {
      redirect: false,
      telegramData: JSON.stringify(telegramData)
    })

    if (response?.error && !response?.ok) {
      throw new Error('Telegram login failed', {
        cause: { response }
      })
    }

    return response
  } catch (error) {
    throw error
  }
}

const TelegramMiniAppContext = createContext<{
  isTMA: boolean
  isMiniAppLoaded: boolean
  openLink: (url: string, browser?: OpenLinkBrowser) => void
  hideLoader: () => void
  showAlert: (message: string) => Promise<void>
  closeApp: () => void
}>({
  isTMA: false,
  isMiniAppLoaded: false,
  openLink: () => null,
  hideLoader: () => null,
  showAlert: async () => {},
  closeApp: () => null
})

export function useTelegramMiniApp() {
  const context = useContext(TelegramMiniAppContext)
  if (!context) {
    throw new Error('`useTelegramMiniApp` must be used within a `TelegramMiniAppContext`')
  }

  return context
}

export function TelegramMiniAppProvider({ children }: PropsWithChildren) {
  const { theme } = useThemeToggle()
  const [isMiniAppLoaded, setIsMiniAppLoaded] = useState(false)
  const [showLoader, setIsShowLoader] = useState(true)
  const [, setCookie] = useCookies(['_authorization'])
  const isTMA = _isTMA()

  const showAlert = (message: string) =>
    new Promise<void>(resolve => {
      window?.Telegram?.WebApp?.showAlert?.(message, () => {
        resolve()
      })
    })

  const closeApp = () => window?.Telegram?.WebApp?.close?.()

  const hideLoader = () => setIsShowLoader(false)

  const openLink = (url: string, browser?: OpenLinkBrowser) =>
    _openLink(url, {
      tryBrowser: browser
    })

  const handleLoadScript = () => {
    if (!_isTMA()) {
      setIsMiniAppLoaded(true)
      return
    }

    initTelegramMiniApp().then(async () => {
      const session = await getSession()
      const token = session?.accessToken

      if (token) {
        setCookie('_authorization', token, {
          path: '/',
          secure: true,
          sameSite: 'lax',
          maxAge: 60 * 60 * 24
        })
      }

      setIsMiniAppLoaded(true)
    })
  }

  return (
    <>
      <Script src='https://telegram.org/js/telegram-web-app.js?59' onLoad={handleLoadScript} />

      <TelegramMiniAppContext.Provider value={{ isTMA, isMiniAppLoaded, showAlert, closeApp, hideLoader, openLink }}>
        {_isTMA() && (
          <div
            className={cn(
              'fixed top-0 left-0 size-full z-[9999] bg-opacity-30 transition-all',
              theme === 'dark' ? 'bg-black' : 'bg-white',
              !showLoader && 'opacity-0 bg-opacity-0 pointer-events-none size-0'
            )}
          >
            <div className='size-full flex items-center justify-center'>
              <Image
                src={theme === 'dark' ? '/images/loader_white.gif' : '/images/loader_black.gif'}
                alt={'Logo'}
                priority
                width={150}
                height={150}
                className='w-1/3'
              />
            </div>
          </div>
        )}
        {children}
      </TelegramMiniAppContext.Provider>
    </>
  )
}
