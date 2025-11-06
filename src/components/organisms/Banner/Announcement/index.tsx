'use client'

import clsx from 'clsx'
import { Volume2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type Props = {
  /** Durasi 1 siklus marquee dalam detik (semakin besar semakin lambat) */
  durationSec?: number
  className?: string
  announcement?: { title?: string }[]
}

/**
 * Announcement bar with marquee + dynamic winner name per cycle.
 * - Slower by default (28s)
 * - Winner name changes every cycle
 * - Only animates if content overflows container
 */
export default function Announcement({ durationSec = 28, announcement, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [shouldAnimate, setShouldAnimate] = useState(false)

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && contentRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        const contentWidth = contentRef.current.scrollWidth
        setShouldAnimate(contentWidth > containerWidth)
      }
    }

    checkOverflow()
    window.addEventListener('resize', checkOverflow)
    return () => window.removeEventListener('resize', checkOverflow)
  }, [announcement])
  return (
    <div
      className={clsx(
        'relative w-full overflow-hidden rounded-xl bg-app-primary400',
        'px-4 py-2 md:py-0', // md tanpa padding vertikal agar pas 60px
        'flex items-center h-full text-white',
        className
      )}
      aria-live='polite'
      style={
        {
          // kontrol kecepatan via CSS var
          ['--marquee-duration' as any]: `${durationSec}s`
        } as React.CSSProperties
      }
    >
      {/* icon */}
      <div className='shrink-0'>
        <Volume2 className='h-4 w-4 text-white' aria-hidden />
      </div>

      {/* marquee */}
      <div ref={containerRef} className='relative ml-3 flex-1 overflow-hidden'>
        <div ref={contentRef} className={clsx('whitespace-nowrap', shouldAnimate && 'marquee')}>
          {announcement?.map((item, index) => (
            <span className='mr-10' key={index}>
              {item.title}
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        .marquee {
          display: inline-block;
          min-width: 100%;
          animation: scroll-left var(--marquee-duration, 28s) linear infinite;
        }
        @keyframes scroll-left {
          from {
            transform: translateX(0%);
          }
          to {
            transform: translateX(-100%);
          }
        }
        /* pause when hover/focus */
        div:hover .marquee,
        div:focus-within .marquee {
          animation-play-state: paused;
        }
        /* respect user's reduced-motion preference */
        @media (prefers-reduced-motion: reduce) {
          .marquee {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </div>
  )
}
