'use client'

import { GetData } from '@/@core/hooks/use-query'
import { UserMeResponse } from '@/@core/interface/User'
import { IconLogout } from '@/components/atoms/Icons'
import { Footer } from '@/components/molecules/Footer/footer'
import LocaleSwitcherDropdown from '@/components/molecules/LocaleSwitcher'
import { HeaderSkeleton } from '@/components/molecules/Skeleton/HeaderSkeleton'
import { useTelegramMiniApp } from '@/components/providers/TelegramMiniApp'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Locale } from '@/i18n-config'
import { resetLiveChatSession } from '@/lib/livechat-reset'
import { ConfigType } from '@/types/config'
import { LangProps } from '@/types/langProps'
import { useLiveChatContext } from '@/utils/context/LiveChatProvider'
import { getInitials } from '@/utils/helper/getInitials'
import { useHasMounted } from '@/utils/hooks/useHasMounted'
import { useThemeToggle } from '@/utils/hooks/useTheme'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FC, ReactNode, useEffect, useRef, useState } from 'react'
import { useCookies } from 'react-cookie'
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

const AdjustmentAppWrapper: FC<AppTemplateProps> = ({ children, lang, locale, config, features }) => {
  const { ready } = useLiveChatContext()
  const [, , removeCookie] = useCookies(['_authorization'])

  const buttonLogoutRef = useRef<HTMLButtonElement>(null)

  const showLiveChat = ready && !!features?.livechat
  const pathname = usePathname()

  const parts = pathname.split('/').filter(Boolean) // ["en", "sport"]
  const { data: session } = useSession()
  const { theme } = useThemeToggle()

  const logo = theme === 'dark' ? '/images/logo_light.webp' : '/images/logo_dark.webp'

  const [profileOpen, setProfileOpen] = useState(false)

  const { isTMA, isMiniAppLoaded, hideLoader } = useTelegramMiniApp()
  const isAllowRequest = isTMA ? isMiniAppLoaded : true

  const { data: userData, isLoading: userDataLoading } = GetData<UserMeResponse>(
    '/me', // hits your Next.js API route, not the real backend
    ['user', 'me'],
    false,
    undefined,
    isAllowRequest
  )
  const user = userData?.data
  // // const isMiniAppLoading = !isMiniAppLoaded || isLoading
  // const isAppLoading = isTMA ? !isMiniAppLoaded : isLoading

  const isLoading = !isMiniAppLoaded || userDataLoading
  const hasMounted = useHasMounted()

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (session?.user?.roles) {
      const maxAge = 7 * 24 * 60 * 60 // Convert days to seconds
      document.cookie = `user_roles=${session?.user?.roles}; path=/; max-age=${maxAge}; samesite=lax`
    }
  }, [session])

  useEffect(() => {
    if (!isLoading) hideLoader()
  }, [isLoading])

  const { closeApp } = useTelegramMiniApp()

  const handleLogout = async () => {
    try {
      // 1) Reset LiveChat identity/session
      resetLiveChatSession({ hardReload: false }) // set true if you prefer full page reload

      // Hapus manual token
      removeCookie('_authorization', { path: '/' })

      // Logout dari next-auth
      await signOut({ callbackUrl: `/${locale ?? 'en'}` })

      closeApp()
    } catch (error) {
      //console.error('[Logout Error]', error)
    }
  }

  return (
    <div className='min-h-screen bg-app-background-secondary text-app-text-color'>
      {/* Left Sidebar - fixed */}
      {/* <Sidebar lang={dict} locale={locale} /> */}

      {/* Main Content */}
      <div className='flex relative flex-col min-h-screen'>
        {/* Top Header */}
        <div className='sticky top-0 z-30 bg-app-background-secondary'>
          <header className='md:bg-app-background-primary flex lg:px-8 px-4 py-4 md:justify-end items-center lg:space-x-4 bg-app-background-secondary'>
            {isLoading ? (
              <HeaderSkeleton variant={'loggedIn'} />
            ) : (
              // ✅ Logged in
              <div className='w-full flex items-start md:justify-end gap-3'>
                <Link href={`/${locale}`} className='md:flex flex-shrink-0 h-full'>
                  <Image
                    src={logo}
                    alt='Site Logo'
                    width={100}
                    height={100}
                    priority
                    className='md:w-[40px] w-[40px] h-[30px] mt-2'
                  />
                </Link>

                <div className='w-full flex items-start justify-end md:gap-3 gap-1'>
                  {/* <div className='hidden md:flex'>
              <ThemeSwitcher />
            </div> */}
                  <div className='md:hidden flex items-center justify-center bg-app-primary hover:bg-app-primary-hover rounded-lg shadow-lg'>
                    <LocaleSwitcherDropdown lang={lang} />
                  </div>
                  <div className='hidden md:flex'>
                    <LocaleSwitcherDropdown lang={lang} />
                  </div>
                  <div className='flex'>
                    <Popover open={profileOpen} onOpenChange={setProfileOpen}>
                      <PopoverTrigger asChild>
                        <button className='w-10 h-10 hover:bg-app-bg-button-hover font-semibold rounded-lg flex items-center justify-center cursor-pointer'>
                          {session && getInitials(session?.user?.name)}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent
                        className='bg-app-background-secondary border-app-neutral300 border p-0 w-[250px]'
                        align='end'
                        side='bottom'
                      >
                        <div className='pb-3'>
                          <div className='flex justify-between items-center w-full'>
                            <div className='px-6 md:px-4 pt-4 pb-2 md:pb-0'>
                              <div className='flex flex-row items-center gap-2'>
                                <div className='flex font-semibold w-10 h-10 bg-app-primary rounded-[8px] justify-center items-center text-white'>
                                  {user?.username ? getInitials(user?.username) : ''}
                                </div>
                                <div className='flex flex-col max-w-[165px]'>
                                  {/* batasi lebar teks */}
                                  <div
                                    className='font-semibold text-sm capitalize text-app-text-color truncate'
                                    title={user?.username}
                                  >
                                    {user?.username}
                                  </div>
                                  <div
                                    className='font-semibold text-app-text-color text-sm truncate'
                                    title={user?.nickname || '-'}
                                  >
                                    {user?.nickname || '-'}
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* <div className='md:hidden mr-7'>
            <ThemeSwitcher />
          </div> */}
                          </div>

                          <hr className='my-3 border-app-divider-color' />

                          <div className='px-6 md:px-4 text-xs font-semibold text-app-neutral500 hover:text-app-text-color'>
                            <button
                              ref={buttonLogoutRef}
                              onClick={() => {
                                handleLogout()
                                setProfileOpen(false)
                              }}
                              className='h-10 cursor-pointer flex items-center gap-[7px]'
                            >
                              <IconLogout />
                              <span>{lang?.logout?.title}</span>
                            </button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            )}
          </header>
        </div>

        {/* Main Content Area */}
        <main className='flex-1 bg-app-background-primary'>
          <div className='min-h-screen'>{children}</div>
          <Footer lang={lang} theme={hasMounted ? theme : 'light'} content={config['footer_content']} />
        </main>
      </div>

      {/* Floating Help Button */}
      {/* {parts[1] !== 'sport' && (
        <div className={cn('fixed bottom-[87px] md:bottom-6 right-4 z-[50]', parts[1] === 'sport' && 'md:bottom-16')}>
          <div className='flex md:hidden items-center justify-center w-14 h-14 bg-app-primary hover:bg-app-primary-hover rounded-full shadow-lg'>
            <LocaleSwitcherDropdown lang={locale} />
          </div>
          {showLiveChat && <LiveChatButton user={userData} ready={ready} />}
        </div>
      )} */}
    </div>
  )
}

AdjustmentAppWrapper.displayName = 'AdjustmentAppWrapper'

export default AdjustmentAppWrapper
