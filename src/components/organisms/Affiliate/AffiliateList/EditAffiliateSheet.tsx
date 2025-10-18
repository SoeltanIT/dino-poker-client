'use client'

import { Edit, Loader2 } from 'lucide-react'
import { ReactNode, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { useMutationQuery } from '@/@core/hooks/use-query'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { LangProps } from '@/types/langProps'
import { AffiliateListResponse } from '@/types/referralDTO'
import { thousandSeparatorComma, unformatCommaNumber } from '@/utils/helper/formatNumber'
import { toast, ToastContainer } from 'react-toastify'

interface EditAffiliateSheetProps {
  lang: LangProps
  affiliate: AffiliateListResponse['data'][0]
  trigger?: ReactNode
  onSuccess?: () => void
}

export default function EditAffiliateSheet({ lang, affiliate, trigger, onSuccess }: EditAffiliateSheetProps) {
  const [open, setOpen] = useState(false)

  const form = useForm({
    mode: 'onChange',
    defaultValues: {
      code_name: affiliate?.code_name || '',
      username: affiliate?.username || '',
      commission: affiliate?.commission || 0
    }
  })

  const { mutateAsync: updateAffiliate, isPending } = useMutationQuery<any, any>(
    ['getAffiliateList'],
    'patch',
    'json',
    true,
    lang?.common?.updateAffiliateSuccess || 'Affiliate updated successfully'
  )

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    try {
      const resp = await updateAffiliate({
        url: `/referral/shared-settings/${affiliate.id}`,
        body: {
          affiliate_share: Number(data?.commission) || 0
        }
      })
      if (resp?.status === 'success') {
        toast.success(lang?.common?.successUpdateAffiliate)
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
          <button className='bg-app-primary hover:bg-app-primary-hover text-white px-2 py-1 rounded-lg flex items-center gap-1 uppercase text-xs'>
            <Edit className='w-4 h-4' />
            {lang?.common?.edit || 'Edit'}
          </button>
        )}
      </SheetTrigger>
      <SheetContent className='w-full sm:max-w-md overflow-y-auto scrollbar-hide'>
        <ToastContainer position='top-right' />

        <div className='mb-8 mt-6 text-xl font-bold uppercase text-app-text-color'>
          {lang?.common?.editAffiliate || 'Edit Affiliate'}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* Code Name Field */}
            <FormField
              control={form.control}
              name='code_name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-app-text-color text-sm mb-2 block'>
                    {lang?.common?.codeName || 'Code Name'}
                    <span className='text-app-danger'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled
                      type='text'
                      placeholder={lang?.common?.codeNamePlaceholder || 'Enter code name'}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Username Field */}
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-app-text-color text-sm mb-2 block'>
                    {lang?.common?.username || 'Username'}
                    <span className='text-app-danger'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled
                      type='text'
                      placeholder={lang?.common?.usernamePlaceholder || 'Enter username'}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Commission Field */}
            <FormField
              control={form.control}
              name='commission'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-app-text-color text-sm mb-2 block'>
                    {lang?.common?.commission || 'Commission'} (%)
                    <span className='text-app-danger'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      ref={field.ref}
                      onBlur={field.onBlur}
                      placeholder={lang?.common?.commissionPlaceholder || 'Enter commission percentage'}
                      onChange={e => {
                        const raw = unformatCommaNumber(e.target.value)
                        if (/^\d*$/.test(raw)) field.onChange(raw)
                      }}
                      value={thousandSeparatorComma(field.value || '')}
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
