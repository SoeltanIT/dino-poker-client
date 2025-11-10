'use client'

import { useAuth } from '@/utils/hooks/useAuth'
import { Eye, EyeOff, PlusIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef, useState } from 'react'

import { IconKoreanWon, IconSize } from '@/components/atoms/Icons'
import LocaleSwitcherDropdown from '@/components/molecules/LocaleSwitcher'
import NotificationDropdown from '@/components/molecules/Notification'
import LoginModal from '@/components/organisms/Login'
import MenuProfile from '@/components/organisms/Profile'
import { Button } from '@/components/ui/button'
import ProfilePopover from './views/menu/ProfilePopover'
import HeaderBalance from './views/myBalance/HeaderBalance'
import RegisterForm from './views/register/RegisterForm'

import type { HeaderProps } from '@/@core/interface/home/HeaderProps'
import { MainNavTabs } from '@/components/molecules/MainNavTabs'
import { HeaderSkeleton } from '@/components/molecules/Skeleton/HeaderSkeleton'
import { BalanceDTO } from '@/types/balanceDTO'
import { UserFullDTO } from '@/types/userDTO'
import { thousandSeparatorComma } from '@/utils/helper/formatNumber'
import { HeaderSheet } from './views/transaction'

export const Header = ({
  lang,
  locale,
  data,
  balance,
  theme,
  transferBalanceFee,
  features,
  isLoading
}: HeaderProps) => {
  const pathname = usePathname()
  const logo = theme === 'dark' ? '/images/logo_light.webp' : '/images/logo_dark.webp'
  const { isAuthenticated, likelyLoggedIn } = useAuth()

  const isLogin = isAuthenticated
  const buttonLogoutRef = useRef<HTMLButtonElement>(null)

  const [activeTab, setActiveTab] = useState<'DEPOSIT' | 'WITHDRAW' | 'CONVERT_BALANCE'>('CONVERT_BALANCE')
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showBalance, setShowBalance] = useState(true)

  const rateValue = Number(transferBalanceFee?.rate?.rate ?? 0) * 1000 || 11000
  const formattedRate = thousandSeparatorComma(rateValue)

  return (
    <header className='md:bg-app-background-primary flex lg:px-8 px-4 py-4 md:justify-end items-center lg:space-x-4 bg-app-background-secondary'>
      {isLoading ? (
        <HeaderSkeleton variant={likelyLoggedIn ? 'loggedIn' : 'guest'} />
      ) : isLogin ? (
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

          <MainNavTabs
            locale={locale}
            pathname={pathname}
            lang={lang}
            features={features}
            className='hidden md:flex gap-4 ml-[15px] w-full'
          />

          <div className='w-full flex items-start justify-end md:gap-3 gap-1'>
            <div className='flex flex-col items-center w-full max-w-[190px]'>
              <div className='flex w-full h-[44px] justify-between items-center bg-app-bg-button hover:bg-app-bg-button-hover rounded-full px-3 py-[6px]'>
                <HeaderBalance
                  dataFee={transferBalanceFee}
                  data={balance as BalanceDTO}
                  lang={lang}
                  locale={locale}
                  onShow={showBalance}
                />
                <div onClick={() => setShowBalance(!showBalance)} className='cursor-pointer'>
                  {showBalance ? (
                    <EyeOff className='h-4 w-4 md:h-5 md:w-5 text-app-text-color' />
                  ) : (
                    <Eye className='h-4 w-4 md:h-5 md:w-5 text-app-text-color' />
                  )}
                </div>
              </div>

              <div className='mt-1 w-full flex items-center justify-center gap-1 rounded-full border border-app-border-chips px-2 py-[2.5px] text-[10px] font-medium text-app-warning'>
                <IconKoreanWon size={IconSize.sm} className='text-app-warning' />
                <span>
                  {transferBalanceFee?.rate?.currency ?? 'KRW'} 1,000 = {formattedRate} {lang?.common?.chips}
                </span>
              </div>
            </div>

            <Button
              onClick={() => {
                setActiveTab('CONVERT_BALANCE')
                setIsSheetOpen(true)
              }}
              className='bg-app-primary hover:bg-app-primary-hover h-10 min-w-10 px-2 lg:px-4 text-white uppercase rounded-[10px]'
            >
              <PlusIcon className='text-white' />
              <span className='hidden lg:flex text-white text-sm font-medium uppercase'>{lang?.common?.deposit}</span>
            </Button>

            <div className='hidden md:flex bg-app-divider-color h-10 w-0.5 mx-1' />
            <div className='hidden md:flex'>
              <NotificationDropdown lang={lang} isLogin={!!data} />
            </div>
            {/* <div className='hidden md:flex'>
              <ThemeSwitcher />
            </div> */}
            <div className='md:hidden flex items-center justify-center bg-app-primary hover:bg-app-primary-hover rounded-lg shadow-lg'>
              <LocaleSwitcherDropdown lang={lang} />
            </div>
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
                    features={features}
                  />
                )}
              </ProfilePopover>
            </div>
          </div>
        </div>
      ) : (
        // ❌ Guest
        <div className='w-full flex flex-col'>
          <div className='hidden lg:flex w-full items-center flex-col gap-2'>
            <div className='flex justify-between items-center w-full'>
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

              <MainNavTabs
                locale={locale}
                pathname={pathname}
                lang={lang}
                features={features}
                className='hidden w-full md:flex gap-4 ml-[42px]'
              />

              <div className='flex items-center gap-4'>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className='bg-app-primary text-white hover:bg-app-primary-hover h-10 px-6 uppercase'
                >
                  {lang?.common?.login}
                </Button>
                <RegisterForm lang={lang} locale={locale} />

                <div className='hidden md:flex bg-app-divider-color h-10 w-0.5 mx-1' />

                <div className='md:hidden flex items-center justify-center bg-app-primary hover:bg-app-primary-hover rounded-lg shadow-lg'>
                  <LocaleSwitcherDropdown lang={lang} />
                </div>
                <div className='hidden md:flex'>
                  <LocaleSwitcherDropdown lang={lang} />
                </div>
                {/* <ThemeSwitcher /> */}
              </div>
            </div>
          </div>

          {/* Mobile */}
          <div className='flex lg:hidden justify-between items-center'>
            <Link href={`/${locale}`}>
              <Image src={logo} alt='Site Logo' width={100} height={100} priority className='w-[45px] h-[30px]' />
            </Link>
            <div className='flex items-center gap-4'>
              <Button
                onClick={() => setIsModalOpen(true)}
                className='bg-app-primary text-white hover:bg-app-primary-hover h-10 px-6 uppercase'
              >
                {lang?.common?.login}
              </Button>
              <RegisterForm lang={lang} locale={locale} />
              {/* <ThemeSwitcher /> */}
              <div className='md:hidden flex items-center justify-center bg-app-primary hover:bg-app-primary-hover rounded-lg shadow-lg'>
                <LocaleSwitcherDropdown lang={lang} />
              </div>
              <div className='hidden md:flex'>
                <LocaleSwitcherDropdown lang={lang} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sheet & Login Modal */}
      {activeTab && (
        <HeaderSheet
          open={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          defaultValue={activeTab}
          lang={lang}
          locale={locale}
          data={data}
          features={features}
          balance={balance}
          dataFee={transferBalanceFee}
        />
      )}
      <LoginModal open={isModalOpen} onClose={() => setIsModalOpen(false)} lang={lang} locale={locale} />
    </header>
  )
}
