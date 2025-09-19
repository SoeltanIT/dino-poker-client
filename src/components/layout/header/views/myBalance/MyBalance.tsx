'use client'

import { IconSouthKoreaFlag } from '@/components/atoms/Icons'
import { Card } from '@/components/ui/card'
import { thousandSeparatorComma } from '@/utils/helper/formatNumber'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { MyBalanceProps } from './types'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useMutationQuery } from '@/@core/hooks/use-query'

const tabs = ['ALL', 'FIAT', 'CRYPTO'] as const

interface Currency {
  id: string
  name: string
  code: string
  amount: string
  icon: React.ReactNode
  type: 'FIAT' | 'CRYPTO'
}

const currencies: Currency[] = [
  {
    id: 'KRW',
    name: 'South Korean Won',
    code: 'KRW',
    amount: '1,000',
    icon: <span className='text-xs'>🇰🇷</span>,
    type: 'FIAT'
  },
  {
    id: 'BTC',
    name: 'Bitcoin',
    code: 'BTC',
    amount: '100',
    icon: <span className='text-app-text-color text-xs'>₿</span>,
    type: 'CRYPTO'
  },
  {
    id: 'EOS',
    name: 'EOS',
    code: 'EOS',
    amount: '100',
    icon: <span className='text-app-text-color text-xs'>E</span>,
    type: 'CRYPTO'
  },
  {
    id: 'SOL',
    name: 'SOLANA',
    code: 'SOL',
    amount: '100',
    icon: <span className='text-black text-xs'>S</span>,
    type: 'CRYPTO'
  }
]

