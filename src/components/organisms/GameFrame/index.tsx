// components/organisms/GameFrame.tsx
'use client'

import { cn } from '@/lib/utils'
import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react'

type Props = {
  src?: string
  title?: string
  /** Space to subtract for your fixed header (px). Default 72. */
  headerOffsetPx?: number
  className?: string
  /** Only remount on major breakpoint/orientation changes (recommended) */
  remountOnResize?: boolean
}

export default function GameFrame({
  src,
  title = 'Game',
  headerOffsetPx = 72,
  className,
  remountOnResize = true
}: Props) {
  const [loaded, setLoaded] = useState(false)
  const [bpKey, setBpKey] = useState<string>('init')
  const [orientationKey, setOrientationKey] = useState<'portrait' | 'landscape'>('landscape')
  const containerRef = useRef<HTMLDivElement>(null)

  // Full viewport height minus header
  const style = useMemo<CSSProperties>(() => ({ height: `calc(100vh - ${headerOffsetPx}px)` }), [headerOffsetPx])

  // const style = useMemo<CSSProperties>(() => ({ height: `calc(100dvh - ${headerOffsetPx}px)` }), [headerOffsetPx])

  // Observe container width -> map to Tailwind breakpoints to generate a stable key
  // useEffect(() => {
  //   if (!remountOnResize) return
  //   const el = containerRef.current
  //   if (!el || typeof ResizeObserver === 'undefined') return

  //   const toBucket = (w: number) => (w < 640 ? 'sm' : w < 768 ? 'md' : w < 1024 ? 'lg' : w < 1280 ? 'xl' : '2xl')

  //   let raf = 0
  //   const ro = new ResizeObserver(entries => {
  //     const w = entries[0]?.contentRect?.width ?? window.innerWidth
  //     cancelAnimationFrame(raf)
  //     raf = requestAnimationFrame(() => setBpKey(toBucket(w)))
  //   })
  //   ro.observe(el)
  //   return () => {
  //     cancelAnimationFrame(raf)
  //     ro.disconnect()
  //   }
  // }, [remountOnResize])

  // Track orientation changes (some providers care a lot)
  // useEffect(() => {
  //   if (!remountOnResize || typeof window === 'undefined') return
  //   const mq = window.matchMedia('(orientation: portrait)')
  //   const update = () => setOrientationKey(mq.matches ? 'portrait' : 'landscape')
  //   update()
  //   mq.addEventListener?.('change', update)
  //   return () => mq.removeEventListener?.('change', update)
  // }, [remountOnResize])

  // Compose a key so iframe re-mounts only on meaningful layout changes
  // const frameKey = remountOnResize ? `${bpKey}-${orientationKey}` : 'static'

  // Optional: keep an internal src to avoid accidental reassign of same URL
  const [iframeSrc, setIframeSrc] = useState(src)
  useEffect(() => {
    if (src && src !== iframeSrc) setIframeSrc(src)
  }, [src, iframeSrc])

  return (
    <div
      ref={containerRef}
      className={cn(
        // Use w-full instead of w-screen to avoid horizontal scrollbars
        'relative w-full min-h-screen bg-black overflow-hidden',
        className
      )}
      style={style}
    >
      {!loaded && (
        <div className='absolute inset-0 grid place-items-center'>
          <div className='animate-spin rounded-full h-10 w-10 border-2 border-white/40 border-t-transparent' />
        </div>
      )}

      <iframe
        // key={frameKey} // ⬅️ forces re-layout on bp/orientation change
        src={iframeSrc}
        title={title}
        className='absolute inset-0 h-full w-full border-0'
        allow='autoplay; fullscreen; clipboard-read; clipboard-write; encrypted-media; microphone; camera; geolocation; payment'
        referrerPolicy='no-referrer' // leave off unless provider requires it
        allowFullScreen
        onLoad={() => setLoaded(true)}
      />
    </div>
    // <div
    //   ref={containerRef}
    //   className={cn('relative w-full min-h-screen bg-black overflow-hidden', className)}
    //   style={style}
    // >
    //   {!loaded && (
    //     <div className='absolute inset-0 grid place-items-center'>
    //       <div className='animate-spin rounded-full h-10 w-10 border-2 border-white/40 border-t-transparent' />
    //     </div>
    //   )}
    //   <iframe
    //     key={src} // only remount when the URL truly changes
    //     src={src}
    //     title={title}
    //     className='absolute inset-0 h-full w-full border-0'
    //     allow='autoplay; fullscreen; clipboard-read; clipboard-write; encrypted-media; microphone; camera; geolocation; payment'
    //     // referrerPolicy="no-referrer"  // comment out unless required
    //     allowFullScreen
    //     onLoad={() => setLoaded(true)}
    //   />
    // </div>
  )
}
