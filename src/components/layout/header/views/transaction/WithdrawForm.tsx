'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import PresetAmountSelector from '@/components/molecules/PresetAmountSelector'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { thousandSeparatorComma, unformatCommaNumber } from '@/utils/helper/formatNumber'
import { WithdrawFormProps } from './types'
import { WithdrawFormData, WithdrawSchema } from '@/@core/utils/schema/Transaction/WithdrawSchema'

const PRESET_AMOUNTS = ['10000', '20000', '50000', '100000']
// const PRESET_AMOUNTS = ['10000', '20000', '50000', '100000', '500000', '1000000']

export default function WithdrawForm({ onSubmit, lang, isStatus, isLoading }: WithdrawFormProps) {
  const [showAccountNumber, setShowAccountNumber] = useState(false)
  const [showWithdrawalPassword, setShowWithdrawalPassword] = useState(false)
  const [errMsgStatus, setErrMsgStatus] = useState(false)

  const form = useForm<WithdrawFormData>({
    resolver: zodResolver(WithdrawSchema(lang)),
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

  const handleSubmit = (values: WithdrawFormData) => {
    if (isStatus !== 'APPROVED') {
      setErrMsgStatus(true)
    } else {
      onSubmit(values)
      form.reset()
    }
  }

  return (
    <div className='space-y-6'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
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
                  amounts={PRESET_AMOUNTS}
                  onSelect={amount => {
                    const currentAmount = Number(form.getValues('amount') || 0)
                    const addedAmount = Number(amount)
                    const newAmount = currentAmount + addedAmount
                    form.setValue('amount', newAmount.toString())
                  }}
                />
                <p className='text-app-neutral500 text-xs'>{lang?.common?.minMaxAmount}</p>
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
    </div>
  )
}
