'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { DepositCryptoFormData, DepositCryptoSchema } from '@/@core/utils/schema/Transaction/DepositCryptoSchema'
import { DepositFormData, DepositSchema } from '@/@core/utils/schema/Transaction/DepositSchema'
import { IconSize } from '@/components/atoms/Icons'
import IconDepositCrypto from '@/components/atoms/Icons/DepositCrypto'
import PresetAmountSelector from '@/components/molecules/PresetAmountSelector'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { thousandSeparatorComma, unformatCommaNumber } from '@/utils/helper/formatNumber'
import { useThemeToggle } from '@/utils/hooks/useTheme'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { DepositFormProps } from './types'
import PromotionSelector from '@/components/organisms/Promotion/SelectPromotion'
import { GetData } from '@/@core/hooks/use-query'

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
  features
}: DepositFormProps) {
  const { theme } = useThemeToggle()
  const [promo, setPromo] = useState<any>(selectedPromotion || null)
  const [showPassword, setShowPassword] = useState(false)

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
    defaultValues: {
      promo_id: ''
    }
  })

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

  const handleSubmit = (values: DepositFormData) => {
    onSubmit(values, activeTab)
  }

  return (
    <>
      {/* ⬇️ Use the handler here */}
      {/* <TabSwitcher tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} /> */}

      {activeTab === 'fiat' && (
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
      )}

      {activeTab === 'crypto' && (
        <Form {...formCrypto}>
          <form onSubmit={formCrypto.handleSubmit(values => onSubmit(values, 'crypto'))} className='space-y-6'>
            {/* (crypto selection fields commented out in your version) */}

            <div className='flex items-center justify-center w-full flex-col gap-2 pt-4'>
              <IconDepositCrypto size={IconSize['3xl']} theme={theme} />
              <span className='text-app-text-color text-sm w-[60%] text-center'>{lang?.common?.depositCryptoNote}</span>
            </div>

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
    </>
  )
}
