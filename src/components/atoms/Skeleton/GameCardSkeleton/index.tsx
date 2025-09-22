'use client'

import { cn } from '@/lib/utils'

type Variant = 'large' | 'big' | 'main' | 'provider'

const radiusByVariant: Record<Variant, string> = {
  large: 'rounded-xl md:rounded-2xl',
  big: 'rounded-xl md:rounded-[20px]',
  main: 'rounded-xl md:rounded-2xl',
  provider: 'rounded-lg'
}

export function GameCardSkeleton({ variant = 'main', className = '' }: { variant?: Variant; className?: string }) {
  const r = radiusByVariant[variant]

  return (
    <div className={cn('relative group', className)}>
      {/* Image box */}
      <div
        className={cn(r, 'border border-app-grey12op relative bg-[#1e232b] aspect-[3/4] flex-shrink-0 overflow-hidden')}
        aria-hidden
      >
        {/* subtle shimmer */}
        <div className='absolute inset-0 animate-pulse bg-[linear-gradient(100deg,transparent_40%,rgba(255,255,255,0.06)_50%,transparent_60%)] bg-[length:200%_100%]' />
      </div>

      {/* Bottom content gradient */}
      <div className={cn(r, 'absolute inset-0 flex flex-col justify-end overflow-hidden')}>
        <div className='text-center text-white px-1 py-3 bg-gradient-to-b from-transparent via-black/40 to-black/60'>
          {/* title line */}
          <div className='mx-auto h-3 md:h-4 w-2/3 rounded bg-white/20 animate-pulse mb-1' />
          {/* provider line */}
          <div className='mx-auto h-2 md:h-3 w-1/3 rounded bg-white/10 animate-pulse mb-2' />
          {/* players pill */}
          <div className='mx-auto h-5 md:h-6 w-20 rounded-full border border-white/10 bg-white/10 backdrop-blur-sm animate-pulse' />
        </div>
      </div>
    </div>
  )
}
