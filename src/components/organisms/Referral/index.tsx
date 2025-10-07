'use client'

import { IconGiftReferral } from '@/components/atoms/Icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LangProps } from '@/types/langProps'
import { copyToClipboard } from '@/utils/helper/copyToClipboard'
import {
  getLinkAffiliateCreate,
  getLinkReferralDetail,
  getLinkReferralGroupHistory,
  getLinkReferralGroupSettings
} from '@/utils/linkFactory/linkFactory'
import { ChevronRight, Copy } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { MyReferralProps } from './types'

const renderButtonActions = (lang: LangProps | undefined, locale: string | undefined, roles: number) => {
  switch (roles) {
    case 3:
      return (
        <div className='flex gap-2'>
          <Link
            href={getLinkAffiliateCreate(locale)}
            className='bg-app-primary hover:bg-app-primary-hover text-white px-2 py-2 rounded-lg flex items-center gap-2 uppercase text-sm'
          >
            {lang?.common?.create}
            <ChevronRight className='w-4 h-4' />
          </Link>
          <Link
            href={getLinkReferralGroupSettings(locale)}
            className='bg-app-primary hover:bg-app-primary-hover text-white px-2 py-2 rounded-lg flex items-center gap-2 uppercase text-sm'
          >
            {lang?.common?.settings}
            <ChevronRight className='w-4 h-4' />
          </Link>
          <Link
            href={getLinkReferralGroupHistory(locale)}
            className='bg-app-primary hover:bg-app-primary-hover text-white px-2 py-2 rounded-lg flex items-center gap-2 uppercase text-sm'
          >
            {lang?.common?.history}
            <ChevronRight className='w-4 h-4' />
          </Link>
        </div>
      )
    case 2:
      return (
        <Link
          href={getLinkReferralDetail(locale)}
          className='bg-app-primary hover:bg-app-primary-hover text-white px-2 py-2 rounded-lg flex items-center gap-2 uppercase text-sm'
        >
          {lang?.common?.detail}
          <ChevronRight className='w-4 h-4' />
        </Link>
      )

    default:
      return null
  }
}

export default function MyReferral({ lang, locale, initialData, isLoading }: MyReferralProps) {
  const { data: session, status } = useSession()
  const roles = (session?.user as any)?.roles || 2

  const isLoadingSession = status === 'loading'

  return (
    <div className='min-h-screen flex flex-col w-full text-app-text-color px-6 lg:px-20 my-10'>
      <div className='container flex flex-col'>
        {/* Header */}
        <div className='mb-[36px]'>
          <h1 className='text-3xl font-bold text-app-text-color uppercase'>{lang?.common?.myReferral}</h1>
        </div>
        {/* Purple Banner */}
        <div className='bg-gradient-to-r from-app-primary to-purple-500 rounded-t-lg'>
          <div className='flex items-center justify-center gap-2'>
            <IconGiftReferral />
            <div>
              {/* <p className='text-white text-xs md:text-base font-medium'>
                {lang?.common?.inviteYourFriend} <span className='text-app-success font-bold'>2%</span>{' '}
                {lang?.common?.commissionBonus}!
              </p> */}
              <p className='text-white text-xs md:text-base font-medium'>{lang?.common?.labelInviteReferral}</p>
            </div>
          </div>
        </div>

        {/* Referral Section */}
        <div className='mb-8'>
          <div className='bg-app-background-secondary rounded-b-lg p-4'>
            <div className='flex items-center justify-between mb-4 flex-wrap gap-2'>
              <h3 className='text-app-text-color text-sm'>{lang?.common?.referralCodeLink}</h3>
              {!isLoadingSession && renderButtonActions(lang, locale, roles)}
            </div>

            {/* Mobile Layout - Stacked */}
            <div className='lg:hidden space-y-3'>
              <div className='relative'>
                {isLoading ? (
                  <div className='w-40 h-10 bg-app-background-primary animate-pulse'></div>
                ) : (
                  <Input value={initialData?.referral_link ?? ''} readOnly className='pr-10' />
                )}
                <Button
                  size='sm'
                  variant='ghost'
                  className='absolute right-2 top-1/2 -translate-y-1/2 p-1'
                  onClick={() => copyToClipboard(initialData?.referral_link ?? '', lang)}
                >
                  <Copy className='w-4 h-4' />
                </Button>
              </div>
              <div className='relative'>
                {isLoading ? (
                  <div className='w-40 h-10 bg-app-background-primary animate-pulse'></div>
                ) : (
                  <Input value={initialData?.referral_code ?? ''} readOnly className='pr-10' />
                )}
                <Button
                  size='sm'
                  variant='ghost'
                  className='absolute right-2 top-1/2 -translate-y-1/2 p-1'
                  onClick={() => copyToClipboard(initialData?.referral_code ?? '', lang)}
                >
                  <Copy className='w-4 h-4' />
                </Button>
              </div>
            </div>

            {/* Desktop Layout - Horizontal */}
            <div className='hidden lg:flex gap-4'>
              <div className='relative flex-1'>
                {isLoading ? (
                  <div className='w-40 h-10 bg-app-background-primary animate-pulse'></div>
                ) : (
                  <Input value={initialData?.referral_link ?? ''} readOnly className='pr-10' />
                )}
                <Button
                  size='sm'
                  variant='ghost'
                  className='absolute right-2 top-1/2 -translate-y-1/2 p-1'
                  onClick={() => copyToClipboard(initialData?.referral_link ?? '', lang)}
                >
                  <Copy className='w-4 h-4' />
                </Button>
              </div>
              <div className='relative flex-1'>
                {isLoading ? (
                  <div className='w-40 h-10 bg-app-background-primary animate-pulse'></div>
                ) : (
                  <Input value={initialData?.referral_code ?? ''} readOnly className='pr-10' />
                )}
                <Button
                  size='sm'
                  variant='ghost'
                  className='absolute right-2 top-1/2 -translate-y-1/2 p-1'
                  onClick={() => copyToClipboard(initialData?.referral_code ?? '', lang)}
                >
                  <Copy className='w-4 h-4' />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
