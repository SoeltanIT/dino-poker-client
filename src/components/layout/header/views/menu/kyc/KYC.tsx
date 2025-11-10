'use client'

import { IdCard } from 'lucide-react'
import { useState } from 'react'

import KYCForm from '@/components/organisms/Profile/KYC'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { LangProps } from '@/types/langProps'
import { ToastContainer } from 'react-toastify'
import { Locale } from '@/i18n-config'

export default function KYC({
  open,
  lang,
  isStatus,
  onClose,
  locale
}: {
  open: boolean
  lang?: LangProps
  isStatus?: string
  onClose: () => void
  locale?: Locale
}) {
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

  const onPressClose = () => {
    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      {/* <SheetTrigger asChild>
        <button
          disabled={isStatus === 'APPROVED'}
          className='h-10 w-full cursor-pointer flex items-center justify-between gap-[7px] hover:text-app-text-color'
        >
          <div className='flex items-center gap-[7px]'>
            <IdCard />
            <span>{lang?.common?.verification}</span>
          </div>

          {getStatusText(isStatus) !== '' && (
            <div
              className={`py-1 px-3 border ${getStatusColor(
                isStatus
              )} text-[10px] font-semibold uppercase rounded-full`}
            >
              {getStatusText(isStatus)}
            </div>
          )}
          {
        </button>
      </SheetTrigger> */}

      <SheetContent className='w-full sm:max-w-md overflow-y-auto scrollbar-hide'>
        <ToastContainer />

        <div className='mb-8 text-app-text-color'>
          <h2 className='text-xl font-bold uppercase'>{lang?.common?.kyc}</h2>
          <p className='text-sm'>{lang?.common?.kycDescription}</p>
        </div>
        <KYCForm lang={lang} onClose={() => onPressClose()} isStatus={isStatus} locale={locale} />
      </SheetContent>
    </Sheet>
  )
}
