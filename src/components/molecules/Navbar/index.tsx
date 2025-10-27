'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef, useState } from 'react'

import { IconBell, IconHome, IconUser } from '@/components/atoms/Icons'
import LoginModal from '@/components/organisms/Login'
import MenuProfile from '@/components/organisms/Profile'
import { LogoutModal } from '@/components/organisms/Profile/Logout'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { resetLiveChatSession } from '@/lib/livechat-reset'
import { UserFullDTO } from '@/types/userDTO'
import { useLiveChatContext } from '@/utils/context/LiveChatProvider'
import { Volleyball } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useCookies } from 'react-cookie'
import GlobalSheet from '../GlobalSheet'
import { NavbarProps } from './types'

export const Navbar = ({ locale, lang, isLogin, data }: NavbarProps) => {
  const pathname = usePathname()
  const [isOpenLogout, setIsOpenLogout] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const buttonLogoutRef = useRef<HTMLButtonElement>(null)

  const navItems = [
    {
      name: lang?.common?.home,
      href: `/${locale}`,
      icon: IconHome
    },
    {
      name: lang?.header?.notif,
      href: `/${locale}/notification`,
      icon: IconBell
    },
    {
      name: lang?.common?.sport,
      href: `/${locale}/sport`,
      icon: Volleyball
    },
    // {
    //   name: lang?.common?.promotion,
    //   href: `/${locale}/promotion`,
    //   icon: IconTicket
    // },
    {
      name: lang?.common?.profile,
      href: '',
      icon: IconUser
    }
  ]

  const { ready } = useLiveChatContext()

  const [, , removeCookie] = useCookies(['_authorization'])

  const handleSessionLiveChat = () => {
    console.log('[LiveChat] handleSessionLiveChat called.')

    if (!ready) {
      console.warn('[LiveChat] Widget is not ready yet. Aborting...')
      return
    }

    const widget = window.LiveChatWidget

    if (!widget || typeof widget.call !== 'function') {
      console.error('[LiveChat] LiveChatWidget is not available or malformed.')
      return
    }

    widget.call('logout')
  }

  const handleLogout = async () => {
    try {
      // 1) Reset LiveChat identity/session
      resetLiveChatSession({ hardReload: false }) // set true if you prefer full page reload
      handleSessionLiveChat()
      // Hapus manual token
      removeCookie('_authorization', { path: '/' })

      // Logout dari next-auth
      await signOut({ callbackUrl: `/${locale ?? 'en'}` })
    } catch (error) {}
  }

  return (
    <>
      <nav className='fixed md:hidden bottom-0 left-0 right-0 bg-app-background-secondary text-app-text-color h-[80px] flex justify-center items-center border-t border-app-background-primary z-20'>
        <div className='flex justify-around w-full max-w-[375px] px-6'>
          {navItems?.map(item => {
            const isActive = pathname === item.href
            const Icon = item.icon

            if (item.name === lang?.common?.profile && data) {
              return (
                <GlobalSheet
                  key={item.name}
                  trigger={
                    <button className='flex flex-col items-center gap-1 focus:outline-none'>
                      <Icon className='text-app-neutral500 h-7 w-7' />
                      <span className='text-[12px] uppercase text-app-neutral500'>{item.name}</span>
                    </button>
                  }
                  className='[&>button.absolute]:hidden !py-2'
                >
                  {({ onClose }) => (
                    <MenuProfile
                      data={data?.data as UserFullDTO}
                      locale={locale}
                      lang={lang}
                      onClose={onClose} // ✅ menutup Sheet saat menu dipencet
                      // setIsOpenLogout={() => setIsOpenLogout(true)}
                      buttonLogoutRef={buttonLogoutRef}
                    />
                  )}
                </GlobalSheet>
              )
            } else if (item.name === lang?.common?.profile && !data) {
              return (
                <div className='' key={item.name}>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className='flex flex-col items-center gap-1 focus:outline-none'
                  >
                    <Icon className='text-app-neutral500 h-7 w-7' />
                    <span className='text-[12px] uppercase text-app-neutral500'>{item.name}</span>
                  </button>
                </div>
              )
            }

            return (
              <Link key={item.name} href={item.href} className='flex flex-col items-center gap-1'>
                <Icon className={clsx('h-7 w-7', isActive ? 'text-app-text-color' : 'text-app-neutral500')} />
                <span
                  className={clsx(
                    'text-[12px] uppercase',
                    isActive ? 'text-app-text-color font-bold' : 'text-app-neutral500'
                  )}
                >
                  {item.name}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Logout Modal */}
      <Dialog open={isOpenLogout} onOpenChange={setIsOpenLogout}>
        <DialogContent className='bg-transparent border-none p-0 max-w-[90%] sm:max-w-md [&>button.absolute]:hidden'>
          <LogoutModal
            lang={lang}
            onClose={() => setIsOpenLogout(false)}
            onConfirm={() => {
              handleLogout()
            }}
          />
        </DialogContent>
      </Dialog>

      <LoginModal open={isModalOpen} onClose={() => setIsModalOpen(false)} lang={lang} locale={locale} />
    </>
  )
}
