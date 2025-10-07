'use client'

import { cn } from '@/lib/utils'

interface LoadingCardProps {
  className?: string
  showAvatar?: boolean
  lines?: number
}

export function LoadingCard({ className, showAvatar = false, lines = 3 }: LoadingCardProps) {
  return (
    <div
      className={cn(
        'border border-app-grey12op rounded-xl p-4 space-y-3 bg-[var(--c-background-secondary)]',
        className
      )}
      role='status'
      aria-label='Loading card'
    >
      {showAvatar && (
        <div className='flex items-center space-x-3'>
          <div className='h-12 w-12 rounded-full bg-[var(--c-skeleton)] animate-pulse' />
          <div className='flex-1 space-y-2'>
            <div className='h-4 bg-[var(--c-skeleton)] rounded animate-pulse w-3/4' />
            <div className='h-3 bg-[var(--c-skeleton)] rounded animate-pulse w-1/2' />
          </div>
        </div>
      )}

      <div className='space-y-2'>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className='h-4 bg-[var(--c-skeleton)] rounded animate-pulse'
            style={{
              width: i === lines - 1 ? '60%' : '100%',
              animationDelay: `${i * 100}ms`
            }}
          />
        ))}
      </div>
    </div>
  )
}
