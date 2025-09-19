'use client'

import { DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { X } from 'lucide-react'
import { LangProps } from '@/types/langProps'
import { Locale } from '@/i18n-config'

interface LogoutModalProps {
  onClose: () => void
  onConfirm: () => void
  lang: LangProps
  locale?: Locale
}

export const LogoutModal: React.FC<LogoutModalProps> = ({ lang, locale, onClose, onConfirm }) => {
  return (
    <div className='relative w-[340px] sm:w-[400px] bg-app-background-primary text-app-text-color rounded-2xl border border-app-neutral700 shadow-xl p-6'>
      <DialogHeader>
        <DialogTitle className='text-center text-sm sm:text-sm font-medium mt-2'>{lang?.logout?.logoutQ}</DialogTitle>
      </DialogHeader>
      <DialogFooter className='mt-6'>
        <button
          onClick={onConfirm}
          className='w-full border border-app-neutral500 text-app-text-color text-sm font-semibold uppercase py-2.5 rounded-full hover:bg-white hover:text-black transition-colors'
        >
          {lang?.logout?.title}
        </button>
      </DialogFooter>
    </div>
  )
}
