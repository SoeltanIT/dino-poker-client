'use client'

import { IconChips, IconSize, IconSouthKoreaFlag } from '@/components/atoms/Icons'
import { MyBalanceSheetProps } from '@/components/layout/header/views/myBalance/types'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { thousandSeparatorComma } from '@/utils/helper/formatNumber'
import { useIsFetching, useQueryClient } from '@tanstack/react-query'
import { ChevronDown, ChevronUp, RefreshCcwIcon } from 'lucide-react'
import { useCallback, useState } from 'react'

const HeaderBalance = ({ lang, locale, data, onShow, dataFee, pokerBalance }: MyBalanceSheetProps) => {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  let totalBalance = (data && pokerBalance && Number(data.balance + pokerBalance.provider_balance)) || 0
  let chipsCalculation = (pokerBalance && pokerBalance.chip_balance) ?? 0

  // count of active fetches for this query key
  const fetchingCount = useIsFetching({ queryKey: ['getBalancePoker'] })
  const isFetchingBalance = fetchingCount > 0

  const handleRefresh = useCallback(async () => {
    if (isFetchingBalance) {
      console.log('[HeaderBalance] Refresh blocked — still fetching...')
      return
    }

    console.log('[HeaderBalance] Refresh clicked! Invalidating getBalance query...')

    try {
      await queryClient.invalidateQueries({
        queryKey: ['getBalancePoker'],
        exact: false
      })

      console.log('[HeaderBalance] Query invalidated successfully. React Query should refetch now.')

      // Optional: Wait briefly and check again if it's fetching
      setTimeout(() => {
        const fetchingAfter = queryClient.isFetching({ queryKey: ['getBalance'] })
        console.log(`[HeaderBalance] Fetching state after invalidation: ${fetchingAfter > 0 ? 'ACTIVE' : 'IDLE'}`)
      }, 300)
    } catch (err) {
      console.error('[HeaderBalance] ❌ Failed to refresh balance:', err)
    }
  }, [queryClient, isFetchingBalance])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className='cursor-pointer border-none' asChild>
        <button className='flex items-center md:w-[200px] gap-2'>
          <IconSouthKoreaFlag />

          {data !== undefined && data !== null ? (
            onShow ? (
              <div>
                <p className='flex items-center gap-1 xs:text-[12px] text-[9px] font-semibold text-app-text-color'>
                  {lang?.header?.totalBalance}{' '}
                  {open ? (
                    <ChevronUp size={12} className='-mb-[2px]' />
                  ) : (
                    <ChevronDown size={12} className='-mb-[2px]' />
                  )}
                </p>
                <span
                  className={cn(
                    'flex gap-1 -mt-1 font-semibold',
                    String(totalBalance).length > 7 ? 'text-xs' : 'text-base'
                  )}
                >
                  {thousandSeparatorComma(totalBalance)}
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
      <PopoverContent className='border-none rounded-2xl bg-app-bg-button mt-8 ml-2 md:-ml-4 py-[9px] px-2 w-[140%] shadow-lg text-app-text-color'>
        <p className='flex items-center gap-1 text-[10px] mb-1 font-semibold text-app-text-main'>
          {lang?.header?.mainBalance}
        </p>
        <div className='flex items-center gap-2'>
          <IconSouthKoreaFlag />
          <span className={cn('flex gap-1 -mt-1 font-semibold', String(data).length > 7 ? 'text-base' : 'text-sm')}>
            {thousandSeparatorComma(Number(data?.balance ?? 0))}
          </span>
        </div>

        <div className='flex flex-col bg-app-primary-hover px-3 rounded-2xl justify-between py-[8px] mt-3 items-start'>
          <div className='flex w-full justify-between items-center mr-1'>
            <div className='flex w-full flex-col'>
              <p className='text-[10px] text-app-text-chips font-semibold'>{lang?.header?.idnBalance}</p>
              <div className='flex items-center gap-2'>
                <IconSouthKoreaFlag size={IconSize.sm} />
                {isFetchingBalance ? (
                  <div className='animate-pulse h-6 w-12 bg-app-neutral500 rounded-md' />
                ) : (
                  <span
                    className={cn(
                      'flex gap-1 font-semibold text-white',
                      String(pokerBalance?.provider_balance).length > 6 ? 'text-base' : 'text-sm'
                    )}
                  >
                    {thousandSeparatorComma(Number(pokerBalance?.provider_balance ?? 0))}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleRefresh}
              aria-label='Refresh balance'
              className='flex items-center justify-center p-1 rounded'
              disabled={isFetchingBalance}
              title='Refresh balance'
            >
              <RefreshCcwIcon
                className={cn(
                  'text-white cursor-pointer transition-transform',
                  isFetchingBalance ? 'animate-spin' : 'hover:scale-105'
                )}
                size={18}
              />
            </button>
          </div>
          <div className='flex w-full bg-app-bg-chips px-2 rounded-2xl justify-between py-[6.5px] mt-2 items-center'>
            <p className='text-[10px] text-app-text-color font-semibold'>{lang?.common?.chips}</p>
            <div className='flex items-center gap-2'>
              <IconChips size={IconSize.sm} className='text-app-text-color' />
              {isFetchingBalance ? (
                <div className='animate-pulse h-6 w-12 bg-app-neutral500 rounded-md' />
              ) : (
                <span
                  className={cn(
                    'flex gap-1 font-semibold text-app-text-color',
                    String(data).length > 6 ? 'text-base' : 'text-sm'
                  )}
                >
                  {thousandSeparatorComma(chipsCalculation)}
                </span>
              )}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default HeaderBalance
