'use client'

import { IconSize, IconSouthKoreaFlag } from '@/components/atoms/Icons'
import { MyBalanceSheetProps } from '@/components/layout/header/views/myBalance/types'
import { Menubar, MenubarContent, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar'
import { cn } from '@/lib/utils'
import { thousandSeparatorComma } from '@/utils/helper/formatNumber'
import { ChevronDown } from 'lucide-react'

const HeaderBalance = ({ lang, locale, data, onShow }: MyBalanceSheetProps) => {
  return (
    <Menubar className='border-none'>
      <MenubarMenu>
        <MenubarTrigger className='cursor-pointer border-none' asChild>
          <button className='flex items-center  gap-2'>
            <IconSouthKoreaFlag />

            {data !== undefined && data !== null ? (
              onShow ? (
                <div>
                  <p className='flex items-center gap-1 text-[11px] font-semibold text-[#C2C2C2]'>
                    Main Balance <ChevronDown className='w-4 h-4 -mb-[2px]' />
                  </p>
                  <span
                    className={cn('flex gap-1 -mt-1 font-semibold', String(data).length > 7 ? 'text-base' : 'text-sm')}
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
        </MenubarTrigger>
        <MenubarContent className=' border-none bg-[#3E4046] mt-2 p-2 pb-4 w-[120%] shadow-lg rounded-md text-app-text-color'>
          <p className='flex items-center gap-1 text-[12px] mb-1 font-semibold text-[#C2C2C2]'>Main Balance</p>
          <div className='flex items-center gap-2'>
            <IconSouthKoreaFlag />
            <span className={cn('flex gap-1 -mt-1 font-semibold', String(data).length > 7 ? 'text-base' : 'text-sm')}>
              {thousandSeparatorComma(Number(data?.balance ?? 0))}
            </span>
          </div>
          <div className='flex bg-[#24252D] px-3 rounded-2xl justify-between py-[6px] mt-3 items-center gap-2'>
            <p className='text-[12px] text-[#C2C2C2] font-semibold'>IDN Balance</p>
            <div className='flex items-center gap-2'>
              <IconSouthKoreaFlag size={IconSize.sm} />
              <span className={cn('flex gap-1 font-semibold', String(data).length > 7 ? 'text-sm' : 'text-sm')}>
                {thousandSeparatorComma(Number(data?.balance ?? 0))}
              </span>
            </div>
          </div>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

export default HeaderBalance
