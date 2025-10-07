'use client'

import { GetData } from '@/@core/hooks/use-query'
import { BalanceResponse } from '@/@core/interface/balance/Balance'
import { UserMeResponse } from '@/@core/interface/User'
import { LiveChatButton } from '@/components/atoms/Button/LiveChatButton'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/molecules/Footer/footer'
import LocaleSwitcherDropdown from '@/components/molecules/LocaleSwitcher'
import { Navbar } from '@/components/molecules/Navbar'
import { Locale } from '@/i18n-config'
import { cn } from '@/lib/utils'
import { ConfigType } from '@/types/config'
import { LangProps } from '@/types/langProps'
import { useLiveChatContext } from '@/utils/context/LiveChatProvider'
import { useAuth } from '@/utils/hooks/useAuth'
import { useHasMounted } from '@/utils/hooks/useHasMounted'
import { useThemeToggle } from '@/utils/hooks/useTheme'
import { usePathname } from 'next/navigation'
import { FC, ReactNode } from 'react'

interface AppTemplateProps {
  children?: ReactNode | string
  lang?: LangProps
  locale?: Locale
  config: ConfigType
  // livechatId: string
}

const AppWrapper: FC<AppTemplateProps> = ({ children, lang, locale, config }) => {
  const { ready } = useLiveChatContext()
  const pathname = usePathname()

  const parts = pathname.split('/').filter(Boolean) // ["en", "sport"]

  const { theme } = useThemeToggle()

  const { isLoading: isSessionLoading } = useAuth()

  const { data: userData, isLoading: userDataLoading } = GetData<UserMeResponse>(
    '/me', // hits your Next.js API route, not the real backend
    ['user', 'me']
  )
  // const { trigger } = UseServerSendEvent()
  const { data: respBalance, isLoading: balanceLoading } = GetData<BalanceResponse>(
    '/balance', // hits your Next.js API route, not the real backend
    ['getBalance'] //trigger put here if need to refresh on SSE event
  )
  const hasMounted = useHasMounted()

  return (
    <div className='min-h-screen bg-app-background-primary text-app-text-color'>
      {/* Left Sidebar - fixed */}
      {/* <Sidebar lang={dict} locale={locale} /> */}

      {/* Main Content */}
      <div className='flex relative flex-col min-h-screen'>
        {/* Top Header */}
        <div className='sticky top-0 z-30 bg-app-background-secondary'>
          <Header
            lang={lang}
            locale={locale}
            data={userData}
            balance={respBalance?.data}
            theme={hasMounted ? theme : 'light'}
          />
        </div>

        {/* Main Content Area */}
        <main className='flex-1 bg-app-background-primary'>
          {children}
          <Footer lang={lang} theme={hasMounted ? theme : 'light'} content={config['footer_content']} />
        </main>
      </div>

      <Navbar locale={locale ?? 'en'} lang={lang} data={userData} isLogin={!!userData?.data && !isSessionLoading} />

      {/* Floating Help Button */}
      {parts[1] !== 'sport' && (
        <div className={cn('fixed bottom-[70px] md:bottom-6 right-4 z-[50]', parts[1] === 'sport' && 'md:bottom-16')}>
          <div className='flex md:hidden items-center justify-center w-14 h-14 bg-app-primary hover:bg-app-primary-hover rounded-full shadow-lg'>
            <LocaleSwitcherDropdown lang={locale} />
          </div>
          {ready && <LiveChatButton user={userData} ready={ready} />}
        </div>
      )}
    </div>
  )
}

AppWrapper.displayName = 'AppWrapper'

export default AppWrapper
