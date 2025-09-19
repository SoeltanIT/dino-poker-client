'use client'

import { LangProps } from '@/types/langProps'
import { useEffect, useState } from 'react'

interface CountdownTimerProps {
  endDate: string
  lang?: LangProps
}

interface TimeLeft {
  months: number
  days: number
  hours: number
  minutes: number
  expired: boolean
}

function calculateTimeLeft(endDate: string): TimeLeft {
  const now = new Date()
  const end = new Date(endDate)
  const diff = end.getTime() - now.getTime()

  if (diff <= 0) {
    return {
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      expired: true
    }
  }

  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const days = Math.floor((diff / (1000 * 60 * 60 * 24)) % 30)
  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30))

  return {
    months,
    days,
    hours,
    minutes,
    expired: false
  }
}

export default function CountdownTimerPromotion({ endDate, lang }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(endDate))

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(endDate))
    }, 60 * 1000) // update every minute

    return () => clearInterval(interval)
  }, [endDate])

  if (timeLeft?.expired) return <span className='text-app-danger font-medium'>{lang?.common?.ended}</span>

  return (
    <span className='font-medium'>
      {timeLeft?.months}
      {lang?.common?.months} : {timeLeft?.days}
      {lang?.common?.days} : {String(timeLeft?.hours).padStart(2, '0')}
      {lang?.common?.hours} : {String(timeLeft?.minutes).padStart(2, '0')}
      {lang?.common?.minutes}
    </span>
  )
}
