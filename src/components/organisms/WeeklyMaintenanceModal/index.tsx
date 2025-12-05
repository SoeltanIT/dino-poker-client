'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface WeeklyMaintenanceModalProps {
  locale?: string
}

export function WeeklyMaintenanceModal({ locale }: WeeklyMaintenanceModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const checkMaintenanceSchedule = () => {
      // Check if user chose "Don't show today"
      const hideUntil = localStorage.getItem('hideMaintenanceUntil')
      if (hideUntil) {
        const hideDate = new Date(hideUntil)
        if (new Date() < hideDate) {
          return false
        }
      }

      const now = new Date()
      const day = now.getDay() // 0 = Sunday, 3 = Wednesday, 4 = Thursday
      const hours = now.getHours()
      const minutes = now.getMinutes()
      const currentTimeInMinutes = hours * 60 + minutes

      // Show from Wednesday 00:01 (day 3) to Thursday 12:00 (day 4)
      if (day === 3 && currentTimeInMinutes >= 1) {
        // Wednesday from 00:01 onwards
        return true
      } else if (day === 4 && hours < 12) {
        // Thursday before 12:00
        return true
      } else if (day === 4 && hours === 12 && minutes === 0) {
        // Thursday exactly at 12:00
        return true
      }

      return false
    }

    setIsOpen(checkMaintenanceSchedule())
  }, [])

  const handleDontShowToday = () => {
    // Set to hide until tomorrow at 00:00
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    localStorage.setItem('hideMaintenanceUntil', tomorrow.toISOString())
    setIsOpen(false)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const isKorean = locale === 'ko'

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className='m-0 border-0 p-0  overflow-hidden rounded-2xl shadow-2xl'>
        {/* Close button */}

        {/* Content */}
        <div className='flex flex-col items-center justify-center '>
          {/* Image */}
          <div className='w-[100%] h-[400px] md:w-full md:h-[500px] relative mx-auto'>
            <Image src='/images/banner-mt.avif' alt='Maintenance Banner' fill className=' object-cover ' priority />
          </div>

          {/* Buttons */}
          <div className='grid grid-cols-2 w-full md:mt-6'>
            {/* Button: Don't show today */}
            <button
              onClick={handleDontShowToday}
              className='px-6 py-3.5 bg-white text-gray-700 rounded-xl font-medium text-sm md:text-base hover:bg-gray-50 transition-all duration-200  shadow-sm active:scale-95'
            >
              {isKorean ? '오늘 하루 보지 않기' : "Don't show today"}
            </button>
            {/* Button: Close */}
            <button
              onClick={handleClose}
              className='px-6 py-3.5 bg-white text-gray-900 rounded-xl font-semibold text-sm md:text-base hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 shadow-md active:scale-95'
            >
              {isKorean ? '닫기' : 'Close'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
