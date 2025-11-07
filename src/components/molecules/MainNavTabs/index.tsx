'use client'

import { IconPoker, IconSport, IconTicket } from '@/components/atoms/Icons' // make sure IconCasino exists
import { Locale } from '@/i18n-config'
import { cn } from '@/lib/utils'
import { LangProps } from '@/types/langProps'
import { BookIcon } from 'lucide-react'
import Link from 'next/link'

type MainNavTabsProps = {
  locale?: Locale
  pathname: string
  lang: LangProps
  features?: { sports?: boolean; casino?: boolean; promotion?: boolean }
  className?: string
}

export function MainNavTabs({ locale, pathname, lang, features, className }: MainNavTabsProps) {
  const isActive = (path: string) => pathname === path

  let pathPoker = `/${locale}`
  let pathSport = `/${locale}/sport`
  let pathPromotion = `/${locale}/promotion`

  const baseTab =
    'flex items-center gap-2 font-bold text-sm uppercase rounded-[10px] px-4 py-2 transition-colors duration-150 group'

  return (
    <div className={cn('flex gap-3', className)}>
      {/* Poker */}
      <Link
        href={pathPoker}
        className={cn(
          baseTab,
          isActive(pathPoker)
            ? 'bg-app-primary text-white border border-app-borderPrimary'
            : 'text-app-neutral500 group-hover:text-app-text-color'
        )}
      >
        <IconPoker
          className={cn(
            'w-4 h-4',
            isActive(pathPoker) ? 'text-white' : 'text-app-neutral500 group-hover:text-app-text-color'
          )}
        />
        <span className={cn(isActive(pathPoker) ? 'text-white' : 'group-hover:text-app-text-color')}>
          {lang?.header?.poker ?? 'POKER'}
        </span>
      </Link>

      {/* Sports */}
      {features?.sports && (
        <Link
          href={pathSport}
          className={cn(
            baseTab,
            isActive(pathSport) ? 'bg-app-primary text-white border border-app-borderPrimary' : 'text-app-neutral500'
          )}
        >
          <IconSport
            className={cn(
              'w-4 h-4',
              isActive(pathSport) ? 'text-white' : 'text-app-neutral500 group-hover:text-app-text-color'
            )}
          />
          <span className={cn(isActive(pathSport) ? 'text-white' : 'group-hover:text-app-text-color')}>
            {lang?.header?.sport ?? 'SPORT'}
          </span>
        </Link>
      )}

      {/* Sport */}
      {features?.promotion && (
        <Link
          href={pathPromotion}
          className={cn(
            baseTab,
            isActive(pathPromotion)
              ? 'bg-app-primary text-white border border-app-borderPrimary'
              : 'text-app-neutral500 group-hover:text-app-text-color'
          )}
        >
          <IconTicket
            className={cn(
              'w-4 h-4',
              isActive(pathPromotion) ? 'text-white' : 'text-app-neutral500 group-hover:text-app-text-color'
            )}
          />
          <span className={cn(isActive(pathPromotion) ? 'text-white' : 'group-hover:text-app-text-color')}>
            {lang?.header?.promotion ?? 'PROMOTION'}
          </span>
        </Link>
      )}

      <Link
        href='/user-guide'
        className={cn(
          baseTab,
          isActive('/user-guide')
            ? 'bg-app-primary text-white border border-app-borderPrimary'
            : 'text-app-neutral500 group-hover:text-app-text-color'
        )}
      >
        <BookIcon
          className={cn(
            'w-4 h-4',
            isActive('/user-guide') ? 'text-white' : 'text-app-neutral500 group-hover:text-app-text-color'
          )}
        />
        <span className={cn(isActive('/user-guide') ? 'text-white' : 'group-hover:text-app-text-color')}>
          User Guide
        </span>
      </Link>
    </div>
  )
}
