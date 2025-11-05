'use client'

import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { LangProps } from '@/types/langProps'
import clsx from 'clsx'
import type { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'

export type Promotion = {
  id: string | number
  title?: string
  subtitle?: string
  imageUrl?: string
  ctaText?: string
  ctaHref?: string
}

type Props = {
  items?: Promotion[]
  className?: string
  autoplay?: boolean
  intervalMs?: number
  options?: EmblaOptionsType
  isLoading?: boolean
  lang: LangProps
}

export default function PromoCarousel({
  items = [],
  className,
  autoplay = true,
  intervalMs = 4800,
  options = { loop: true, align: 'start' },
  isLoading
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

  // Autoplay
  React.useEffect(() => {
    if (!emblaApi || !autoplay) return
    let id: ReturnType<typeof setInterval> | undefined

    const start = () => {
      if (id || isPaused) return
      id = setInterval(() => emblaApi.scrollNext(), intervalMs)
    }
    const stop = () => {
      if (id) clearInterval(id)
      id = undefined
    }

    start()
    emblaApi.on('pointerDown', () => setIsPaused(true))
    emblaApi.on('pointerUp', () => setIsPaused(false))

    return () => stop()
  }, [emblaApi, autoplay, intervalMs, isPaused])

  const isEmpty = !isLoading && items.length === 0

  return (
    <section
      className={clsx('relative w-full overflow-hidden rounded-2xl ring-1 ring-white/10', className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      aria-roledescription='carousel'
    >
      {isLoading ? (
        <Skeleton className='h-[220px] w-full rounded-2xl md:h-[260px]' />
      ) : isEmpty ? (
        <div className='flex h-[180px] items-center justify-center text-sm text-muted-foreground'>
          No promotions available.
        </div>
      ) : (
        <>
          {/* viewport */}
          <div className='embla' ref={emblaRef}>
            <div className='embla__container'>
              {items.map(p => (
                <div className='embla__slide' key={p.id}>
                  <div className='relative w-full'>
                    <AspectRatio ratio={16 / 6} className='md:aspect-[16/5] overflow-hidden rounded-2xl h-full'>
                      {p.imageUrl ? (
                        <Image
                          src={p.imageUrl}
                          alt={p.title ?? 'Promotion'}
                          fill
                          priority
                          className='object-cover object-center w-full h-full'
                          sizes='(min-width:1024px) 1024px, 100vw'
                        />
                      ) : (
                        <div className='h-full w-full bg-muted' />
                      )}
                      <div className='absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/10' />
                    </AspectRatio>

                    {/* overlay text */}
                    <div className='absolute inset-0 flex items-center'>
                      <div className='mx-auto w-full max-w-screen-2xl px-4 md:px-6'>
                        <div className='max-w-xl'>
                          {p.title ? (
                            <h2 className='text-2xl font-bold leading-tight tracking-tight text-white drop-shadow md:text-3xl'>
                              {p.title}
                            </h2>
                          ) : null}
                          {p.subtitle ? <p className='mt-1 text-sm text-white/85 md:text-base'>{p.subtitle}</p> : null}
                          {p.ctaHref && p.ctaText ? (
                            <div className='pt-3'>
                              <Button
                                asChild
                                size='sm'
                                variant='secondary'
                                className='bg-white/20 text-white hover:bg-white/30'
                              >
                                <Link href={p.ctaHref}>{p.ctaText}</Link>
                              </Button>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* dots only */}
          {items.length > 1 && (
            <div className='absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2'>
              {scrollSnaps.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => emblaApi?.scrollTo(i)}
                  className={clsx(
                    'h-1.5 w-5 rounded-full transition-all',
                    i === selectedIndex ? 'bg-primary' : 'bg-white/40 hover:bg-white/70'
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
