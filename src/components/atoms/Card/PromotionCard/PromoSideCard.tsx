'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import clsx from 'clsx'

type Props = {
  title: string
  subtitle?: string
  imageUrl?: string
  ctaText?: string
  href?: string
  isLoading?: boolean
  className?: string
}

/** Side card tanpa AspectRatio: mobile pakai tinggi default, desktop ikut parent (h-full). */
export default function PromoSideCard({
  title,
  subtitle,
  imageUrl,
  ctaText = 'MORE INFO',
  href = '#',
  isLoading,
  className
}: Props) {
  if (isLoading) return <Skeleton className={clsx('h-[180px] w-full rounded-2xl md:h-full', className)} />

  return (
    <section
      className={clsx(
        'relative w-full overflow-hidden rounded-2xl ring-1 ring-white/10',
        'h-[180px] md:h-full',
        className
      )}
    >
      <div className='relative h-full w-full overflow-hidden rounded-2xl'>
        {imageUrl ? (
          <Image src={imageUrl} alt={title} fill priority className='h-full w-full object-cover object-center' />
        ) : (
          <div className='h-full w-full bg-muted' />
        )}
        <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent' />
      </div>

      {/* overlay */}
      <div className='absolute inset-0 flex items-end p-4'>
        <div>
          <h3 className='text-xl font-extrabold tracking-tight text-white drop-shadow'>{title}</h3>
          {subtitle ? <p className='text-sm text-white/85 drop-shadow'>{subtitle}</p> : null}
          <Button asChild size='sm' className='mt-2'>
            <Link href={href}>{ctaText}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
