'use client'

import { IconSize, IconSouthKoreaFlag } from '@/components/atoms/Icons'
import { MyBalanceSheetProps } from '@/components/layout/header/views/myBalance/types'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { thousandSeparatorComma } from '@/utils/helper/formatNumber'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

const HeaderBalance = ({ lang, locale, data, onShow }: MyBalanceSheetProps) => {
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className='cursor-pointer border-none' asChild>
        <button className='flex items-center md:w-[200px] gap-2'>
          <IconSouthKoreaFlag />

          {data !== undefined && data !== null ? (
            onShow ? (
              <div>
                <p className='flex items-center gap-1 xs:text-[12px] text-[9px] font-semibold text-app-text-color'>
                  {lang?.header?.mainBalance}{' '}
                  {open ? (
                    <ChevronUp size={12} className='-mb-[2px]' />
                  ) : (
                    <ChevronDown size={12} className='-mb-[2px]' />
                  )}
                </p>
                <span
                  className={cn(
                    'flex gap-1 -mt-1 font-semibold',
                    String(data.balance).length > 7 ? 'text-xs' : 'text-base'
                  )}
                >
                  {thousandSeparatorComma(Number(data.balance))}
                </span>
              </div>
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
      </PopoverTrigger>
      <PopoverContent className=' border-none rounded-2xl bg-app-bg-button mt-2 px-3 pt-3 pb-4  w-[130%] shadow-lg text-app-text-color'>
        <p className='flex items-center gap-1 text-[12px] mb-1 font-semibold text-app-text-color'>
          {lang?.header?.mainBalance}
        </p>
        <div className='flex items-center gap-2'>
          <IconSouthKoreaFlag />
          <span className={cn('flex gap-1 -mt-1 font-semibold', String(data).length > 7 ? 'text-base' : 'text-sm')}>
            {thousandSeparatorComma(Number(data?.balance ?? 0))}
          </span>
        </div>
        <div className='flex bg-app-bg-button-hover px-3 rounded-2xl justify-between py-[6px] mt-3 items-center gap-2'>
          <p className='text-[12px]  text-app-text-color font-semibold'>{lang?.header?.idnBalance}</p>
          <div className='flex items-center gap-2'>
            <IconSouthKoreaFlag size={IconSize.sm} />
            <span className={cn('flex gap-1 font-semibold', String(data).length > 7 ? 'text-sm' : 'text-sm')}>
              {thousandSeparatorComma(Number(data?.provider_balance ?? 0))}
            </span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default HeaderBalance
