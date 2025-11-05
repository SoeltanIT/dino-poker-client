'use client'

import { cn } from '@/lib/utils'

type HeaderSkeletonProps = {
  variant: 'loggedIn' | 'guest'
  className?: string
}

const SkeletonBox = ({ className, rounded = true }: { className?: string; rounded?: boolean }) => (
  <div className={cn('bg-app-neutral300 animate-pulse', rounded ? 'rounded' : '', className)} />
)

export function HeaderSkeleton({ variant, className }: HeaderSkeletonProps) {
  if (variant === 'loggedIn') {
    return (
      <div className={cn('w-full flex items-center md:justify-end gap-3', className)}>
        {/* Logo */}
        <div className='hidden md:flex flex-shrink-0'>
          <SkeletonBox className='md:w-[45px] md:h-[45px] w-[30px] h-[30px]' />
        </div>

        <div className='w-full flex items-center justify-center md:justify-end gap-3'>
          <SkeletonBox className='flex w-full h-[40px] md:max-w-[190px] px-3 py-1 rounded-full' />
          <SkeletonBox className='h-10 w-10 rounded' />
          <SkeletonBox className='h-10 w-10 rounded' />
          <SkeletonBox className='h-4 w-1 lg:mx-4 mx-1 rounded-none' />
          <SkeletonBox className='h-10 w-10 rounded' />
          <SkeletonBox className='h-10 w-10 rounded' />
          <div className='hidden md:flex'>
            <SkeletonBox className='h-10 w-10 rounded' />
          </div>
          <div className='hidden md:flex'>
            <SkeletonBox className='h-10 w-10 rounded' />
          </div>
        </div>
      </div>
    )
  }

  // Guest
  return (
    <div className={cn('w-full flex flex-col', className)}>
      <div className='hidden lg:flex w-full flex-col gap-2'>
        <div className='flex justify-between items-center w-full'>
          <div className='flex-shrink-0'>
            <SkeletonBox className='w-[50px] h-[50px]' />
          </div>
          <div className='flex flex-col'>
            <div className='flex justify-end items-center gap-4 w-full'>
              <div className='flex gap-4'>
                <SkeletonBox className='w-20 h-10 rounded' />
              </div>
              <SkeletonBox className='w-24 h-10 rounded' />
              <div className='hidden md:flex'>
                <SkeletonBox className='w-10 h-10 rounded' />
              </div>
              <SkeletonBox className='w-10 h-10 rounded' />
            </div>
          </div>
        </div>
      </div>

      <div className='flex lg:hidden flex-col'>
        <div className='flex justify-between items-center gap-3'>
          <div className='flex-shrink-0 mr-10'>
            <SkeletonBox className='w-[40px] h-[40px] rounded' />
          </div>
          <SkeletonBox className='w-full h-10 rounded' />
          <SkeletonBox className='w-full h-10 rounded' />
        </div>
      </div>
    </div>
  )
}
