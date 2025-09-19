'use client'

import { IconSouthKoreaFlag } from '@/components/atoms/Icons'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { thousandSeparatorComma } from '@/utils/helper/formatNumber'
import { useState } from 'react'
import MyBalance from './MyBalance'
import { MyBalanceSheetProps } from './types'
import { cn } from '@/lib/utils'

export default function BalanceSheet({ lang, locale, data, onShow }: MyBalanceSheetProps) {
  const [open, setOpen] = useState(false)

  const balance = data?.balance?.toString()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className='flex items-center gap-2'>
          <IconSouthKoreaFlag />

          {balance !== undefined && balance !== null ? (
            onShow ? (
              <span className={cn('flex gap-1 font-semibold', String(balance).length > 7 ? 'text-xs' : 'text-sm')}>
                {thousandSeparatorComma(Number(data?.balance))}
              </span>
            ) : (
              <span className='inline-flex gap-1 items-center'>
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className='h-1.5 w-1.5 rounded-full bg-app-text-color' />
                ))}
              </span>
            )
          ) : (
            '0'
          )}
        </button>
      </SheetTrigger>
      <SheetContent side='right' className='w-full sm:max-w-md overflow-y-auto scrollbar-hide'>
        <MyBalance lang={lang} locale={locale} data={data} />
      </SheetContent>
    </Sheet>
  )
}
