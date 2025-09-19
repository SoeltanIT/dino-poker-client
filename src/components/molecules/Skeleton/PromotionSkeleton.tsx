'use client'

import { Skeleton } from '@/components/ui/skeleton'

export default function PromotionSkeleton() {
  return (
    <div className='relative p-4 rounded-lg border border-app-neutral500'>
      <div className='flex items-start justify-between'>
        <div className='flex-1 space-y-3'>
          {/* Title skeleton */}
          <Skeleton className='h-5 w-40' />

          {/* Content skeleton */}
          <div className='space-y-2'>
            <Skeleton className='h-3 w-full' />
            <Skeleton className='h-3 w-4/5' />
            <Skeleton className='h-3 w-3/4' />
          </div>
        </div>

        {/* Radio button skeleton */}
        <Skeleton className='w-5 h-5 rounded-full' />
      </div>
    </div>
  )
}

export function PromotionSkeletonList() {
  return (
    <div className='space-y-3'>
      {/* No Promotion skeleton */}
      <div className='relative p-4 rounded-lg border border-app-neutral500'>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <Skeleton className='h-5 w-32' />
          </div>
          <Skeleton className='w-5 h-5 rounded-full' />
        </div>
      </div>

      {/* Promotion skeletons */}
      <PromotionSkeleton />
      <PromotionSkeleton />
      <div className='relative p-4 rounded-lg border border-app-neutral500'>
        <div className='flex items-start justify-between'>
          <div className='flex-1 space-y-3'>
            <Skeleton className='h-5 w-36' />
            <div className='space-y-2'>
              <Skeleton className='h-3 w-full' />
              <Skeleton className='h-3 w-5/6' />
            </div>
          </div>
          <Skeleton className='w-5 h-5 rounded-full' />
        </div>
      </div>
    </div>
  )
}
