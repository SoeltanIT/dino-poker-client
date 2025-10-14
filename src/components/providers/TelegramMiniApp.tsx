import { signIn } from 'next-auth/react'
import { createContext, type PropsWithChildren, useContext, useEffect } from 'react'

async function initTelegramMiniApp() {
  const webApp = window.Telegram.WebApp
  const initData = webApp.initData
  const { user, auth_date, hash } = webApp.initDataUnsafe
  if (!user) return

  try {
    const telegramData = {
      type: 'miniapp',
      ...user,
      auth_date,
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

    console.log('testing')
    window.location.reload()
    return response
  } catch (error) {
    return error
  }
}

const TelegramMiniAppContext = createContext<{
  showAlert?: (message: string) => Promise<void>
}>({})

export function useTelegramMiniApp() {
  const context = useContext(TelegramMiniAppContext)
  if (!context) {
    throw new Error('`useTelegramMiniApp` must be used within a `TelegramMiniAppContext`')
  }

  return context
}

export function TelegramMiniAppProvider({ children }: PropsWithChildren) {
  const showAlert = (message: string) =>
    new Promise<void>(resolve => {
      window?.Telegram?.WebApp?.showAlert?.(message, () => {
        resolve()
      })
    })

  useEffect(() => {
    if (!window.Telegram) return
    initTelegramMiniApp().catch(err => {
      console.log(`[Telegram.MiniApp]:`, err)
    })
  }, [])

  return <TelegramMiniAppContext.Provider value={{ showAlert }}>{children}</TelegramMiniAppContext.Provider>
}
