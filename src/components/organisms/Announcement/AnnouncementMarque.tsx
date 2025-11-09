'use client'

import { Locale } from '@/i18n-config'
import { LangProps } from '@/types/langProps'
import clsx from 'clsx'
import { Volume2 } from 'lucide-react'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'

type Props = {
  /** Durasi 1 siklus marquee dalam detik (semakin besar semakin lambat) */
  durationSec?: number
  className?: string
  announcement?: { title?: string }[]
  locale?: Locale
  lang: LangProps
}

/**
 * AnnouncementMarque bar with marquee + dynamic winner name per cycle.
 * - Slower by default (28s)
 * - Winner name changes every cycle
 * - Only animates if content overflows container
 */
export default function AnnouncementMarque({ durationSec = 28, announcement, className, locale, lang }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [shouldAnimate, setShouldAnimate] = useState(false)

  const isEmpty = !announcement || announcement.length === 0
  const announcementsToRender = useMemo(
    () => (isEmpty ? [{ title: lang?.banner?.announcement ?? 'Incoming Announcement...' }] : announcement),
    [isEmpty, announcement, lang?.banner?.announcement]
  )
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
  }, [announcementsToRender])

  return (
    <div
      className={clsx(
        'relative w-full overflow-hidden rounded-xl bg-app-primary',
        'px-4 py-2 md:py-0',
        'flex items-center h-full text-white',
        className
      )}
      aria-live='polite'
      style={{ '--marquee-duration': `${durationSec}s` } as React.CSSProperties}
    >
      {/* icon */}
      <div className='shrink-0'>
        <Volume2 className='h-4 w-4 text-white' aria-hidden />
      </div>

      {/* marquee */}
      <div ref={containerRef} className='relative ml-3 flex-1 overflow-hidden'>
        <div
          ref={contentRef}
          className={clsx(
            'whitespace-nowrap font-notoSansKR inline-flex items-center gap-6',
            shouldAnimate && 'marquee'
          )}
        >
          {announcementsToRender?.map((item, index) => (
            <Fragment key={index}>
              <span>{item.title}</span>
              {index !== announcementsToRender.length - 1 && <span>|</span>}
            </Fragment>
          ))}
        </div>
      </div>

      <style jsx>{`
        .marquee {
          min-width: 100%;
          animation: scroll-left var(--marquee-duration, 30s) linear infinite;
        }
        @keyframes scroll-left {
          from {
            transform: translateX(0%);
          }
          to {
            transform: translateX(-100%);
          }
        }
        div:hover .marquee,
        div:focus-within .marquee {
          animation-play-state: paused;
        }
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
