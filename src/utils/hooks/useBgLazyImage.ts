// hooks/useBgLazyImage.ts
import { useEffect, useRef, useState } from 'react'

type Opts = { src: string; preview?: string; rootMargin?: string }

export function useBgLazyImage({ src, preview, rootMargin = '200px' }: Opts) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [bg, setBg] = useState(preview || '')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    let canceled = false
    const el = ref.current

    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()

        // preload & decode full image before swapping
        const img = new Image()
        img.decoding = 'async'
        img.src = src
        try {
          await img.decode()
        } catch {
          /* ignore */
        }
        if (!canceled) {
          setBg(src)
          setLoaded(true)
        }
      },
      { rootMargin }
    )

    io.observe(el)
    return () => {
      canceled = true
      io.disconnect()
    }
  }, [src, rootMargin])

  return { ref, bg, loaded }
}
