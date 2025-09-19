'use client'
import { useEffect, useState } from 'react'

export const CountdownTimer = () => {
  const [remaining, setRemaining] = useState(86400) // 24 hours

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatCountdown = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`
  }

  return formatCountdown(remaining)
}
