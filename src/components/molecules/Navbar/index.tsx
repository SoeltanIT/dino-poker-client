'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef, useState } from 'react'

import {
  IconBell,
  IconBetby,
  IconHome,
  IconMenu,
  IconPoker,
  IconSport,
  IconTicket,
  IconUser
} from '@/components/atoms/Icons'
import LoginModal from '@/components/organisms/Login'
import { MaintenanceModal } from '@/components/organisms/MaintenanceModal'
import MenuProfile from '@/components/organisms/Profile'
import { LogoutModal } from '@/components/organisms/Profile/Logout'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { resetLiveChatSession } from '@/lib/livechat-reset'
import { UserFullDTO } from '@/types/userDTO'
import { useLiveChatContext } from '@/utils/context/LiveChatProvider'
import { BookIcon } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { useCookies } from 'react-cookie'
import GlobalSheet from '../GlobalSheet'
import { NavbarProps } from './types'

type NavItem = {
  name: string
  href: string
  icon: React.ComponentType<any>
  onClick?: () => void
}

export const Navbar = ({ locale, lang, isLogin, data, features }: NavbarProps) => {
  const pathname = usePathname()
  const [isOpenLogout, setIsOpenLogout] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const buttonLogoutRef = useRef<HTMLButtonElement>(null)
  const { status } = useSession()

  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false)

  const menuItems: NavItem[] = [
    {
      name: lang?.header?.poker,
      href: `/${locale}`,
      icon: IconPoker
    },
    // TODO: uncomment this if casino link is available
    // {
    //   name: lang?.header?.casino,
    //   href: `/${locale}`,
    //   icon: IconCasino
    // },
    ...(features?.sports
      ? [
          {
            name: lang?.common?.sport,
            href: `/${locale}/sport`,
            icon: IconSport
          }
        ]
      : []),
    ...(features?.promotion
      ? [
          {
            name: lang?.common?.promotion,
            href: `/${locale}/promotion`,
            icon: IconTicket
          }
        ]
      : []),
    {
      name: lang?.common?.userGuide,
      href: `/${locale}/user-guide/poker/texas-poker`,
      icon: BookIcon
    }
  ]

  const navItems: NavItem[] = [
    {
      name: lang?.common?.home,
      href: `/${locale}`,
      icon: IconHome
    },
    // {
    //   name: lang?.common?.sport,
    //   href: `/${locale}/sport`,
    //   icon: Volleyball
    // },
    // {
    //   name: lang?.common?.promotion,
    //   href: `/${locale}/promotion`,
    //   icon: IconTicket
    // },
    {
      name: lang?.header?.notif,
      href: `/${locale}/notification`,
      icon: IconBell
    },
    {
      name: lang?.common?.profile,
      href: '',
      icon: IconUser
    }
  ]

  if (features?.promotion) {
    let navbarSport = features?.sports ? 1 : 2
    navItems.splice(navbarSport, 0, {
      name: lang?.common?.promotion,
      href: `/${locale}/promotion`,
      icon: IconTicket
      // onClick: () => setIsMaintenanceModalOpen(true)
    })
  }

  if (features?.sports) {
    navItems.splice(2, 0, {
      name: lang?.common?.sport,
      href: `/${locale}/sport`,
      icon: IconBetby,
      onClick: () => setIsMaintenanceModalOpen(true)
    })
  }

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
      <nav className='fixed md:hidden bottom-0 left-0 right-0 bg-app-background-secondary text-app-text-color h-[60px] flex justify-center items-center border-t border-app-background-primary z-20'>
        <div className='flex justify-around w-full max-w-[375px] px-6'>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <button className='flex items-center justify-center focus:outline-none w-8 h-8'>
                <IconMenu className='text-app-primary200 w-full h-full' />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align='start'
              side='top'
              className='bg-app-background-secondary w-[90vw] border-app-primary2 px-0 py-2 rounded-xl z-[9999] -ml-2 mr-4'
              sideOffset={10}
            >
              {menuItems.map(({ href, name, icon: Icon }) => (
                <DropdownMenuItem key={name} asChild>
                  <Link
                    href={href}
                    className='flex text-app-text-color items-center gap-1 px-4 py-1 h-8 focus:bg-app-background-primary focus:text-app-text-color focus:font-bold'
                  >
                    <Icon className='text-app-neutral500' />
                    <span className='text-[12px] uppercase text-app-neutral500'>{name}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {navItems
            // 🧠 Filter out Notification item if no data
            .filter(item => {
              if (item.name === lang?.header?.notif && !data) return false
              return true
            })
            .map(item => {
              const isActive = pathname === item.href
              const Icon = item.icon

              if (item.name === lang?.common?.profile && data && status !== 'loading') {
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
                        onClose={onClose}
                        buttonLogoutRef={buttonLogoutRef}
                        features={features}
                      />
                    )}
                  </GlobalSheet>
                )
              }

              if (item.name === lang?.common?.profile && status !== 'authenticated' && status !== 'loading') {
                return (
                  <div key={item.name}>
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

              // ✅ Default link for others
              return (
                <Link
                  key={item.name}
                  href={!item.onClick ? item.href : ''}
                  className='flex flex-col items-center gap-1'
                  onClick={item.onClick}
                >
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

      <MaintenanceModal
        label={lang?.common?.preparingToOpen}
        open={isMaintenanceModalOpen}
        onOpenChange={setIsMaintenanceModalOpen}
      />
    </>
  )
}
