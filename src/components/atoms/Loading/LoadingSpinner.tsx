'use client'

import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  color?: 'primary' | 'white' | 'secondary'
}

const sizeClasses = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-3',
  xl: 'w-16 h-16 border-4'
}

const colorClasses = {
  primary: 'border-[var(--c-primary)] border-t-transparent',
  white: 'border-white border-t-transparent',
  secondary: 'border-[var(--c-secondary)] border-t-transparent'
}

export function LoadingSpinner({ size = 'md', className, color = 'primary' }: LoadingSpinnerProps) {
  return (
    <div
      className={cn('animate-spin rounded-full', sizeClasses[size], colorClasses[color], className)}
      role='status'
      aria-label='Loading'
    >
      <span className='sr-only'>Loading...</span>
    </div>
  )
}
