import { useQueryClient } from '@tanstack/react-query'
import { getSession, signIn, useSession } from 'next-auth/react'
import { createContext, type PropsWithChildren, useContext, useEffect, useState } from 'react'
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
  isMiniAppLoaded: boolean
  showAlert: (message: string) => Promise<void>
  closeApp: () => void
}>({
  isMiniAppLoaded: false,
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
  const [isMiniAppLoaded, setIsMiniAppLoaded] = useState(false)
  const { status } = useSession()
  const queryClient = useQueryClient()
  const isAuthenticated = status === 'authenticated'
  const [, setCookie] = useCookies(['_authorization'])

  const showAlert = (message: string) =>
    new Promise<void>(resolve => {
      window?.Telegram?.WebApp?.showAlert?.(message, () => {
        resolve()
      })
    })

  const closeApp = () => window?.Telegram?.WebApp?.close?.()

  useEffect(() => {
    if (!window.Telegram || isAuthenticated) return

    initTelegramMiniApp()
      .then(async () => {
        const session = await getSession()
        const token = session?.accessToken

        setIsMiniAppLoaded(true)

        if (token) {
          setCookie('_authorization', token, {
            path: '/',
            secure: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24
          })

          await queryClient.invalidateQueries({ queryKey: ['user', 'me'] })

          await queryClient.invalidateQueries({ queryKey: ['getBalance'] })
        }
      })
      .catch(err => {
        console.log(`[Telegram.MiniApp]:`, err)
      })
  }, [isAuthenticated, queryClient])

  return (
    <TelegramMiniAppContext.Provider value={{ isMiniAppLoaded, showAlert, closeApp }}>
      {children}
    </TelegramMiniAppContext.Provider>
  )
}
