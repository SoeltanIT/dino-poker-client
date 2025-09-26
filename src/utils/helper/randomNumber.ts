'use client'

import { useEffect, useRef, useState } from 'react'

type Opts = {
  min?: number
  max?: number
  intervalMs?: number // base interval
  stepMin?: number
  stepMax?: number
}

/**
 * Super-light live counter:
 * - Initial value derived from seed (index)
 * - Tick every ~intervalMs + jitter
 * - Step is ±[stepMin..stepMax], clamped between [min..max]
 */
export function useRandomizeCount(seed: number, opts: Opts = {}) {
  const { min = 20, max = 700, intervalMs = 3000, stepMin = 1, stepMax = 3 } = opts

  // Cheap deterministic initial: spread seeds across range
  const range = Math.max(1, max - min)
  const initial = min + ((seed * 97) % range)

  const [count, setCount] = useState<number>(initial)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    // small jitter per card so they don’t tick in sync
    const jitter = (seed * 37) % 1500 // 0–1499 ms

    const tick = () => {
      setCount(prev => {
        const step = (Math.random() < 0.5 ? -1 : 1) * (stepMin + Math.floor(Math.random() * (stepMax - stepMin + 1)))

        let next = prev + step
        if (next < min) next = prev + Math.abs(step)
        if (next > max) next = prev - Math.abs(step)
        return next
      })
    }

    // first schedule after mount (avoid hydration issues)
    const id1 = window.setTimeout(() => {
      tick()
      timerRef.current = window.setInterval(tick, intervalMs + jitter) as any
    }, jitter)

    return () => {
      window.clearTimeout(id1)
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [intervalMs, max, min, seed, stepMax, stepMin])

  return count
}
