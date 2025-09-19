'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Resolver, SubmitHandler, useForm } from 'react-hook-form'

import { IconPassword } from '@/components/atoms/Icons'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { LangProps } from '@/types/langProps'
import { useMutationQuery } from '@/@core/hooks/use-query'
import { ChangePasswordSchema, ChangePasswordType } from '@/@core/utils/schema/ChangePassword/ChangePasswordSchema'
import { ToastContainer } from 'react-toastify'

export default function ChangePasswordForm({ lang }: { lang: LangProps }) {
  const typeOptions = [
    { label: lang?.common?.account, value: 'account' },
    { label: lang?.common?.transaction, value: 'transaction' }
  ]
  const [open, setOpen] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showRetypePassword, setShowRetypePassword] = useState(false)

  type FormType = ChangePasswordType
  type ResolverType = Resolver<FormType>

  const form = useForm<ChangePasswordType>({
    resolver: zodResolver(ChangePasswordSchema(lang)) as ResolverType,
    defaultValues: {
      type: '',
      currentPassword: '',
      newPassword: '',
      retypeNewPassword: ''
    }
  })

  const { mutateAsync: changePassword, isPending } = useMutationQuery<any, any>(
    ['changePassword'],
    'post',
    'json',
    true,
    lang?.common?.changePasswordSuccess
  )

  const onSubmit: SubmitHandler<FormType> = async (data: FormType) => {
    try {
      const resp = await changePassword({
        url: '/changePassword',
        body: {
          type: data?.type || '',
          old_password: data?.currentPassword || '',
          new_password: data?.newPassword || ''
        }
      })
      if (resp?.status === 'success') {
        // Handle form submission here
        // setOpen(false)
        form.reset()
      }
    } catch (error) {
      return
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div className='h-10 cursor-pointer flex items-center gap-[7px] hover:text-app-text-color'>
          <IconPassword />
          <span>{lang?.common?.changePassword}</span>
        </div>
      </SheetTrigger>
      <SheetContent className='w-full sm:max-w-md overflow-y-auto scrollbar-hide'>
      <ToastContainer position='top-right' />

        <div className='mb-8 mt-6 text-xl font-bold uppercase text-app-text-color'>{lang?.common?.changePassword}</div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-app-text-color text-sm mb-2 block'>
                    {lang?.common?.typePassword}
                    <span className='text-app-danger'>*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className='bg-app-white100 text-app-text-color'>
                        <SelectValue placeholder={lang?.common?.selectTypePassword} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className='bg-app-background-primary border border-app-neutral600'>
                      {typeOptions?.map(type => (
                        <SelectItem key={type?.value} value={type?.value} className='text-app-text-color'>
                          {type?.label}
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
              name='currentPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-app-text-color text-sm mb-2 block'>
                    {lang?.common?.currentPassword}
                    <span className='text-app-danger'>*</span>
                  </FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        type={showCurrentPassword ? 'text' : 'password'}
                        placeholder={lang?.common?.typeCurrentPassword}
                        className='pr-10'
                        {...field}
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? (
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

            <FormField
              control={form.control}
              name='newPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-app-text-color text-sm mb-2 block'>
                    {lang?.common?.newPassword}
                    <span className='text-app-danger'>*</span>
                  </FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder={lang?.common?.typeNewPassword}
                        className='pr-10'
                        {...field}
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
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

            <FormField
              control={form.control}
              name='retypeNewPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-app-text-color text-sm mb-2 block'>
                    {lang?.common?.retypeNewPassword}
                    <span className='text-app-danger'>*</span>
                  </FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        type={showRetypePassword ? 'text' : 'password'}
                        placeholder={lang?.common?.typeRetypeNewPassword}
                        className='pr-10'
                        {...field}
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                        onClick={() => setShowRetypePassword(!showRetypePassword)}
                      >
                        {showRetypePassword ? (
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

            <div className='pt-8'>
              <Button
                type='submit'
                disabled={isPending}
                className='w-full bg-app-primary uppercase hover:bg-app-primary-hover text-white py-4 text-lg font-medium rounded-lg transition-colors'
              >
                {isPending ? <Loader2 className='animate-spin' /> : lang?.common?.save}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
