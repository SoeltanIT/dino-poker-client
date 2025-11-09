'use client'

import { GetData } from '@/@core/hooks/use-query'
import { UseServerSendEvent } from '@/@core/hooks/UseServerSendEvent'
import { BalanceResponse } from '@/@core/interface/balance/Balance'
import { UserMeResponse } from '@/@core/interface/User'
import { LiveChatButton } from '@/components/atoms/Button/LiveChatButton'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/molecules/Footer/footer'
import LocaleSwitcherDropdown from '@/components/molecules/LocaleSwitcher'
import { Navbar } from '@/components/molecules/Navbar'
import { useTelegramMiniApp } from '@/components/providers/TelegramMiniApp'
import { Locale } from '@/i18n-config'
import { cn } from '@/lib/utils'
import { ConfigType } from '@/types/config'
import { LangProps } from '@/types/langProps'
import { TransferBalanceFeeResponseMapped } from '@/types/transferBalanceFeeDTO'
import { useLiveChatContext } from '@/utils/context/LiveChatProvider'
import { useAuth } from '@/utils/hooks/useAuth'
import { useHasMounted } from '@/utils/hooks/useHasMounted'
import { useThemeToggle } from '@/utils/hooks/useTheme'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { FC, ReactNode, useEffect } from 'react'
// types you can reuse across components
export type FeatureFlags = {
  sports: boolean
  promotion: boolean
  crypto: boolean
  livechat: boolean
  // add more toggles here in the future
}
interface AppTemplateProps {
  children?: ReactNode | string
  lang?: LangProps
  locale?: Locale
  config: ConfigType
  features: FeatureFlags
  // livechatId: string
}

const AppWrapper: FC<AppTemplateProps> = ({ children, lang, locale, config, features }) => {
  const { ready } = useLiveChatContext()
  const showLiveChat = ready && !!features?.livechat
  const pathname = usePathname()

  const parts = pathname.split('/').filter(Boolean) // ["en", "sport"]
  const session = useSession()
  const { theme } = useThemeToggle()

  const { isLoading: isSessionLoading } = useAuth()
  const { isTMA, isMiniAppLoaded, hideLoader } = useTelegramMiniApp()
  const isAllowRequest = isTMA ? isMiniAppLoaded : true

  const { data: userData, isLoading: userDataLoading } = GetData<UserMeResponse>(
    '/me', // hits your Next.js API route, not the real backend
    ['user', 'me'],
    false,
    undefined,
    isAllowRequest
  )
  const { balanceTrigger, balanceMessages } = UseServerSendEvent()
  const { data: respBalance, isLoading: balanceLoading } = GetData<BalanceResponse>(
    '/balance', // hits your Next.js API route, not the real backend
    ['getBalance', balanceTrigger], //trigger put here if need to refresh on SSE event,
    false,
    undefined,
    isAllowRequest
  )

  const { data: respTransferBalanceFee, isLoading: transferFeeLoading } = GetData<TransferBalanceFeeResponseMapped>(
    '/transfer_balance_fee', // hits your Next.js API route, not the real backend
    ['getTransferBalanceFee'],
    false,
    undefined,
    isAllowRequest,
    undefined,
    undefined,
    undefined,
    'GET', // method
    {},
    'transaction'
  )

  // // const isMiniAppLoading = !isMiniAppLoaded || isLoading
  // const isAppLoading = isTMA ? !isMiniAppLoaded : isLoading

  const isLoading = !isMiniAppLoaded || userDataLoading || balanceLoading || transferFeeLoading
  const hasMounted = useHasMounted()

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (session?.data?.user?.roles) {
      const maxAge = 7 * 24 * 60 * 60 // Convert days to seconds
      document.cookie = `user_roles=${session?.data?.user?.roles}; path=/; max-age=${maxAge}; samesite=lax`
    }
  }, [session])

  useEffect(() => {
    if (!isLoading) hideLoader()
  }, [isLoading])

  return (
    <div className='min-h-screen bg-app-background-secondary text-app-text-color'>
      {/* Left Sidebar - fixed */}
      {/* <Sidebar lang={dict} locale={locale} /> */}

      {/* Main Content */}
      <div className='flex relative flex-col min-h-screen'>
        {/* Top Header */}
        <div className='sticky top-0 z-30 bg-app-background-secondary'>
          <Header
            isLoading={isLoading}
            lang={lang}
            locale={locale}
            data={userData}
            balance={respBalance?.data}
            transferBalanceFee={respTransferBalanceFee?.data}
            theme={hasMounted ? theme : 'light'}
            features={features}
          />
        </div>

        {/* Main Content Area */}
        <main className='flex-1 bg-app-background-primary'>
          {children}
          <Footer lang={lang} theme={hasMounted ? theme : 'light'} content={config['footer_content']} />
        </main>
      </div>

      <Navbar
        locale={locale ?? 'en'}
        lang={lang}
        data={userData}
        isLogin={!!userData?.data && !isSessionLoading}
        features={features}
      />

      {/* Floating Help Button */}
      {parts[1] !== 'sport' && (
        <div className={cn('fixed bottom-[87px] md:bottom-6 right-4 z-[50]', parts[1] === 'sport' && 'md:bottom-16')}>
          <div className='flex md:hidden items-center justify-center w-14 h-14 bg-app-primary hover:bg-app-primary-hover rounded-full shadow-lg'>
            <LocaleSwitcherDropdown lang={locale} />
          </div>
          {showLiveChat && <LiveChatButton user={userData} ready={ready} />}
        </div>
      )}
    </div>
  )
}

AppWrapper.displayName = 'AppWrapper'

export default AppWrapper
