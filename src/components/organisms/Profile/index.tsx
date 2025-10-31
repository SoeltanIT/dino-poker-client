'use client'

import { IconBank, IconCoin, IconLogout, IconPromotion, IconReferral, IconTransaction } from '@/components/atoms/Icons'
import ChangePasswordForm from '@/components/layout/header/views/menu/changePassword/ChangePassword'
import KYC from '@/components/layout/header/views/menu/kyc/KYC'
import ThemeSwitcher from '@/components/molecules/ThemeSwitcher'
import { useTelegramMiniApp } from '@/components/providers/TelegramMiniApp'
import { resetLiveChatSession } from '@/lib/livechat-reset'
import { getInitials } from '@/utils/helper/getInitials'
import {
  getLinkBankAccount,
  getLinkBetHistory,
  getLinkMyPromotion,
  getLinkReferral,
  getLinkTranscationHistory,
  getLinkTransferHistory
} from '@/utils/linkFactory/linkFactory'
import { ArrowRightLeft, IdCard } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import { useCookies } from 'react-cookie'
import { MenuProfileProps } from './types'

export default function MenuProfile({
  data,
  onClose,
  buttonLogoutRef,
  // setIsOpenLogout,
  locale,
  lang,
  features
}: MenuProfileProps) {
  const getStatusColor = (status?: string) => {
    if (status === 'APPROVED') return 'border-app-success text-app-success'
    if (status === 'REJECTED') return 'border-app-danger text-app-danger'
    if (status === 'PENDING') return 'border-app-accentYellow text-app-accentYellow'
    return 'border-app-text-color text-app-text-color'
  }

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'APPROVED':
        return lang?.common?.approved
      case 'REJECTED':
        return lang?.common?.rejected
      case 'PENDING':
        return lang?.common?.pending
      case 'UNVERIFIED':
        return lang?.common?.unverified
      default:
        return ''
    }
  }

  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [, , removeCookie] = useCookies(['_authorization'])

  const { closeApp } = useTelegramMiniApp()

  const isStatus = data?.status

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

  const menuItems = [
    // {
    //   icon: <IconWallet />,
    //   label: lang?.common?.myWallet,
    //   href: getLinkMyWallet(locale)
    // },
    {
      icon: <IconBank />,
      label: lang?.common?.bankAccount,
      href: getLinkBankAccount(locale)
    },
    {
      icon: <IconCoin />,
      label: lang?.common?.betHistory,
      href: getLinkBetHistory(locale)
    },
    {
      icon: <IconTransaction />,
      label: lang?.common?.transactionHistory,
      href: getLinkTranscationHistory(locale)
    },
    {
      icon: <ArrowRightLeft />,
      label: lang?.common?.transferHistory,
      href: getLinkTransferHistory(locale)
    },
    {
      icon: <IconReferral />,
      label: lang?.common?.myReferral,
      href: getLinkReferral(locale)
    }
  ]

  if (features?.promotion) {
    menuItems.splice(1, 0, {
      icon: <IconPromotion />,
      label: lang?.common?.myPromotion,
      href: getLinkMyPromotion(locale)
    })
  }

  return (
    <>
      <div className='pb-3'>
        <div className='flex justify-between items-center w-full'>
          <div className='px-6 md:px-4 pt-4 pb-2 md:pb-0'>
            <div className='flex flex-row items-center gap-2'>
              <div className='flex font-semibold w-10 h-10 bg-app-primary rounded-[8px] justify-center items-center text-white'>
                {data?.username ? getInitials(data?.username) : ''}
              </div>
              <div className='flex flex-col max-w-[165px]'>
                {/* batasi lebar teks */}
                <div className='font-semibold text-sm capitalize text-app-text-color truncate' title={data?.username}>
                  {data?.username}
                </div>
                <div className='font-semibold text-app-text-color text-sm truncate' title={data?.email}>
                  {data?.email}
                </div>
              </div>
            </div>
          </div>
          <div className='md:hidden mr-7'>
            <ThemeSwitcher />
          </div>
        </div>

        <hr className='my-3 border-app-divider-color' />

        <div className='px-6 md:px-4 text-xs font-semibold text-app-neutral500'>
          {/* KYC stays outside the iteration */}
          <button
            onClick={() => setIsSheetOpen(true)}
            disabled={isStatus === 'APPROVED'}
            className='h-10 w-full cursor-pointer flex items-center justify-between gap-[7px] hover:text-app-text-color'
          >
            <div className='flex items-center gap-[7px]'>
              <IdCard />
              <span>{lang?.common?.verification}</span>
            </div>
            {/* <span className={`${getStatusColor(isStatus ?? '')}`}>({isStatus})</span> */}
            {/* {isStatus === 'APPROVED' ? (
            <IconAlert className={`${getStatusColor(isStatus ?? '')}`} />
          ) : ( */}
            {getStatusText(isStatus) !== '' && (
              <div
                className={`py-1 px-3 border ${getStatusColor(
                  isStatus
                )} text-[10px] font-semibold uppercase rounded-full`}
              >
                {getStatusText(isStatus)}
              </div>
            )}
            {/* )} */}
          </button>
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              onClick={() => onClose()}
              className='h-10 cursor-pointer flex items-center gap-[7px] hover:text-app-text-color'
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        <hr className='my-3 border-app-divider-color' />

        <div className='px-6 md:px-4 text-xs font-semibold text-app-neutral500'>
          {/* <ChangeEmailForm lang={lang} /> */}
          <ChangePasswordForm lang={lang} />
        </div>

        <hr className='my-3 border-app-divider-color' />

        <div className='px-6 md:px-4 text-xs font-semibold text-app-neutral500 hover:text-app-text-color'>
          <button
            ref={buttonLogoutRef}
            onClick={() => {
              handleLogout()
              onClose()
            }}
            className='h-10 cursor-pointer flex items-center gap-[7px]'
          >
            <IconLogout />
            <span>{lang?.logout?.title}</span>
          </button>
        </div>

        <KYC
          open={isSheetOpen}
          onClose={() => {
            setIsSheetOpen(false), onClose()
          }}
          lang={lang}
          isStatus={isStatus}
        />
      </div>
    </>
  )
}
