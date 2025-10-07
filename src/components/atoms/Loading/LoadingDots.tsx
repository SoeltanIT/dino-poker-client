'use client'

import { cn } from '@/lib/utils'

interface LoadingDotsProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  color?: 'primary' | 'white' | 'secondary'
}

const sizeClasses = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2.5 h-2.5',
  lg: 'w-4 h-4'
}

const colorClasses = {
  primary: 'bg-[var(--c-primary)]',
  white: 'bg-white',
  secondary: 'bg-[var(--c-secondary)]'
}

export function LoadingDots({ size = 'md', className, color = 'primary' }: LoadingDotsProps) {
  return (
    <div className={cn('flex items-center justify-center gap-1', className)} role='status' aria-label='Loading'>
      <span
        className={cn('rounded-full animate-bounce', sizeClasses[size], colorClasses[color])}
        style={{ animationDelay: '0ms' }}
      />
      <span
        className={cn('rounded-full animate-bounce', sizeClasses[size], colorClasses[color])}
        style={{ animationDelay: '150ms' }}
      />
      <span
        className={cn('rounded-full animate-bounce', sizeClasses[size], colorClasses[color])}
        style={{ animationDelay: '300ms' }}
      />
      <span className='sr-only'>Loading...</span>
    </div>
  )
}
