'use client'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { LangProps } from '@/types/langProps'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  title: string
  subtitle?: string
  imageUrl?: string
  ctaText?: string
  href?: string
  isLoading?: boolean
  className?: string
  lang: LangProps
}

export default function BannerCard({
  title,
  subtitle,
  imageUrl,
  ctaText = 'MORE INFO',
  href = '#',
  isLoading,
  className,
  lang
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
      {/* media */}
      <div className='relative h-full w-full overflow-hidden rounded-2xl'>
        {imageUrl ? (
          <Image src={imageUrl} alt={title} fill priority className='h-full w-full object-cover object-center' />
        ) : (
          <div className='h-full w-full bg-muted' />
        )}
        {/* gradient untuk keterbacaan teks */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent' />
      </div>

      {/* overlay content */}
      <div className={'absolute inset-0 flex items-end mb-6 justify-center p-4 text-center'}>
        <div className='max-w-[90%] md:max-w-none'>
          <h3 className='text-xl font-extrabold tracking-tight text-white drop-shadow uppercase'>
            {lang?.banner?.userGuideTitle}
          </h3>

          <p className='mt-1 text-sm text-white/85 drop-shadow capitalize truncate'>
            {lang?.banner?.userGuideSubTitle}
          </p>

          <div className={'pt-3 flex justify-center'}>
            <Button
              asChild
              size='sm'
              variant='secondary'
              className='bg-app-primary text-white hover:bg-app-primary-hover uppercase'
            >
              <Link href={href}>{lang?.banner?.moreInfo}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
