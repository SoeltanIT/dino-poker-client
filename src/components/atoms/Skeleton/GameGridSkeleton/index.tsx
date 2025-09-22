'use client'

import { cn } from '@/lib/utils'
import { GameCardSkeleton } from '../GameCardSkeleton'

export function GameGridSkeleton({ count = 12, className }: { count?: number; className?: string }) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className='
            basis-[calc((100%-0.5rem*2)/3)]
            md:basis-[calc((100%-0.5rem*5)/6)]
            shrink-0 min-w-0
          '
        >
          <GameCardSkeleton className='w-full h-full min-w-0' />
        </div>
      ))}
    </div>
  )
}
