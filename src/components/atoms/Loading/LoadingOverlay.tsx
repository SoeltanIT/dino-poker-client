'use client'

import { cn } from '@/lib/utils'
import { LoadingSpinner } from './LoadingSpinner'

interface LoadingOverlayProps {
  visible?: boolean
  message?: string
  fullScreen?: boolean
  className?: string
  spinnerSize?: 'sm' | 'md' | 'lg' | 'xl'
}

export function LoadingOverlay({
  visible = true,
  message,
  fullScreen = false,
  className,
  spinnerSize = 'lg'
}: LoadingOverlayProps) {
  if (!visible) return null

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center z-50',
        fullScreen
          ? 'fixed inset-0 bg-black/60 backdrop-blur-sm'
          : 'absolute inset-0 bg-[var(--c-background-primary)]/80 backdrop-blur-sm rounded-lg',
        className
      )}
      role='status'
      aria-label='Loading overlay'
    >
      <LoadingSpinner size={spinnerSize} color='white' />
      {message && <p className='mt-4 text-sm text-white font-medium animate-pulse'>{message}</p>}
    </div>
  )
}
