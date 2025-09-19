'use client'

import { useEffect, useState } from 'react'

interface CountdownTimerProps {
  expiresAt: string // UTC timestamp string from backend
}

export default function CountdownTimerCrypto({ expiresAt }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0) // in milliseconds

  useEffect(() => {
    const target = new Date(expiresAt).getTime()

    const update = () => {
      const now = Date.now()
      const diff = target - now
      setTimeLeft(Math.max(0, diff)) // never go below 0
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [expiresAt])

  const totalSeconds = Math.floor(timeLeft / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return (
    <div className='text-white text-lg tabular-nums'>
      {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
    </div>
  )
}
