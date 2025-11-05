'use client'

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { ArrowRightLeft } from 'lucide-react'
import { useState } from 'react'
import { ToastContainer } from 'react-toastify'
import MyBalance from './MyBalance'
import { MyBalanceSheetProps } from './types'
import { Button } from '@/components/ui/button'

export default function BalanceSheet({ lang, locale, data, dataFee, onShow }: MyBalanceSheetProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className='bg-app-primary hover:bg-app-primary-hover h-10 min-w-10 px-2 lg:px-4 text-white uppercase rounded-[10px]'>
          <ArrowRightLeft size={16} className='text-white' />
          <span className='hidden lg:flex text-white text-sm font-medium uppercase'>{lang?.header?.convert}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side='right' className='w-full sm:max-w-md overflow-y-auto scrollbar-hide'>
        <ToastContainer />
        <MyBalance lang={lang} locale={locale} data={data} dataFee={dataFee} />
      </SheetContent>
    </Sheet>
  )
}
