'use client'

import { GetData } from '@/@core/hooks/use-query'
import { KYCSchemaStep2, KYCStep2FormData } from '@/@core/utils/schema/Registration/KYCSchema'
import { Button } from '@/components/ui/button'
import { CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ListMasterBankDTO } from '@/types/listMasterBankDTO'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Resolver, SubmitHandler, useForm } from 'react-hook-form'
import { KYCFormStepProps } from './types'

interface KYCFormStep2Props extends KYCFormStepProps {
  isPending: boolean
  onSubmit: (data: KYCStep2FormData) => void
}

export function KYCFormStep2({ lang, locale, isPending, onSubmit: _onSubmit }: KYCFormStep2Props) {
  const form = useForm<KYCStep2FormData>({
    resolver: zodResolver(KYCSchemaStep2(lang)) as Resolver<KYCStep2FormData>,
    defaultValues: {
      // transaction_password: '',
      // retype_transaction_password: '',
      bank_account_number: '',
      bank_name: '',
      consent: false
    }
  })

  const [showWithdrawalPassword, setShowWithdrawalPassword] = useState(false)
  const [showRetypeWithdrawalPassword, setShowRetypeWithdrawalPassword] = useState(false)

  const { data: respListMasterBank, isLoading } = GetData<ListMasterBankDTO[]>(
    '/listMasterBank', // hits your Next.js API route, not the real backend
    ['getListMasterBank']
  )

  const onSubmit: SubmitHandler<KYCStep2FormData> = (data: KYCStep2FormData) => {
    _onSubmit(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        {/* Bank Information */}
        <div className='space-y-6'>
          <p className='text-base font-semibold text-app-text-color mb-4'>{lang?.register?.bankInformation}</p>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-1 gap-4'>
              <FormField
                control={form.control}
                name='bank_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-app-text-color'>
                      {lang?.register?.bank}
                      <span className='text-app-danger'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className='bg-app-white100 text-app-text-color'>
                          <SelectValue placeholder={lang?.common?.selectBank} />
                        </SelectTrigger>
                        <SelectContent className='bg-app-background-primary'>
                          {respListMasterBank &&
                            (respListMasterBank.length > 0 ? (
                              respListMasterBank?.map((item: ListMasterBankDTO, index) => (
                                <SelectItem key={index} value={item.bank_name} className='text-app-text-color'>
                                  {item.bank_name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value='No Data Bank Available' disabled className='text-app-text-color'>
                                {lang?.common?.noBankAvailable || 'No banks available'}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className='text-app-danger' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='bank_account_number'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-app-text-color'>
                      {lang?.register?.accountNumber}
                      <span className='text-app-danger'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={lang?.common?.typeAccountNumber} />
                    </FormControl>
                    <FormMessage className='text-app-danger' />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </div>
        {/* Withdrawal Password */}
        {/* <div className='space-y-6'>
          <p className='text-base font-semibold text-app-text-color mb-4'>{lang?.common?.withdrawalSecurity}</p>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-1 gap-4'>
              <FormField
                control={form.control}
                name='transaction_password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-app-text-color'>
                      {lang?.register?.withdrawalPassword}
                      <span className='text-app-danger'>*</span>
                    </FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          {...field}
                          type={showWithdrawalPassword ? 'text' : 'password'}
                          placeholder={lang?.register?.placeholderWithdrawalPassword}
                          className='pr-10'
                        />
                        <button
                          type='button'
                          className='absolute right-0 top-0 h-full px-3 text-app-text-color'
                          onClick={() => setShowWithdrawalPassword(!showWithdrawalPassword)}
                        >
                          {showWithdrawalPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className='text-app-danger' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='retype_transaction_password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-app-text-color'>
                      {lang?.register?.retypeWithdrawalPassword}
                      <span className='text-app-danger'>*</span>
                    </FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          {...field}
                          type={showRetypeWithdrawalPassword ? 'text' : 'password'}
                          placeholder={lang?.register?.typeRetypeWithdrawPassword}
                          className='pr-10'
                        />
                        <button
                          type='button'
                          className='absolute right-0 top-0 h-full px-3 text-app-text-color'
                          onClick={() => setShowRetypeWithdrawalPassword(!showRetypeWithdrawalPassword)}
                        >
                          {showRetypeWithdrawalPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className='text-app-danger' />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </div> */}

        <FormField
          control={form.control}
          name='consent'
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel className='text-app-text-color font-medium'>{lang?.register?.consentForAdvertising}</FormLabel> */}
              <FormControl>
                <div className='flex items-start space-x-2 mt-2'>
                  <Checkbox
                    id='consent'
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className='mt-1 data-[state=checked]:bg-app-primary data-[state=checked]:border-app-primary'
                  />
                  <FormLabel htmlFor='consent' className='text-app-danger text-sm leading-relaxed'>
                    {lang?.common?.consentKYC}
                  </FormLabel>
                </div>
              </FormControl>
              <FormMessage className='text-app-danger' />
            </FormItem>
          )}
        />

        <div className='pt-8'>
          <Button
            type='submit'
            disabled={isPending}
            className='w-full bg-app-primary uppercase hover:bg-app-primary-hover text-white py-4 text-lg font-medium rounded-lg transition-colors'
          >
            {isPending ? <Loader2 className='animate-spin' /> : lang?.common?.verify}
          </Button>
        </div>
      </form>
    </Form>
  )
}
