'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

import { WithdrawCryptoFormData, WithdrawCryptoSchema } from '@/@core/utils/schema/Transaction/WithdrawCryptoSchema'
import { WithdrawFormData, WithdrawSchema } from '@/@core/utils/schema/Transaction/WithdrawSchema'
import { IconSize, IconVerifyCheck } from '@/components/atoms/Icons'
import KYC from '@/components/layout/header/views/menu/kyc/KYC'
import PresetAmountSelector from '@/components/molecules/PresetAmountSelector'
import { TabSwitcher } from '@/components/molecules/TabSwitcher'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { thousandSeparatorComma, unformatCommaNumber } from '@/utils/helper/formatNumber'
import { WithdrawFormProps } from '../types'

const PRESET_AMOUNTS = ['10000', '20000', '50000', '100000']
// const PRESET_AMOUNTS = ['10000', '20000', '50000', '100000', '500000', '1000000']

export default function WithdrawForm({
  onSubmit,
  lang,
  isStatus,
  isLoading,
  configData,
  isLoadingConfig,
  onClose,
  openContactUS,
  features,
  activeTab,
  setActiveTab,
  cryptoData,
  cryptoLoading,
  cryptoWithdrawFeeInfo,
  locale
}: WithdrawFormProps) {
  const [showAccountNumber, setShowAccountNumber] = useState(false)
  const [showWithdrawalPassword, setShowWithdrawalPassword] = useState(false)
  const [errMsgStatus, setErrMsgStatus] = useState(false)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const tabs = [
    { name: 'FIAT', value: 'fiat' },
    { name: 'CRYPTO', value: 'crypto' }
  ]

  let valueMax = thousandSeparatorComma(configData ?? 9000000)
  let descWithdraw = lang?.common?.minMaxAmount?.replace('MAX', valueMax)

  const form = useForm<WithdrawFormData>({
    resolver: zodResolver(WithdrawSchema(lang, Number(configData))),
    defaultValues: {
      amount: '',
      // bankName: '',
      // accountNumber: '',
      // nameOfWithdrawal: '',
      withdrawalPassword: ''
    }
  })

  const setPresetAmount = (amount: string) => {
    form.setValue('amount', amount)
  }

  // const handleSubmit = (values: WithdrawFormData) => {
  //   if (isStatus !== 'APPROVED') {
  //     setErrMsgStatus(true)
  //   } else {
  //     onSubmit(values)
  //     form.reset()
  //   }
  // }

  const msgVerifyStatus = (status: string) => {
    const stat = status.toLowerCase()
    switch (stat) {
      case 'unverified':
        return lang?.common.verifyCheckMsg
      case 'pending':
        return lang?.common.verifyPendingMsg
      case 'rejected':
        return lang?.common.verifyRejectedMsg
      default:
        return lang?.common.verifyCheckMsg
    }
  }

  const handleTabChange = (val: any) => {
    setActiveTab(val)
  }

  const formCrypto = useForm<WithdrawCryptoFormData>({
    resolver: zodResolver(WithdrawCryptoSchema(lang, Number(configData))),
    shouldUnregister: true,
    mode: 'onSubmit', // 👈 add this
    reValidateMode: 'onChange', // optional but nice: live update after first submit
    defaultValues: {
      crypto: 'USDT', // 👈 default to USDT
      coin_network: '',
      withdraw_address: '',
      withdrawalPassword: ''
    }
  })

  //=========== jika ingin pilih
  // current selected crypto symbol from form
  // const selectedCryptoSymbol = formCrypto.watch('crypto')

  // find the full crypto object for that symbol
  // const selectedCryptoData = cryptoData?.find((c: any) => c.symbol === selectedCryptoSymbol)

  // addresses for that crypto, fallback to []
  // const availableNetworks = selectedCryptoData?.addresses ?? []

  // useEffect(() => {
  //   // whenever crypto changes, reset coin_network
  //   formCrypto.setValue('coin_network', '', { shouldDirty: true })
  // }, [selectedCryptoSymbol, formCrypto])
  //=========== jika ingin pilih

  const usdt = useMemo(() => cryptoData?.find((c: any) => c.symbol === 'USDT' && c.is_active), [cryptoData])

  // force form value to USDT when available
  useEffect(() => {
    if (usdt && formCrypto.getValues('crypto') !== 'USDT') {
      formCrypto.setValue('crypto', 'USDT', { shouldDirty: false })
    }
  }, [usdt]) // eslint-disable-line react-hooks/exhaustive-deps

  // addresses for USDT only
  const availableNetworks = usdt?.addresses ?? []

  // reset network when USDT/addresses change
  useEffect(() => {
    formCrypto.setValue('coin_network', '', { shouldDirty: true })
  }, [usdt, formCrypto])

  return (
    <>
      {features?.crypto && <TabSwitcher tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />}
      {activeTab === 'fiat' &&
        (isStatus && isStatus !== 'APPROVED' ? (
          <div className='h-[70vh] flex flex-col justify-center items-center mt-10'>
            <IconVerifyCheck size={IconSize['3xl']} />
            <span className='text-sm font-semibold text-app-text-color text-center'>{msgVerifyStatus(isStatus)}</span>
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
                    <FormLabel className='text-app-text-color text-sm mb-2 block'>
                      {lang?.common?.withdrawAmount}
                      <span className='text-app-danger'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        ref={field.ref}
                        onBlur={field.onBlur}
                        type='text'
                        inputMode='numeric'
                        placeholder={lang?.common?.typeWithdrawAmount}
                        value={thousandSeparatorComma(field.value || '')}
                        onChange={e => {
                          const raw = unformatCommaNumber(e.target.value)
                          if (/^\d*$/.test(raw)) {
                            field.onChange(raw)
                          }
                        }}
                        // {...field}
                        // onChange={e => field.onChange(e.target.value)}
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
                    <p className='text-app-neutral500 text-xs'>{descWithdraw}</p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <FormField
            control={form.control}
            name='bankName'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-app-text-color text-sm mb-2 block'>
                  {lang?.common?.bankName}
                  <span className='text-app-danger'>*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className='bg-app-white100 text-app-text-color'>
                      <SelectValue placeholder={lang?.common?.selectBank} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className='bg-app-background-primary border border-app-neutral600'>
                    {bankOptions?.map(bank => (
                      <SelectItem key={bank?.value} value={bank?.value} className='text-app-text-color'>
                        {bank?.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='accountNumber'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-app-text-color text-sm mb-2 block'>
                  {lang?.common?.accountNumber}
                  <span className='text-app-danger'>*</span>
                </FormLabel>
                <FormControl>
                  <Input type='text' placeholder={lang?.common?.accountNumber} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='nameOfWithdrawal'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-app-text-color text-sm mb-2 block'>
                  {lang?.common?.nameOfWithdrawal}
                  <span className='text-app-danger'>*</span>
                </FormLabel>
                <FormControl>
                  <Input type='text' placeholder={lang?.common?.typeNameOfWithdrawal} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

              <FormField
                control={form.control}
                name='withdrawalPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-app-text-color'>
                      {lang?.common?.withdrawalPassword}
                      <span className='text-app-danger'>*</span>
                    </FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          type={showWithdrawalPassword ? 'text' : 'password'}
                          placeholder={lang?.common?.typeWithdrawalPassword}
                          className='pr-10'
                          {...field}
                        />
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                          onClick={() => setShowWithdrawalPassword(!showWithdrawalPassword)}
                        >
                          {showWithdrawalPassword ? (
                            <EyeOff className='h-4 w-4 text-app-neutral500' />
                          ) : (
                            <Eye className='h-4 w-4 text-app-neutral500' />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex flex-col pt-4'>
                {errMsgStatus && (
                  <span className='flex text-app-danger text-sm text-center mb-4'>{lang?.common?.cannotWithdraw}</span>
                )}
                <Button
                  type='submit'
                  disabled={isLoading}
                  className='w-full bg-app-primary uppercase hover:bg-app-primary-hover text-white py-4 text-lg font-medium rounded-lg transition-colors'
                >
                  {isLoading ? <Loader2 className='animate-spin' /> : lang?.common?.withdraw}
                </Button>
              </div>
            </form>
          </Form>
        ))}

      {activeTab === 'crypto' && (
        <Form {...formCrypto}>
          <form onSubmit={formCrypto.handleSubmit(values => onSubmit(values, 'crypto'))} className='space-y-6'>
            {/* 1. Select crypto */}
            {/* <FormField
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
            /> */}

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
                      onValueChange={field.onChange}
                      disabled // lock to USDT
                    >
                      <SelectTrigger className='bg-app-white100 text-app-text-color uppercase'>
                        <SelectValue placeholder={lang?.common?.selectCrypto} />
                      </SelectTrigger>
                      <SelectContent className='bg-app-background-primary'>
                        {cryptoLoading ? (
                          <SelectItem value='loading' disabled className='text-app-text-color uppercase'>
                            Loading Data...
                          </SelectItem>
                        ) : usdt ? (
                          <SelectItem value='USDT' className='text-app-text-color uppercase'>
                            USDT {usdt.name && usdt.name !== 'USDT' ? `(${usdt.name})` : ''}
                          </SelectItem>
                        ) : (
                          <SelectItem value='noUSDT' disabled className='text-app-text-color uppercase'>
                            {lang?.common?.noCryptoAvailable ?? 'USDT currently unavailable'}
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
            {/* <FormField
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
            /> */}

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
                    <Select value={field.value} onValueChange={field.onChange} disabled={!usdt || cryptoLoading}>
                      <SelectTrigger className='bg-app-white100 text-app-text-color uppercase'>
                        <SelectValue placeholder={lang?.common?.selectCoinNetwork} />
                      </SelectTrigger>
                      <SelectContent className='bg-app-background-primary'>
                        {!usdt ? (
                          <SelectItem value='noUSDT' disabled className='text-app-text-color uppercase'>
                            {lang?.common?.noCoinNetworkAvailable ?? 'USDT is not available'}
                          </SelectItem>
                        ) : availableNetworks.length === 0 ? (
                          <SelectItem value='noNet' disabled className='text-app-text-color uppercase'>
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

            <FormField
              control={formCrypto.control}
              name='amount_crypto'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-app-text-color text-sm mb-2 block'>
                    {lang?.common?.withdrawAmount}
                    <span className='text-app-danger'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      ref={field.ref}
                      onBlur={field.onBlur}
                      type='text'
                      inputMode='numeric'
                      placeholder={lang?.common?.typeWithdrawAmount}
                      value={thousandSeparatorComma(field.value || '')}
                      onChange={e => {
                        const raw = unformatCommaNumber(e.target.value)
                        if (/^\d*$/.test(raw)) {
                          field.onChange(raw)
                        }
                      }}
                      // {...field}
                      // onChange={e => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <PresetAmountSelector
                    isLoading={isLoadingConfig}
                    amounts={PRESET_AMOUNTS}
                    onSelect={amount => {
                      const currentAmount = Number(formCrypto.getValues('amount_crypto') || 0)
                      const addedAmount = Number(amount)
                      const newAmount = currentAmount + addedAmount
                      formCrypto.setValue('amount_crypto', newAmount.toString(), {
                        shouldDirty: true,
                        shouldValidate: true
                      })
                    }}
                  />
                  <p className='text-app-neutral500 text-xs'>{descWithdraw}</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formCrypto.control}
              name='withdraw_address'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-app-text-color'>
                    {lang?.common?.withdrawalAddress}
                    <span className='text-app-danger'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      placeholder={lang?.common?.typeWithdrawalAddress}
                      {...field}
                      onChange={e => {
                        // Remove spaces
                        const value = e.target.value.replace(/\s/g, '')
                        field.onChange(value)
                      }}
                      onPaste={e => {
                        // Block pasting spaces
                        const pasted = e.clipboardData.getData('text')
                        if (/\s/.test(pasted)) {
                          e.preventDefault()
                          field.onChange(pasted.replace(/\s/g, ''))
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formCrypto.control}
              name='withdrawalPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-app-text-color'>
                    {lang?.common?.withdrawalPassword}
                    <span className='text-app-danger'>*</span>
                  </FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        type={showWithdrawalPassword ? 'text' : 'password'}
                        placeholder={lang?.common?.typeWithdrawalPassword}
                        className='pr-10'
                        {...field}
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                        onClick={() => setShowWithdrawalPassword(!showWithdrawalPassword)}
                      >
                        {showWithdrawalPassword ? (
                          <EyeOff className='h-4 w-4 text-app-neutral500' />
                        ) : (
                          <Eye className='h-4 w-4 text-app-neutral500' />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {cryptoWithdrawFeeInfo && (
              <div className='flex items-center justify-center w-full flex-col gap-2'>
                <span className='text-app-text-color text-sm w-full text-left'>
                  **
                  {lang?.withdraw?.withdrawCryptoInfo
                    ?.replace('{value}', cryptoWithdrawFeeInfo?.value)
                    .replace('{base_coin}', cryptoWithdrawFeeInfo?.base_coin)}
                </span>
              </div>
            )}

            <div className=''>
              <Button
                type='submit'
                disabled={isLoading}
                className='w-full bg-app-primary uppercase hover:bg-app-primary-hover text-white py-4 text-lg font-medium rounded-lg transition-colors'
              >
                {isLoading ? <Loader2 className='animate-spin' /> : lang?.common?.withdraw}
              </Button>
            </div>
          </form>
        </Form>
      )}

      <KYC
        locale={locale}
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