export default function MyBalance({ lang, locale, onClose, data }: MyBalanceProps) {
  const [showBalance, setShowBalance] = useState(true)
  const [showBonusBalance, setShowBonusBalance] = useState(true)
  const [activeTab] = useState<(typeof tabs)[number]>('ALL')
  const [selectedCurrency, setSelectedCurrency] = useState<string>('KRW')

  const selectedCurrencyData = currencies.find(c => c.id === selectedCurrency) || currencies[0]

  const { mutateAsync: transferBalance, isPending: isLoading } = useMutationQuery<any, any>(
    ['transferBalance'],
    'post',
    'json',
    true,
    lang?.common?.transferSucces,
    [['user', 'me'], ['getBalance']]
  )

  const getIconBackground = (currencyId: string) => {
    switch (currencyId) {
      case 'KRW':
        return 'bg-white'
      case 'BTC':
        return 'bg-[#F7931A]'
      case 'EOS':
        return 'bg-app-background-secondary'
      case 'SOL':
        return 'bg-[#14F195]'
      default:
        return 'bg-white'
    }
  }

  const moveBalance = async () => {
    try {
      const resp = await transferBalance({
        url: '/moveBalance'
      })
      if (resp?.status === 'success') {
        // console.log('resp >', resp)
      }
    } catch (error) {
      return
    }
  }

  return (
    <div className='mt-6'>
      {/* Header */}

      {/* Title */}
      <div className='flex items-center pb-6'>
        <div className='text-xl font-bold uppercase text-app-text-color'>{lang?.common?.myBalance ?? 'My Balance'}</div>
      </div>

      {/* Balance Card */}
      <Card className='bg-app-background-secondary rounded-xl p-3 mb-4'>
        <div className='flex flex-col space-y-2'>
          <div className='flex items-center justify-between'>
            <span className='text-sm text-app-neutral500'>{lang?.common?.totalMainBalance ?? 'Total Balance'}</span>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className='text-app-neutral500 hover:text-app-text-color'
            >
              {showBalance ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
            </button>
          </div>
          <div className='flex items-center space-x-2'>
            <div
              className={`w-6 h-6 rounded-full overflow-hidden ${getIconBackground(
                selectedCurrency
              )} flex items-center justify-center`}
            >
              <IconSouthKoreaFlag />
            </div>
            <div className='flex items-center gap-2'>
              <span
                className={cn(
                  `font-bold text-app-text-color flex gap-1.5`,
                  String(data?.balance)?.length > 7 ? 'text-lg' : 'text-2xl'
                )}
              >
                {data !== undefined && data !== null ? (
                  showBalance ? (
                    thousandSeparatorComma(Number(data?.balance))
                  ) : (
                    <span className='inline-flex gap-1 items-center'>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className='h-1.5 w-1.5 rounded-full bg-app-text-color' />
                      ))}
                    </span>
                  )
                ) : (
                  '0'
                )}
              </span>
              <span className='text-sm text-app-neutral500'>KRW</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Bonus Balance */}
      <Card className='bg-app-background-secondary rounded-xl p-3 mb-6'>
        <div className='flex flex-col space-y-2'>
          <div className='flex items-center justify-between'>
            <span className='text-sm text-app-neutral500'>{lang?.common?.totalBonusBalance ?? 'Total Balance'}</span>
            <button
              onClick={() => setShowBonusBalance(!showBonusBalance)}
              className='text-app-neutral500 hover:text-app-text-color'
            >
              {showBonusBalance ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
            </button>
          </div>
          <div className='flex flex-row items-center justify-between gap-2'>
            <div className='flex items-center space-x-2'>
              <div
                className={`w-6 h-6 rounded-full overflow-hidden ${getIconBackground(
                  selectedCurrency
                )} flex items-center justify-center`}
              >
                <IconSouthKoreaFlag />
              </div>
              <div className='flex items-center gap-2'>
                <span
                  className={cn(
                    `font-bold text-app-text-color flex gap-1.5`,
                    String(data?.bonus_balance)?.length > 7 ? 'text-lg' : 'text-2xl'
                  )}
                >
                  {data !== undefined && data !== null ? (
                    showBonusBalance ? (
                      thousandSeparatorComma(Number(data?.bonus_balance))
                    ) : (
                      <span className='inline-flex gap-1 items-center'>
                        {Array.from({ length: 5 }).map((_, index) => (
                          <div key={index} className='h-1.5 w-1.5 rounded-full bg-app-text-color' />
                        ))}
                      </span>
                    )
                  ) : (
                    '0'
                  )}
                </span>
                <span className='text-sm text-app-neutral500'>KRW</span>
              </div>
            </div>
            <Button
              size='sm'
              disabled={isLoading || data?.bonus_balance === 0}
              onClick={() => moveBalance()}
              className='flex bg-app-primary hover:bg-app-primary-hover text-white text-xs uppercase'
            >
              {lang?.common?.transfer}
            </Button>
          </div>
        </div>
      </Card>

      {/* Detail Title */}
      {/* <div className='flex items-center pb-6'>
        <div className='text-xl font-bold uppercase text-app-text-color'>
          {lang?.common?.balanceDetails ?? 'Balance Details'}
        </div>
      </div> */}

      {/* FIAT Section */}
      {/* <div className='mb-4'>
        <div className='bg-app-background-secondary rounded-xl p-3'>
          <h4 className='text-app-neutral500 text-sm mb-2'>FIAT</h4>
          {currencies
            .filter(currency => currency.type === 'FIAT')
            .map(currency => (
              <button
                key={currency.id}
                onClick={() => setSelectedCurrency(currency.id)}
                className='w-full flex items-center justify-between rounded-lg p-1 transition-colors'
              >
                <div className='flex items-center space-x-3'>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      selectedCurrency === currency.id ? 'bg-app-primary' : 'border border-app-neutral600'
                    }`}
                  ></div>
                  <div
                    className={`w-6 h-6 rounded-full overflow-hidden ${getIconBackground(
                      currency.id
                    )} flex items-center justify-center`}
                  >
                    {currency.icon}
                  </div>
                  <div className='text-left'>
                    <div className='text-xs text-app-neutral500'>{currency.code}</div>
                    <div className='text-app-text-color'>{currency.name}</div>
                  </div>
                </div>
                <div className='text-app-text-color font-medium'>{currency.amount}</div>
              </button>
            ))}
        </div>
      </div> */}
    </div>
  )
}
