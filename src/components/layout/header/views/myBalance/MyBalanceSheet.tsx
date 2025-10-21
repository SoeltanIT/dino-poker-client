'use client'

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { ArrowRightLeft } from 'lucide-react'
import { useState } from 'react'
import { ToastContainer } from 'react-toastify'
import MyBalance from './MyBalance'
import { MyBalanceSheetProps } from './types'

export default function BalanceSheet({ lang, locale, data, dataFee, onShow }: MyBalanceSheetProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className={cn(
            'flex justify-center items-center min-h-10 h-10 min-w-10 w-10 p-2 bg-app-primary hover:bg-app-primary-hover rounded-lg transition-colors gap-1',
            locale === 'ko' ? 'lg:w-full lg:max-w-[100px]' : 'lg:w-full lg:max-w-[120px]'
          )}
        >
          <ArrowRightLeft size={16} className='text-white' />
          <span className='hidden lg:flex text-white text-sm font-medium uppercase'>{lang?.header?.convert}</span>
        </button>
      </SheetTrigger>
      <SheetContent side='right' className='w-full sm:max-w-md overflow-y-auto scrollbar-hide'>
        <ToastContainer />
        <MyBalance lang={lang} locale={locale} data={data} dataFee={dataFee} />
      </SheetContent>
    </Sheet>
  )
}
