'use client'

import IconDiscord from '@/components/atoms/Icons/Discord'
import MenuProfile from '@/components/organisms/Profile'
import { LogoutModal } from '@/components/organisms/Profile/Logout'
import { getInitials } from '@/utils/helper/getInitials'
import { useHasMounted } from '@/utils/hooks/useHasMounted'
import { useThemeToggle } from '@/utils/hooks/useTheme'
import { Moon, Sun } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef, useState } from 'react'
import { ModalFloating } from '../ModalFloating'
import { SidebarProps } from './types'

export const Sidebar = ({ children, lang, locale, ...props }: SidebarProps) => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const [isOpenLogout, setIsOpenLogout] = useState(false)
  const buttonLogoutRef = useRef<HTMLButtonElement>(null)

  const { data: session } = useSession()
  const isLogin = !!session?.user

  const hasMounted = useHasMounted()
  const { theme, toggleTheme } = useThemeToggle()

  if (!hasMounted) return null // inside Sidebar component

  return (
    <>
      <div className='hidden md:flex fixed top-0 left-0 h-screen w-20 bg-app-background-secondary flex-col items-center justify-between z-50'>
        {/* Top - Logo */}
        <div className='mt-4'>
          <Link href={`/${locale}`} className='mb-8 block'>
            <Image
              src='/images/logo_mobile.png'
              alt={`Site Logo Sidebar`}
              width={500}
              height={500}
              className='w-full md:w-10 h-full md:h-10 object-cover object-center'
            />
          </Link>
        </div>

        {/* Middle - Navigation */}
        {/* <div className="flex flex-col items-center space-y-6">
          <Link
            className={clsx(
              "w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer",
              pathname === `/${locale}`
                ? "bg-app-primary"
                : "bg-app-background-secondary hover:bg-app-neutral300"
            )}
            href={`/${locale}`}
          >
            <IconHome
              className={clsx(
                pathname === `/${locale}` ? "text-app-text-color" : "text-app-neutral500"
              )}
            />
          </Link>
        </div> */}

        {/* Bottom - Theme, Profile, Discord, Version */}
        <div className='mb-6 flex flex-col items-center space-y-4'>
          <div
            className='w-10 h-10 hover:bg-app-neutral300 rounded-lg flex items-center justify-center cursor-pointer'
            onClick={toggleTheme}
          >
            {theme === 'dark' ? (
              <Sun className='transition-all duration-300 text-app-text-color' />
            ) : (
              <Moon className='transition-all duration-300 text-app-text-color' />
            )}
          </div>
          {isLogin && (
            <button
              ref={buttonRef}
              onClick={() => setIsOpen(prev => !prev)}
              className='w-10 h-10 hover:bg-app-neutral300 rounded-lg flex items-center justify-center cursor-pointer'
            >
              {getInitials(session?.user?.name)}
            </button>
          )}
          <div className='w-10 h-10 hover:bg-app-neutral300 rounded-lg flex items-center justify-center cursor-pointer'>
            <IconDiscord />
          </div>
          <div className='text-xs text-gray-500 text-center'>
            <div>V 1.0</div>
            <div>2025 05</div>
          </div>
        </div>
      </div>

      {/* Floating Profile Menu */}
      {/* {session?.user && (
        <ModalFloating
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          triggerRef={buttonRef}
        >
          <MenuProfile
            locale={locale}
            lang={lang}
            data={session?.user}
            onClose={() => setIsOpen(false)}
            setIsOpenLogout={() => setIsOpenLogout(true)}
            buttonLogoutRef={buttonLogoutRef}
          />
        </ModalFloating>
      )} */}

      <ModalFloating
        isOpen={isOpenLogout}
        onClose={() => setIsOpenLogout(false)}
        triggerRef={buttonLogoutRef}
        className='!left-1/2 -translate-x-1/2 !bottom-1/2 translate-y-1/2'
      >
        <LogoutModal
          lang={lang}
          locale={locale}
          onClose={() => setIsOpenLogout(false)}
          onConfirm={() => signOut({ callbackUrl: `/${locale}` })}
        />
      </ModalFloating>
    </>
  )
}
