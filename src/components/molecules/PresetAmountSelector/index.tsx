'use client'

import { Button } from '@/components/ui/button'
import { thousandSeparatorComma } from '@/utils/helper/formatNumber'

interface PresetAmountSelectorProps {
  amounts: string[]
  onSelect: (amount: string) => void
  currencySymbol?: string
  className?: string
}

export default function PresetAmountSelector({
  amounts,
  onSelect,
  currencySymbol = '₩',
  className = ''
}: PresetAmountSelectorProps) {
  return (
    <div className={`flex gap-2 pt-1.5 w-full overflow-x-auto scrollbar-hide ${className}`}>
      {amounts.map(amount => (
        <Button
          key={amount}
          type='button'
          variant='outline'
          size='sm'
          onClick={() => onSelect(amount)}
          className='md:px-3 px-2 py-1 bg-app-white100 text-app-text-color md:text-sm text-xs rounded transition-colors whitespace-nowrap'
        >
          {currencySymbol}
          {thousandSeparatorComma(amount)}
        </Button>
      ))}
    </div>
  )
}
