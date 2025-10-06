'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Edit, Loader2 } from 'lucide-react'
import { ReactNode, useState } from 'react'
import { Resolver, SubmitHandler, useForm } from 'react-hook-form'

import { useMutationQuery } from '@/@core/hooks/use-query'
import {
  ChangeSharedSettingSchema,
  ChangeSharedSettingType
} from '@/@core/utils/schema/ChangeSharedSetting/ChangeSharedSettingSchema'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { LangProps } from '@/types/langProps'
import { unformatCommaNumber } from '@/utils/helper/formatNumber'
import { ToastContainer } from 'react-toastify'

interface ChangeSharedSettingProps {
  lang: LangProps
  initialData?: {
    user_share?: number
    affiliate_share?: number
  }
  trigger?: ReactNode
  onSuccess?: () => void
}

export default function ChangeSharedSettingSheet({ lang, initialData, trigger, onSuccess }: ChangeSharedSettingProps) {
  const [open, setOpen] = useState(false)

  type FormType = ChangeSharedSettingType
  type ResolverType = Resolver<FormType>

  const form = useForm<ChangeSharedSettingType>({
    mode: 'onChange',
    resolver: zodResolver(ChangeSharedSettingSchema(lang)) as ResolverType,
    defaultValues: {
      user_share: initialData?.user_share || 0,
      affiliate_share: initialData?.affiliate_share || 0
    }
  })

  const { mutateAsync: updateSharedSetting, isPending } = useMutationQuery<any, any>(
    ['changeSharedSetting'],
    'put',
    'json',
    true,
    lang?.common?.changeSharedSettingsSuccess
  )

  const onSubmit: SubmitHandler<FormType> = async (data: FormType) => {
    try {
      const resp = await updateSharedSetting({
        url: '/referral/shared-settings',
        body: {
          user_share: data?.user_share || 0,
          affiliate_share: data?.affiliate_share || 0
        }
      })
      if (resp?.status === 'success') {
        // setOpen(false)
        form.reset() // Keep the submitted values as new defaults
        // onSuccess?.() // Trigger refetch or callback
      }
    } catch (error) {
      return
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={val => {
        setOpen(val)
        if (!val) {
          form.reset()
        }
      }}
    >
      <SheetTrigger asChild>
        {trigger || (
          <button className='bg-app-primary hover:bg-app-primary-hover text-white px-2 py-2 rounded-lg flex items-center gap-2 uppercase text-sm'>
            {lang?.common?.change || 'Change'}
            <Edit className='w-5 h-5' />
          </button>
        )}
      </SheetTrigger>
      <SheetContent className='w-full sm:max-w-md overflow-y-auto scrollbar-hide'>
        <ToastContainer position='top-right' />

        <div className='mb-8 mt-6 text-xl font-bold uppercase text-app-text-color'>
          {lang?.common?.changeSharedSettings || 'Change Shared Settings'}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* User Share Field */}
            <FormField
              control={form.control}
              name='user_share'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-app-text-color text-sm mb-2 block'>
                    User Share (%)
                    <span className='text-app-danger'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      inputMode='numeric'
                      placeholder='Enter user share percentage'
                      step={1}
                      {...field}
                      onChange={e => {
                        if (e.target.value === '0') {
                          field.onChange(0)
                          return
                        }
                        const raw = unformatCommaNumber(e.target.value)
                        const isNumber = /^\d*$/.test(raw)
                        if (isNumber) field.onChange(Number(raw))
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Affiliate Share Field */}
            <FormField
              control={form.control}
              name='affiliate_share'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-app-text-color text-sm mb-2 block'>
                    Affiliate Share (%)
                    <span className='text-app-danger'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      inputMode='numeric'
                      placeholder='Enter affiliate share percentage'
                      step={1}
                      {...field}
                      onChange={e => {
                        if (e.target.value === '0') {
                          field.onChange(0)
                          return
                        }
                        const raw = unformatCommaNumber(e.target.value)
                        const isNumber = /^\d*$/.test(raw)
                        if (isNumber) field.onChange(Number(raw))
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div>
              <Button
                type='submit'
                disabled={isPending}
                className='w-full bg-app-primary uppercase hover:bg-app-primary-hover text-white py-4 text-lg font-medium rounded-lg transition-colors'
              >
                {isPending ? <Loader2 className='animate-spin' /> : lang?.common?.save || 'Save'}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
