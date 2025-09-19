'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { toast } from 'react-toastify'

import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { Locale } from '@/i18n-config'

type DateRangePickerProps = {
  locale?: Locale
  labelFrom?: string
  labelTo?: string
  placeholder?: string
  onChange?: (range: { from: Date | undefined; to: Date | undefined }) => void
  initialFrom?: Date
  initialTo?: Date
  toastInfo?: string
}

export default function DateRangePicker({
  locale,
  labelFrom = 'Date From',
  labelTo = 'Date To',
  placeholder = 'Select date',
  onChange,
  initialFrom,
  initialTo,
  toastInfo
}: DateRangePickerProps) {
  const [dateFrom, setDateFrom] = useState<Date | undefined>(initialFrom)
  const [dateTo, setDateTo] = useState<Date | undefined>(initialTo)

  const [openFrom, setOpenFrom] = useState(false)
  const [openTo, setOpenTo] = useState(false)

  useEffect(() => {
    onChange?.({ from: dateFrom, to: dateTo })
  }, [dateFrom, dateTo, onChange])

  return (
    <div className='w-full md:w-[50%] flex flex-col md:flex-row gap-4'>
      {/* FROM */}
      <Popover open={openFrom} onOpenChange={setOpenFrom}>
        <PopoverTrigger asChild>
          <div className='flex flex-col w-full md:min-w-[25%] gap-2'>
            <span className='text-sm text-app-text-color'>{labelFrom}</span>
            <Button
              variant='outline'
              className={cn('!border-0 bg-app-background-secondary w-full text-left text-app-text-color font-normal')}
            >
              {dateFrom ? format(dateFrom, 'yyyy-MM-dd') : placeholder}
              <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            mode='single'
            required={false}
            locale={locale}
            captionLayout='dropdown'
            selected={dateFrom}
            onSelect={date => {
              setDateFrom(date)
              setOpenFrom(false) // ✅ close the popover
              if (dateTo && date && date > dateTo) {
                toast.info(toastInfo)
                setDateTo(undefined)
              }
            }}
            disabled={date => date > new Date()}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* TO */}
      <Popover open={openTo} onOpenChange={setOpenTo}>
        <PopoverTrigger asChild>
          <div className='flex flex-col w-full md:min-w-[25%] gap-2'>
            <span className='text-sm text-app-text-color'>{labelTo}</span>
            <Button
              variant='outline'
              className={cn('!border-0 bg-app-background-secondary w-full text-left text-app-text-color font-normal')}
            >
              {dateTo ? format(dateTo, 'yyyy-MM-dd') : placeholder}
              <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            mode='single'
            required={false}
            locale={locale}
            captionLayout='dropdown'
            selected={dateTo}
            onSelect={date => {
              setDateTo(date)
              setOpenTo(false) // ✅ close popover
            }}
            disabled={date => (!dateFrom ? date > new Date() : date < dateFrom || date > new Date())}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
