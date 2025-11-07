'use client'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { BannerDTO } from '@/types/bannerDTO'
import { LangProps } from '@/types/langProps'
import clsx from 'clsx'
import type { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'

type Props = {
  items?: BannerDTO[]
  className?: string
  isLoading?: boolean
  autoplay?: boolean
  intervalMs?: number
  options?: EmblaOptionsType
  /** posisi konten overlay */
  lang: LangProps
}

export default function BannerCarousel({
  items = [],
  className,
  isLoading,
  autoplay = true,
  intervalMs = 5000,
  options = { loop: true, align: 'start' },
  lang
}: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options)
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([])
  const [isPaused, setIsPaused] = React.useState(false)

  const onSelect = React.useCallback((embla: EmblaCarouselType) => {
    setSelectedIndex(embla.selectedScrollSnap())
  }, [])

  React.useEffect(() => {
    if (!emblaApi) return
    setScrollSnaps(emblaApi.scrollSnapList())
    onSelect(emblaApi)
    const reInit = () => {
      setScrollSnaps(emblaApi.scrollSnapList())
      onSelect(emblaApi)
    }
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', reInit)
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', reInit)
    }
  }, [emblaApi, onSelect])

  React.useEffect(() => {
    if (!emblaApi || !autoplay) return
    let id: ReturnType<typeof setInterval> | undefined
    if (!isPaused) id = setInterval(() => emblaApi.scrollNext(), intervalMs)
    return () => {
      if (id) clearInterval(id)
    }
  }, [emblaApi, autoplay, intervalMs, isPaused])

  const isEmpty = !isLoading && items.length === 0

  return (
    <section
      className={clsx(
        'relative w-full overflow-hidden rounded-2xl ring-1 ring-white/10',
        'h-[180px] md:h-full',
        className
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      aria-roledescription='carousel'
    >
      {isLoading ? (
        <Skeleton className='h-full w-full rounded-2xl' />
      ) : isEmpty ? (
        <div className='relative h-full w-full'>
          <Image
            src={'/images/default/main_banner.png'}
            alt='Main banner placeholder'
            fill
            priority={false}
            className='object-cover object-center rounded-2xl'
            sizes='(min-width:1024px) 360px, 100vw'
          />
          <div className={'absolute inset-0 flex items-end mb-6 justify-center p-4 text-center'}>
            <div className={clsx('max-w-[85%] md:max-w-none')}>
              <h3
                className={clsx('text-base font-extrabold tracking-tight text-white drop-shadow md:text-xl uppercase')}
              >
                {lang?.banner?.bannerTitle}
              </h3>

              <p className={clsx('mt-1 text-sm text-white/85 drop-shadow md:text-sm capitalize')}>
                {lang?.banner?.bannerSubTitle}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className='embla h-full' ref={emblaRef}>
            <div className='embla__container h-full'>
              {items.map(ev => (
                <div className='embla__slide h-full' key={ev.id}>
                  <div className='relative h-full w-full overflow-hidden rounded-2xl'>
                    {ev.image ? (
                      <Image
                        src={ev.image}
                        alt={ev.title ?? 'Event'}
                        fill
                        priority
                        className='h-full w-full object-cover object-center'
                        sizes='(min-width:1024px) 360px, 100vw'
                      />
                    ) : (
                      <div className='h-full w-full bg-muted' />
                    )}

                    <div className={'absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent'} />

                    {/* overlay content */}
                    <div className={'absolute inset-0 flex items-end mb-6 justify-center p-4 text-center'}>
                      <div className={clsx('max-w-[85%] md:max-w-none')}>
                        {ev.title && (
                          <h3
                            className={clsx(
                              'text-base font-extrabold tracking-tight text-white drop-shadow md:text-xl'
                            )}
                          >
                            {ev.title}
                          </h3>
                        )}

                        {ev.sub_title && (
                          <p className={clsx('mt-1 text-sm text-white/85 drop-shadow md:text-sm truncate')}>
                            {ev.sub_title}
                          </p>
                        )}

                        {ev.title && (
                          <div className={'pt-3 flex justify-center'}>
                            <Button
                              asChild
                              size='sm'
                              variant='secondary'
                              className='bg-app-primary text-white hover:bg-app-primary-hover uppercase'
                            >
                              <Link href={`/banners/${ev.id}`}>{lang?.common?.moreInfo}</Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {items.length > 1 && (
            <div className='absolute bottom-2 left-0 right-0 flex items-center justify-center gap-1.5'>
              {scrollSnaps.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to event ${i + 1}`}
                  onClick={() => emblaApi?.scrollTo(i)}
                  className={clsx(
                    'h-1.5 w-3 rounded-full transition-all',
                    i === selectedIndex ? 'bg-app-primary' : 'bg-white/40 hover:bg-white/70'
                  )}
                />
              ))}
            </div>
          )}
        </>
      )}

      <style jsx>{`
        .embla {
          position: relative;
        }
        .embla__container {
          display: flex;
        }
        .embla__slide {
          flex: 0 0 100%;
          min-width: 0;
        }
      `}</style>
    </section>
  )
}
