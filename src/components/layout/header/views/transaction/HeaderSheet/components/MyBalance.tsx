'use client'

import { GetData, useMutationQuery } from '@/@core/hooks/use-query'
import { TransferBalanceFormData, TransferBalanceSchema } from '@/@core/utils/schema/Balance/TransferBalanceSchema'
import { IconSouthKoreaFlag } from '@/components/atoms/Icons'
import { TabSwitcher } from '@/components/molecules/TabSwitcher'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { thousandSeparatorComma, unformatCommaNumber } from '@/utils/helper/formatNumber'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Resolver, SubmitHandler, useForm } from 'react-hook-form'
import { MyBalanceProps } from '../types'
import { BalanceResponse } from '@/@core/interface/balance/Balance'

export default function MyBalance({ lang, locale, onClose, data, dataFee }: MyBalanceProps) {
  const [showBalance, setShowBalance] = useState(true)
  const [showBonusBalance, setShowBonusBalance] = useState(true)
  const [showIDNBalance, setShowIDNBalance] = useState(true)
  // const [activeTab] = useState<(typeof tabs)[number]>('ALL')
  const [selectedCurrency, setSelectedCurrency] = useState<string>('KRW')

  const [activeTab, setActiveTab] = useState('transferIn')
  const tabs = [
    { name: lang?.common?.transferIn, value: 'transferIn' },
    { name: lang?.common?.transferOut, value: 'transferOut' }
  ]

  const { mutateAsync: transferBalance, isPending: isLoading } = useMutationQuery<any, any>(
    ['transferBalance'],
    'post',
    'json',
    true,
    lang?.common?.transferSucces,
    [['user', 'me'], ['getBalance']]
  )

  const { mutateAsync: transferIDNBalance, isPending: isTransferLoading } = useMutationQuery<any, any>(
    ['transferIDNBalance'],
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

  type FormType = TransferBalanceFormData
  type ResolverType = Resolver<FormType>

  const form = useForm<TransferBalanceFormData>({
    resolver: zodResolver(TransferBalanceSchema(lang)) as ResolverType,
    defaultValues: {
      transfer: ''
    }
  })

  // nilai input (string) → angka; kosong = 0
  const transferStr = form.watch('transfer') || ''
  const amount = Number(transferStr || 0)

  // tab aktif
  const isDeposit = activeTab === 'transferIn'

  // dari API payload terbaru
  const rateNumber = Number(dataFee?.rate?.rate ?? 1) // Rate = 1 : rate
  const feePercent = useMemo(() => {
    if (!isDeposit) return 0 // untuk sekarang, fee hanya untuk Transfer IN
    const f = dataFee?.transfer_in_fee
    if (!f || !f.is_active) return 0
    return Number(f.value || 0) // selalu persen
  }, [isDeposit, dataFee])

  // per rumus mockup:
  const chip = isDeposit ? amount * rateNumber : 0
  const feeValueOnChip = isDeposit ? (chip * feePercent) / 100 : 0
  const netChip = isDeposit ? Math.max(chip - feeValueOnChip, 0) : 0

  // formatter (ubah jika butuh desimal)
  const fmt = (n: number) => thousandSeparatorComma(Math.floor(n))
  const moveIDNBalance: SubmitHandler<FormType> = async (data: FormType) => {
    const payload = {
      type: activeTab === 'transferIn' ? 'deposit' : 'withdraw',
      amount: Number(data?.transfer) ?? 0
    }

    try {
      const resp = await transferIDNBalance({
        url: '/transferIDNBalance',
        body: payload
      })
      if (resp?.message === 'success') {
        form.resetField('transfer', { defaultValue: '' }) // ✅ clear input after success
      }
    } catch (error) {
      return
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    form.reset({ transfer: '' }) // <- clears and resets touched/dirty
  }

  return (
    <div className='mt-6'>
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
              <span className='text-sm text-app-neutral500'>원</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Bonus Balance */}
      {data?.bonus_balance !== 0 && (
        <Card className='bg-app-background-secondary rounded-xl p-3 mb-4'>
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
                  <span className='text-sm text-app-neutral500'>원</span>
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
      )}

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

      <Card className='bg-app-background-secondary rounded-xl p-3 mb-4'>
        <div className='flex flex-col space-y-2'>
          <div className='flex items-center justify-between'>
            <span className='text-sm text-app-neutral500'>
              {lang?.common?.totalIDNBalance ?? 'Total IDN Poker Balance'}
            </span>
            <button
              onClick={() => setShowIDNBalance(!showIDNBalance)}
              className='text-app-neutral500 hover:text-app-text-color'
            >
              {showIDNBalance ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
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
                    String(data?.provider_balance)?.length > 7 ? 'text-lg' : 'text-2xl'
                  )}
                >
                  {data !== undefined && data !== null ? (
                    showIDNBalance ? (
                      thousandSeparatorComma(Number(data?.provider_balance))
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
                <span className='text-sm text-app-neutral500'>원</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <p className='text-xl font-semibold text-app-text-color mt-[54px] mb-6 uppercase'>{lang?.common?.convert}</p>

      <TabSwitcher tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />

      <span className='text-sm text-app-neutral500 mt-2'>
        {activeTab === 'transferIn' ? lang?.common?.transferInMsg : lang?.common?.transferOutMsg}
      </span>

      <Form {...form}>
        <form id='balance-form' onSubmit={form.handleSubmit(moveIDNBalance)} className='space-y-6 mt-6'>
          <FormField
            name='transfer'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-app-text-color'>
                  {lang?.common?.transferAmount}
                  <span className='text-app-danger'>*</span>
                </FormLabel>
                <FormControl>
                  <div className='flex gap-2'>
                    <Input
                      ref={field.ref}
                      onBlur={field.onBlur}
                      type='text'
                      inputMode='numeric'
                      placeholder={lang?.common?.typeAmount}
                      value={field.value === '' ? '' : thousandSeparatorComma(field.value)}
                      onChange={e => {
                        const raw = unformatCommaNumber(e.target.value)
                        if (/^\d*$/.test(raw)) field.onChange(raw)
                      }}
                      className='flex-1'
                    />
                    <Button
                      type='button'
                      variant='outline'
                      className='h-full bg-transparent border-app-neutral600 text-app-neutral500 hover:bg-gray-700 hover:text-white px-4'
                      onClick={() => {
                        // take balance from your props
                        const allBalance = (activeTab === 'transferIn' ? data?.balance : data?.provider_balance) ?? 0
                        form.setValue('transfer', String(allBalance), { shouldDirty: true, shouldTouch: true })
                      }}
                    >
                      ALL
                    </Button>
                  </div>
                </FormControl>
                <FormMessage className='text-app-danger' />
              </FormItem>
            )}
          />

          {/* ---- Summary (Rate, Chip, Fee, Net Chip) ---- */}
          {isDeposit && (
            <div className='gap-2 flex flex-col'>
              <div className='flex items-center justify-between'>
                <span className='text-app-neutral500 text-sm'>{lang?.common?.rate}</span>
                <span className='text-app-neutral500 text-sm font-semibold'>1 : {fmt(rateNumber)}</span>
              </div>

              <div className='flex items-center justify-between'>
                <span className='text-app-neutral500 text-sm'>{lang?.common?.chip}</span>
                <span className='text-app-neutral500 text-sm font-semibold'>{fmt(chip)}</span>
              </div>

              <div className='flex items-center justify-between'>
                <span className='text-app-neutral500 text-sm'>{lang?.common?.fee}</span>
                <span className='text-app-neutral500 text-sm font-semibold'>{isDeposit ? `${feePercent}%` : '0%'}</span>
              </div>

              <div className='flex items-center justify-between'>
                <span className='text-app-text-color text-base font-semibold'>{lang?.common?.netChip}</span>
                <span className='text-app-text-color text-base font-semibold'>{fmt(netChip)}</span>
              </div>
            </div>
          )}

          <div className='pt-2 pb-10'>
            <Button
              type='submit'
              disabled={isTransferLoading}
              className='w-full bg-app-primary uppercase hover:bg-app-primary-hover text-white py-4 text-lg font-medium rounded-lg transition-colors'
            >
              {isTransferLoading ? <Loader2 className='animate-spin' /> : lang?.common?.submit}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
