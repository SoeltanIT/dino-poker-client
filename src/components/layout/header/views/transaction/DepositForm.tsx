'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { GetData } from '@/@core/hooks/use-query'
import { DepositCryptoFormData, DepositCryptoSchema } from '@/@core/utils/schema/Transaction/DepositCryptoSchema'
import { DepositFormData, DepositSchema } from '@/@core/utils/schema/Transaction/DepositSchema'
import { IconAlert, IconSize, IconVerifyCheck } from '@/components/atoms/Icons'
import KYC from '@/components/layout/header/views/menu/kyc/KYC'
import PresetAmountSelector from '@/components/molecules/PresetAmountSelector'
import { TabSwitcher } from '@/components/molecules/TabSwitcher'
import PromotionSelector from '@/components/organisms/Promotion/SelectPromotion'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { thousandSeparatorComma, unformatCommaNumber } from '@/utils/helper/formatNumber'
import { useThemeToggle } from '@/utils/hooks/useTheme'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { DepositFormProps } from './types'

const PRESET_AMOUNTS = ['10000', '20000', '50000', '100000']

export default function DepositForm({
  onSubmit,
  lang,
  locale,
  isLoading,
  selectedPromotion,
  activeTab,
  setActiveTab,
  configData,
  isLoadingConfig,
  features,
  isStatus,
  onClose,
  openContactUS,
  cryptoData,
  cryptoLoading
}: DepositFormProps) {
  const { theme } = useThemeToggle()
  const [promo, setPromo] = useState<any>(selectedPromotion || null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const tabs = [
    { name: 'FIAT', value: 'fiat' },
    { name: 'CRYPTO', value: 'crypto' }
  ]

  const { data: respPromo, isLoading: promoLoading } = GetData<any>(
    '/promotion',
    ['getPromotion'],
    false,
    undefined,
    true,
    undefined,
    undefined,
    undefined,
    'GET',
    undefined,
    'promotion'
  )

  let valueMax = thousandSeparatorComma(configData ?? 9000000)
  let descDeposit = lang?.common?.minMaxAmount?.replace('MAX', valueMax)

  const form = useForm<DepositFormData>({
    resolver: zodResolver(DepositSchema(lang, Number(configData))),
    shouldUnregister: true,
    defaultValues: {
      amount: '',
      account: '',
      promo_id: ''
    }
  })

  const formCrypto = useForm<DepositCryptoFormData>({
    resolver: zodResolver(DepositCryptoSchema(lang)),
    shouldUnregister: true,
    mode: 'onSubmit', // 👈 add this
    reValidateMode: 'onChange', // optional but nice: live update after first submit
    defaultValues: {
      promo_id: '',
      crypto: '',
      coin_network: ''
    }
  })

  // current selected crypto symbol from form
  const selectedCryptoSymbol = formCrypto.watch('crypto')

  // find the full crypto object for that symbol
  const selectedCryptoData = cryptoData?.find((c: any) => c.symbol === selectedCryptoSymbol)

  // addresses for that crypto, fallback to []
  const availableNetworks = selectedCryptoData?.addresses ?? []

  useEffect(() => {
    // whenever crypto changes, reset coin_network
    formCrypto.setValue('coin_network', '', { shouldDirty: true })
  }, [selectedCryptoSymbol, formCrypto])

  // ✅ Keep initial selectedPromotion (if provided on mount)
  useEffect(() => {
    if (selectedPromotion) {
      setPromo(selectedPromotion)
      form.setValue('promo_id', selectedPromotion.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ✅ Option A — explicit tab change handler
  const handleTabChange = (val: any) => {
    setActiveTab(val)
    // Clear promotion selection in UI
    setPromo(null)
    // Clear promo_id in BOTH forms to avoid carry-over
    form.setValue('promo_id', '', { shouldValidate: true, shouldDirty: true })
    formCrypto.setValue('promo_id', '', { shouldValidate: true, shouldDirty: true })
  }

  const msgVerifyStatusDeposit = (status: string) => {
    const stat = status.toLowerCase()
    switch (stat) {
      case 'unverified':
        return lang?.common.verifyCheckMsgDeposit
      case 'pending':
        return lang?.common.verifyPendingMsgDeposit
      case 'rejected':
        return lang?.common.verifyRejectedMsgDeposit
      default:
        return lang?.common.verifyCheckMsgDeposit
    }
  }

  return (
    <>
      {/* ⬇️ Use the handler here */}
      {features?.crypto && <TabSwitcher tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />}

      {activeTab === 'fiat' &&
        (isStatus && isStatus !== 'APPROVED' ? (
          <div className='h-[70vh] flex flex-col justify-center items-center mt-10'>
            <IconVerifyCheck size={IconSize['3xl']} />
            <span className='text-sm font-semibold text-app-text-color text-center'>
              {msgVerifyStatusDeposit(isStatus)}
            </span>
            {isStatus === 'PENDING' || isStatus === 'REJECTED' ? (
              <Button
                onClick={() => openContactUS()}
                className='w-full bg-app-primary uppercase hover:bg-app-primary-hover mt-4 text-white py-4 text-base font-medium rounded-lg transition-colors'
              >
                {lang?.common?.contactUS}
              </Button>
            ) : (
              isStatus === 'UNVERIFIED' && (
                <div className='pt-4'>
                  <Button
                    onClick={() => setIsSheetOpen(true)}
                    className='w-full bg-app-primary uppercase hover:bg-app-primary-hover text-white py-4 text-base font-medium rounded-lg transition-colors'
                  >
                    {lang?.common?.verify}
                  </Button>
                </div>
              )
            )}
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(values => onSubmit(values, 'fiat'))} className='space-y-6'>
              <FormField
                control={form.control}
                name='amount'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-app-text-color text-sm block'>
                      {lang?.common?.depositAmount}
                      <span className='text-app-danger'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        ref={field.ref}
                        onBlur={field.onBlur}
                        type='text'
                        inputMode='numeric'
                        placeholder={lang?.common?.typeDepositAmount}
                        value={thousandSeparatorComma(field.value || '')}
                        onChange={e => {
                          const raw = unformatCommaNumber(e.target.value)
                          if (/^\d*$/.test(raw)) field.onChange(raw)
                        }}
                      />
                    </FormControl>

                    <PresetAmountSelector
                      isLoading={isLoadingConfig}
                      amounts={PRESET_AMOUNTS}
                      onSelect={amount => {
                        const currentAmount = Number(form.getValues('amount') || 0)
                        const addedAmount = Number(amount)
                        const newAmount = currentAmount + addedAmount
                        form.setValue('amount', newAmount.toString(), { shouldDirty: true, shouldValidate: true })
                      }}
                    />

                    <p className='text-app-neutral500 text-xs'>{descDeposit}</p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='pt-4'>
                {features?.promotion && (
                  <PromotionSelector
                    selectedPromotion={promo}
                    onSelect={p => {
                      setPromo(p)
                      form.setValue('promo_id', p?.id ?? '', { shouldValidate: true, shouldDirty: true })
                    }}
                    lang={lang}
                    initialData={respPromo}
                    isLoading={promoLoading}
                  />
                )}
                <Button
                  type='submit'
                  disabled={isLoading}
                  className='w-full bg-app-primary uppercase hover:bg-app-primary-hover text-white py-4 text-lg font-medium rounded-lg transition-colors'
                >
                  {isLoading ? <Loader2 className='animate-spin' /> : lang?.common?.deposit}
                </Button>
              </div>
            </form>
          </Form>
        ))}

      {activeTab === 'crypto' && (
        <Form {...formCrypto}>
          <form onSubmit={formCrypto.handleSubmit(values => onSubmit(values, 'crypto'))} className='space-y-6'>
            {/* 1. Select crypto */}
            <FormField
              control={formCrypto.control}
              name='crypto'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-app-text-color'>
                    {lang?.common?.selectCrypto}
                    <span className='text-app-danger'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={val => {
                        field.onChange(val)
                      }}
                      disabled={cryptoLoading}
                    >
                      <SelectTrigger className='bg-app-white100 text-app-text-color uppercase'>
                        <SelectValue placeholder={lang?.common?.selectCrypto} />
                      </SelectTrigger>
                      <SelectContent className='bg-app-background-primary'>
                        {cryptoLoading ? (
                          <SelectItem value='loading' disabled className='text-app-text-color uppercase'>
                            Loading Data...
                          </SelectItem>
                        ) : cryptoData && cryptoData.length > 0 ? (
                          cryptoData
                            .filter((item: any) => item?.is_active)
                            .map((item: any) => (
                              <SelectItem
                                key={item.symbol}
                                value={item.symbol}
                                className='text-app-text-color uppercase'
                              >
                                {item.symbol} {item.name && item.name !== item.symbol ? `(${item.name})` : ''}
                              </SelectItem>
                            ))
                        ) : (
                          <SelectItem value='noDataCryptoAvailable' disabled className='text-app-text-color uppercase'>
                            {lang?.common?.noCryptoAvailable}
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 2. Select network */}
            <FormField
              control={formCrypto.control}
              name='coin_network'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-app-text-color'>
                    {lang?.common?.selectCoinNetwork}
                    <span className='text-app-danger'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={val => {
                        field.onChange(val)
                      }}
                      disabled={!selectedCryptoSymbol || cryptoLoading}
                    >
                      <SelectTrigger className='bg-app-white100 text-app-text-color uppercase'>
                        <SelectValue placeholder={lang?.common?.selectCoinNetwork} />
                      </SelectTrigger>
                      <SelectContent className='bg-app-background-primary'>
                        {!selectedCryptoSymbol ? (
                          <SelectItem value='pickCryptoFirst' disabled className='text-app-text-color uppercase'>
                            {lang?.common?.selectCryptoFirst ?? 'Select crypto first'}
                          </SelectItem>
                        ) : availableNetworks.length === 0 ? (
                          <SelectItem value='noCoinNetworkAvailable' disabled className='text-app-text-color uppercase'>
                            {lang?.common?.noCoinNetworkAvailable}
                          </SelectItem>
                        ) : (
                          availableNetworks.map((net: any) => (
                            <SelectItem
                              key={net.blockchain_id}
                              value={String(net.blockchain_id)}
                              className='text-app-text-color uppercase'
                            >
                              {net.blockchain_name} {net.blockchain_id ? `(${net.blockchain_id})` : ''}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedCryptoSymbol && (
              <div className='flex flex-row items-center gap-2 px-4 py-[10px] bg-[#FDB42C1A] rounded-lg'>
                <IconAlert className='min-w-[24px] min-h-[24px] text-app-pending' />
                <span className='text-sm text-app-text-color'>{lang?.common?.cryptoNotes}</span>
              </div>
            )}

            {/* <div className='flex items-center justify-center w-full flex-col gap-2 pt-4'>
              <IconDepositCrypto size={IconSize['3xl']} theme={theme} />
              <span className='text-app-text-color text-sm w-[60%] text-center'>{lang?.common?.depositCryptoNote}</span>
            </div> */}

            <div className='pt-4'>
              {features?.promotion && (
                <PromotionSelector
                  selectedPromotion={promo}
                  onSelect={p => {
                    setPromo(p)
                    formCrypto.setValue('promo_id', p?.id ?? '', { shouldValidate: true, shouldDirty: true })
                  }}
                  lang={lang}
                  initialData={respPromo}
                  isLoading={promoLoading}
                />
              )}

              <Button
                type='submit'
                disabled={isLoading}
                className='w-full bg-app-primary uppercase hover:bg-app-primary-hover text-white py-4 text-lg font-medium rounded-lg transition-colors'
              >
                {isLoading ? <Loader2 className='animate-spin' /> : lang?.common?.deposit}
              </Button>
            </div>
          </form>
        </Form>
      )}

      <KYC
        open={isSheetOpen}
        onClose={() => {
          setIsSheetOpen(false), onClose()
        }}
        lang={lang}
        isStatus={isStatus}
      />
    </>
  )
}
