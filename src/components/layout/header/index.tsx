'use client'

import { useAuth } from '@/utils/hooks/useAuth'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'

import { IconDP, IconHome, IconTicket, IconWD } from '@/components/atoms/Icons'
import LocaleSwitcherDropdown from '@/components/molecules/LocaleSwitcher'
import NotificationDropdown from '@/components/molecules/Notification'
import ThemeSwitcher from '@/components/molecules/ThemeSwitcher'
import MenuProfile from '@/components/organisms/Profile'
import { Button } from '@/components/ui/button'
import DepositWithdrawSheet from './views/transaction/DepositWithdrawSheet'

import { HeaderProps } from '@/@core/interface/home/HeaderProps'
import LoginModal from '@/components/organisms/Login'
import { cn } from '@/lib/utils'
import { UserFullDTO } from '@/types/userDTO'
import { getLinkPromotion } from '@/utils/linkFactory/linkFactory'
import { Eye, EyeOff, Volleyball } from 'lucide-react'
import { usePathname } from 'next/navigation'
import ProfilePopover from './views/menu/ProfilePopover'
import BalanceSheet from './views/myBalance/MyBalanceSheet'
import RegisterForm from './views/register/RegisterForm'

export const Header = ({ lang, locale, data, balance, theme }: HeaderProps) => {
  const pathname = usePathname()
  const logo = theme === 'dark' ? '/images/logo_light.png' : '/images/logo_dark.png'

  const { session, isAuthenticated, isLoading, likelyLoggedIn } = useAuth()
  const isLogin = isAuthenticated

  const buttonLogoutRef = useRef<HTMLButtonElement>(null)

  const [activeTab, setActiveTab] = useState<'DEPOSIT' | 'WITHDRAW'>('DEPOSIT')
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [showBalance, setShowBalance] = useState(true)

  return (
    <header className='md:bg-app-background-primary flex lg:px-8 px-4 py-4 md:justify-end items-center lg:space-x-4 bg-app-background-secondary'>
      {isLoading ? (
        // Show loading state that matches the header layout based on likely login state
        likelyLoggedIn ? (
          // Logged in user skeleton
          <div className='w-full flex items-center md:justify-end gap-3'>
            {/* Logo skeleton */}
            <div className='hidden md:flex flex-shrink-0'>
              <div className='md:w-[45px] md:h-[45px] w-[30px] h-[30px] bg-app-neutral300 rounded animate-pulse' />
            </div>

            <div className='w-full flex items-center justify-center md:justify-end gap-3'>
              {/* Balance skeleton */}
              <div className='flex w-full h-[40px] md:max-w-[190px] items-center space-x-2 bg-app-neutral300 rounded-full px-3 py-1 animate-pulse' />

              {/* Deposit button skeleton */}
              <div className='flex justify-center items-center min-h-10 h-10 min-w-10 w-10 p-2 bg-app-neutral300 rounded animate-pulse' />

              {/* Withdraw button skeleton */}
              <div className='flex justify-center items-center min-h-10 h-10 min-w-10 w-10 p-2 bg-app-neutral300 rounded animate-pulse' />

              <div className='bg-app-neutral300 h-4 w-1 lg:mx-4 mx-1' />

              {/* Notification skeleton */}
              <div className='min-w-10 min-h-10 bg-app-neutral300 rounded animate-pulse' />

              {/* Theme switcher skeleton */}
              <div className='min-w-10 min-h-10 bg-app-neutral300 rounded animate-pulse' />

              {/* Locale switcher skeleton */}
              <div className='hidden md:flex min-w-10 min-h-10 bg-app-neutral300 rounded animate-pulse' />

              {/* Profile skeleton */}
              <div className='hidden md:flex min-w-10 min-h-10 bg-app-neutral300 rounded animate-pulse' />
            </div>
          </div>
        ) : (
          // Guest user skeleton
          <div className='w-full flex flex-col'>
            {/* Desktop loading skeleton */}
            <div className='hidden lg:flex w-full flex-col gap-2'>
              <div className='flex flex-row justify-between items-center w-full'>
                {/* Logo skeleton */}
                <div className='flex-shrink-0'>
                  <div className='w-[50px] h-[50px] bg-app-neutral300 rounded animate-pulse' />
                </div>
                <div className='flex flex-col'>
                  <div className='flex flex-row justify-end items-center gap-4 w-full'>
                    {/* Login form skeleton */}
                    <div className='flex flex-row gap-4'>
                      <div className='w-20 h-10 bg-app-neutral300 rounded animate-pulse' />
                    </div>

                    {/* Register button skeleton */}
                    <div className='w-24 h-10 bg-app-neutral300 rounded animate-pulse' />

                    {/* Locale switcher skeleton */}
                    <div className='hidden md:flex w-10 h-10 bg-app-neutral300 rounded animate-pulse' />

                    {/* Theme switcher skeleton */}
                    <div className='w-10 h-10 bg-app-neutral300 rounded animate-pulse' />
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile loading skeleton */}
            <div className='flex lg:hidden flex-col'>
              <div className='flex justify-between items-center gap-3'>
                {/* Logo skeleton */}
                <div className='flex-shrink-0 mr-10'>
                  <div className='w-[40px] h-[40px] bg-app-neutral300 rounded animate-pulse' />
                </div>
                <div className='w-full h-10 bg-app-neutral300 rounded animate-pulse' />
                <div className='w-full h-10 bg-app-neutral300 rounded animate-pulse' />
              </div>
            </div>
          </div>
        )
      ) : isLogin ? (
        <div className='w-full flex items-center md:justify-end gap-3'>
          <Link href={`/${locale}`} className='hidden md:flex flex-shrink-0'>
            <Image
              src={logo}
              alt={'Site Logo Desktop'}
              width={100}
              height={100}
              priority
              className='md:w-[45px] md:h-[45px] w-[30px] h-[30px]'
            />
          </Link>

          <div className='hidden w-[40%] lg:w-[55%] md:flex gap-4 ml-[10px]'>
            <Link
              className={cn(
                'flex items-center justify-center cursor-pointer gap-2 p-3 group',
                pathname === `/${locale}` && 'border-b-[1px] border-b-app-text-color'
              )}
              href={`/${locale}`}
            >
              <IconHome
                className={cn(
                  pathname === `/${locale}`
                    ? 'text-app-text-color'
                    : 'text-app-neutral500 group-hover:text-app-text-color'
                )}
              />
              <span
                className={cn(
                  'uppercase font-bold text-sm',
                  pathname === `/${locale}`
                    ? 'text-app-text-color'
                    : 'text-app-neutral500 group-hover:text-app-text-color'
                )}
              >
                {lang?.common?.home}
              </span>
            </Link>

            {/* <Link
              className={cn(
                'flex items-center justify-center cursor-pointer gap-2 p-3 group',
                pathname === `/${locale}/sport` && 'border-b-[1px] border-b-app-text-color'
              )}
              href={{ pathname: `/${locale}/sport` }}
            >
              <Volleyball
                className={cn(
                  pathname === `/${locale}/sport`
                    ? 'text-app-text-color'
                    : 'text-app-neutral500 group-hover:text-app-text-color'
                )}
              />
              <span
                className={cn(
                  'uppercase font-bold text-sm',
                  pathname === `/${locale}/sport`
                    ? 'text-app-text-color'
                    : 'text-app-neutral500 group-hover:text-app-text-color'
                )}
              >
                {lang?.common?.sport}
              </span>
            </Link> */}

            {/* <Link
              className={cn(
                'flex items-center justify-center cursor-pointer gap-2 p-3 group',
                pathname === `/${locale}/promotion` && 'border-b-[1px] border-b-app-text-color'
              )}
              href={getLinkPromotion(locale)}
            >
              <IconTicket
                className={cn(
                  pathname === `/${locale}/promotion`
                    ? 'text-app-text-color'
                    : 'text-app-neutral500 group-hover:text-app-text-color'
                )}
              />

              <span
                className={cn(
                  'uppercase font-bold text-sm',
                  pathname === `/${locale}/promotion`
                    ? 'text-app-text-color'
                    : 'text-app-neutral500 group-hover:text-app-text-color'
                )}
              >
                {lang?.common?.promotion}
              </span>
            </Link> */}
          </div>

          <div className='w-full flex items-center justify-end gap-3'>
            <div className='flex w-full h-[40px] lg:max-w-[190px] justify-between items-center space-x-2 bg-app-bg-button hover:bg-app-bg-button-hover rounded-full px-3 py-1 transition-colors'>
              <BalanceSheet data={balance} lang={lang} locale={locale} onShow={showBalance} />
              <div onClick={() => setShowBalance(!showBalance)} className='cursor-pointer'>
                {showBalance ? (
                  <EyeOff className='h-4 w-4 md:h-5 md:w-5 text-app-text-color' />
                ) : (
                  <Eye className='h-4 w-4 md:h-5 md:w-5 text-app-text-color' />
                )}
              </div>
            </div>

            <button
              onClick={() => {
                setActiveTab('DEPOSIT')
                setIsSheetOpen(true)
              }}
              className={cn(
                'flex justify-center items-center min-h-10 h-10 min-w-10 w-10 p-2 bg-app-primary hover:bg-app-primary-hover rounded-lg transition-colors gap-1',
                locale === 'ko' ? 'lg:w-full lg:max-w-[100px]' : 'lg:w-full lg:max-w-[120px]'
              )}
            >
              <IconDP className='text-white' />
              <span className='hidden lg:flex text-white text-sm font-medium uppercase'>{lang?.common?.deposit}</span>
            </button>

            {/* Withdraw Button */}
            <button
              onClick={() => {
                setActiveTab('WITHDRAW')
                setIsSheetOpen(true)
              }}
              className={cn(
                'flex justify-center items-center min-h-10 h-10 min-w-10 w-10 p-2 bg-app-bg-button hover:bg-app-bg-button-hover rounded-lg transition-colors gap-1',
                locale === 'ko' ? 'lg:w-full lg:max-w-[100px]' : 'lg:w-full lg:max-w-[120px]'
              )}
            >
              <IconWD />
              <span className='hidden lg:flex text-app-text-color text-sm font-medium uppercase'>
                {lang?.common?.withdraw}
              </span>
            </button>

            <div className='hidden md:flex bg-app-divider-color h-4 w-1 mx-1' />
            <NotificationDropdown lang={lang} isLogin={!!data} />
            <ThemeSwitcher />
            <div className='hidden md:flex'>
              <LocaleSwitcherDropdown lang={lang} />
            </div>

            <div className='hidden md:flex'>
              <ProfilePopover>
                {({ onClose }) => (
                  <MenuProfile
                    locale={locale}
                    lang={lang}
                    data={data?.data as UserFullDTO}
                    onClose={onClose}
                    buttonLogoutRef={buttonLogoutRef}
                  />
                )}
              </ProfilePopover>
            </div>
          </div>
        </div>
      ) : (
        // 💡 bagian login desktop/mobile
        <div className='w-full flex flex-col'>
          {/* Desktop login form */}
          <div className='hidden lg:flex w-full items-center flex-col gap-2'>
            <div className='flex flex-row justify-between items-center w-full'>
              <Link href={`/${locale}`} className='flex-shrink-0'>
                <Image
                  src={logo}
                  alt={'Site Logo Desktop'}
                  priority
                  width={100}
                  height={100}
                  className='w-[50px] h-[50px]'
                />
              </Link>

              <div className='hidden w-full md:flex gap-4'>
                <Link
                  className={cn(
                    'ml-[42px] flex items-center justify-center cursor-pointer gap-2 p-3',
                    pathname === `/${locale}` && 'border-b-[1px] border-b-app-text-color'
                  )}
                  href={`/${locale}`}
                >
                  <IconHome className={cn(pathname === `/${locale}` ? 'text-app-text-color' : 'text-app-neutral500')} />
                  <span
                    className={cn(
                      'uppercase font-bold text-sm',
                      pathname === `/${locale}` ? 'text-app-text-color' : 'text-app-neutral500'
                    )}
                  >
                    {lang?.common?.home}
                  </span>
                </Link>

                {/* <Link
                  className={cn(
                    'flex items-center justify-center cursor-pointer gap-2 p-3',
                    pathname === `/${locale}/sport` && 'border-b-[1px] border-b-app-text-color'
                  )}
                  href={`/${locale}/sport`}
                >
                  <Volleyball
                    className={cn(pathname === `/${locale}/sport` ? 'text-app-text-color' : 'text-app-neutral500')}
                  />
                  <span
                    className={cn(
                      'uppercase font-bold text-sm',
                      pathname === `/${locale}/sport` ? 'text-app-text-color' : 'text-app-neutral500'
                    )}
                  >
                    {lang?.common?.sport}
                  </span>
                </Link> */}

                {/* <Link
                  className={cn(
                    'flex items-center justify-center cursor-pointer gap-2 p-3',
                    pathname === `/${locale}/promotion` && 'border-b-[1px] border-b-app-text-color'
                  )}
                  href={getLinkPromotion(locale)}
                >
                  <IconTicket
                    className={cn(pathname === `/${locale}/promotion` ? 'text-app-text-color' : 'text-app-neutral500')}
                  />

                  <span
                    className={cn(
                      'uppercase font-bold text-sm',
                      pathname === `/${locale}/promotion` ? 'text-app-text-color' : 'text-app-neutral500'
                    )}
                  >
                    {lang?.common?.promotion}
                  </span>
                </Link> */}
              </div>

              <div className='flex flex-col'>
                <div className='flex flex-row justify-end items-center gap-4 w-full'>
                  <Button
                    variant='default'
                    onClick={() => setIsModalOpen(true)}
                    className='bg-app-primary text-white hover:bg-app-primary-hover h-10 px-6 uppercase'
                  >
                    {lang?.common?.login}
                  </Button>
                  <RegisterForm lang={lang} locale={locale} />
                  <div className='hidden md:flex'>
                    <LocaleSwitcherDropdown lang={lang} />
                  </div>
                  <ThemeSwitcher />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile login form */}
          <div className='flex lg:hidden flex-col gap-3'>
            <div className='flex justify-between items-center'>
              <Link href={`/${locale}`} className='flex-shrink-0'>
                <Image
                  src={logo}
                  alt={'Site Logo Mobile'}
                  priority
                  width={100}
                  height={100}
                  className='w-[40px] h-[40px]'
                />
              </Link>
              <div className='flex items-center gap-4'>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  variant='default'
                  className='bg-app-primary text-white hover:bg-app-primary-hover h-10 px-6 uppercase'
                >
                  {lang?.common?.login}
                </Button>
                <RegisterForm lang={lang} locale={locale} />
                <ThemeSwitcher />
                <div className='hidden md:flex'>
                  <LocaleSwitcherDropdown lang={lang} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Global Sheet Modal */}
      {activeTab && (
        <DepositWithdrawSheet
          open={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          defaultValue={activeTab}
          lang={lang}
          locale={locale}
          data={data}
        />
      )}

      <LoginModal open={isModalOpen} onClose={() => setIsModalOpen(false)} lang={lang} locale={locale} />
    </header>
  )
}
