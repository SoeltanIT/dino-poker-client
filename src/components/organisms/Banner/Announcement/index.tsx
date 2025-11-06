'use client'

import clsx from 'clsx'
import { Volume2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

type Props = {
  /** Pesan tambahan setelah bagian “congratz …” */
  tailMessage?: string
  /** Daftar kandidat nama pemenang. Jika tidak diisi, akan generate random: USD1234 */
  winners?: string[]
  /** Durasi 1 siklus marquee dalam detik (semakin besar semakin lambat) */
  durationSec?: number
  className?: string
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomUSD(): string {
  // USD + 3–4 digit
  const n = Math.floor(100 + Math.random() * 9000) // 100..9999
  return `USD${n}`
}

/**
 * Announcement bar with marquee + dynamic winner name per cycle.
 * - Slower by default (28s)
 * - Winner name changes every cycle
 */
export default function Announcement({
  tailMessage = 'Remember to claim your daily point | Win more rewards every day!',
  winners,
  durationSec = 28,
  className
}: Props) {
  const initial = useMemo(() => (winners?.length ? pickRandom(winners) : randomUSD()), [winners])
  const [winner, setWinner] = useState(initial)

  // Ganti pemenang tiap 1 siklus marquee
  useEffect(() => {
    const id = setInterval(() => {
      setWinner(winners?.length ? pickRandom(winners) : randomUSD())
    }, Math.max(8, durationSec) * 1000) // jaga-jaga minimal 8s
    return () => clearInterval(id)
  }, [winners, durationSec])

  const text = `Congratz to ${winner} for winning jackpot KRW 1,000,000 | ${tailMessage}`

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
      <div className='relative ml-3 flex-1 overflow-hidden'>
        <div className='marquee whitespace-nowrap'>
          <span className='mr-10'>{text}</span>
          <span className='mr-10'>{text}</span>
          <span className='mr-10'>{text}</span>
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
