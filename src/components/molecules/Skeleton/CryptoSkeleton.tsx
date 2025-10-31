'use client'

import { cn } from '@/lib/utils'

function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-md bg-app-neutral600', className)} />
}

export default function CryptoDepositSkeleton({ activeTab }: { activeTab?: string }) {
  return (
    <>
      {/* MAIN CONTENT */}
      <div className='flex flex-col flex-grow'>
        {/* ===== BANK TRANSFER / FIAT VIEW (not crypto) ===== */}
        {activeTab !== 'crypto' && (
          <>
            <div className='flex flex-col w-full max-h-[90px] bg-app-neutral700 rounded-[16px] items-center justify-center gap-[3px] py-4 '>
              {/* label */}
              <Skeleton className='h-3 w-24 rounded-sm' />
              {/* amount */}
              <Skeleton className='h-8 w-32 rounded-sm' />
            </div>

            {/* notice / warning text */}
            <div className='mb-[30px] mt-2'>
              <Skeleton className='h-4 w-full rounded-sm bg-app-neutral600' />
            </div>
          </>
        )}

        {/* ===== CRYPTO VIEW ===== */}
        {activeTab === 'crypto' && (
          <>
            <div className='flex flex-col items-center justify-center gap-4 mb-[30px] mt-6'>
              {/* QR square */}
              <Skeleton className='h-[220px] w-[220px] rounded-lg bg-app-neutral600' />

              {/* download button */}
              <Skeleton className='h-10 min-w-[130px] w-[130px] rounded-lg bg-app-neutral600 border border-app-neutral600 px-4' />
            </div>

            <div className='flex flex-col mb-6'>
              {/* "Deposit Address" row */}
              <div className='flex flex-row items-center gap-2'>
                <Skeleton className='h-4 w-28 rounded-sm' />
                <Skeleton className='h-4 w-4 rounded-sm' />
              </div>

              {/* wallet address box */}
              <Skeleton className='mt-2 h-[44px] w-full rounded-lg bg-app-neutral600' />
            </div>
          </>
        )}
      </div>
    </>
  )
}
