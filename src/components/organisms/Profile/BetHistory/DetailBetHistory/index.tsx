'use client'

import { Sheet, SheetContent } from '@/components/ui/sheet'
import { DetailBetHistoryProps } from './types'
import { cn } from '@/lib/utils'

const getTextColor = (status?: string) => {
  if (status === 'won') return 'text-app-success'
  if (status === 'lost') return 'text-app-danger'
  if (status === 'pending') return 'text-app-accentYellow'
  return 'text-app-text-color'
}

export default function DetailBetHistory({ lang, detail, open, setOpen }: DetailBetHistoryProps) {
  // const [open, setOpen] = useState(false)

  const getStatusLabel = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'won':
        return lang?.common?.won || 'Won'
      case 'lost':
        return lang?.common?.lost || 'Lost'
      case 'pending':
        return lang?.common?.pending || 'Pending'
      default:
        return '-'
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side='right' className='w-full sm:max-w-md overflow-y-auto scrollbar-hide'>
        {/* Header */}
        <div className='flex items-center justify-between mt-6 mb-2'>
          <h1 className='text-xl uppercase font-bold text-app-text-color tracking-wide'>
            {lang?.common?.detailBetHistory}
          </h1>
        </div>

        {/* ID */}
        <div className='mb-6'>
          <p className='text-sm text-app-text-color'>ID: {detail?.id}</p>
        </div>

        <div className='mb-8'>
          <div className='space-y-4'>
            {/* Sport */}
            <div>
              <p className='text-sm text-app-neutral500 mb-1'>{lang?.common?.gameName}</p>
              <p className='text-app-text-color font-medium'>{detail?.game_name}</p>
            </div>

            {/* Tournament */}
            <div>
              <p className='text-sm text-app-neutral500 mb-1'>{lang?.common?.tournament}</p>
              <p className='text-app-text-color font-medium'>{detail?.tournament_name}</p>
            </div>

            {/* Match ID */}
            <div>
              <p className='text-sm text-app-neutral500 mb-1'>{lang?.common?.matchID}</p>
              <p className='text-app-text-color font-medium'>{detail?.match_id}</p>
            </div>

            {/* Teams */}
            <div>
              <p className='text-sm text-app-neutral500 mb-1'>{lang?.common?.teams}</p>
              <p className='text-app-text-color font-medium'>{detail?.teams}</p>
            </div>

            {/* Market D - Name */}
            {/* <div>
              <p className='text-sm text-app-neutral500 mb-1'>Market D - Name</p>
              <p className='text-app-text-color font-medium'>2 - Match winner - threeway</p>
            </div> */}

            {/* Selection */}
            <div>
              <p className='text-sm text-app-neutral500 mb-1'>{lang?.common?.selection}</p>
              <p className='text-app-text-color font-medium'>{detail?.selection}</p>
            </div>

            {/* Odds */}
            {/* <div>
              <p className='text-sm text-app-neutral500 mb-1'>Odds</p>
              <p className='text-app-text-color font-medium'>3.1</p>
            </div> */}

            {/* Status */}
            <div>
              <p className='text-sm text-app-neutral500 mb-1'>{lang?.common?.status}</p>
              <p className={cn('font-medium capitalize', getTextColor(detail?.status))}>
                {getStatusLabel(detail?.status)}
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
