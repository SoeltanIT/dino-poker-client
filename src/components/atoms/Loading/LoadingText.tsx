'use client'

import { cn } from '@/lib/utils'

interface LoadingTextProps {
  lines?: number
  className?: string
  lineHeight?: 'sm' | 'md' | 'lg'
}

const heightClasses = {
  sm: 'h-3',
  md: 'h-4',
  lg: 'h-5'
}

export function LoadingText({ lines = 3, className, lineHeight = 'md' }: LoadingTextProps) {
  return (
    <div className={cn('space-y-2', className)} role='status' aria-label='Loading text'>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'bg-[var(--c-skeleton)] rounded animate-pulse',
            heightClasses[lineHeight],
            i === lines - 1 ? 'w-3/4' : 'w-full'
          )}
          style={{ animationDelay: `${i * 100}ms` }}
        />
      ))}
    </div>
  )
}
