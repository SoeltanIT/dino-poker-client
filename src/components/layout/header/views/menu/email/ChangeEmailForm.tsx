'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { IconEmail } from '@/components/atoms/Icons'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { LangProps } from '@/types/langProps'
import { toast, ToastContainer } from 'react-toastify'
import { ChangeEmailSchema, ChangeEmailType } from '@/@core/utils/schema/ChangeEmail/ChangeEmailSchema'

export default function ChangeEmailForm({ lang }: { lang: LangProps }) {
  const [open, setOpen] = useState(false)

  const form = useForm<ChangeEmailType>({
    resolver: zodResolver(ChangeEmailSchema),
    defaultValues: {
      currentEmail: '',
      newEmail: '',
      retypeNewEmail: ''
    }
  })

  function onSubmit(data: ChangeEmailType) {
    toast(`Your email has been updated to ${data.newEmail}`, {
      position: 'bottom-right',
      theme: 'dark'
    })
    // setOpen(false)
    form.reset()
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div className='h-10 cursor-pointer flex items-center gap-[7px] hover:text-app-text-color'>
          <IconEmail />
          <span>{lang?.common?.changeEmail}</span>
        </div>
      </SheetTrigger>
      <SheetContent className='w-full sm:max-w-md overflow-y-auto scrollbar-hide'>
      <ToastContainer position='top-right' />

        <div className='mb-8 mt-6 text-xl font-bold uppercase text-app-text-color'>{lang?.common?.changeEmail}</div>

        {/* Form - keep the existing form content exactly the same */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='currentEmail'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-app-text-color text-sm mb-2 block'>
                    {lang?.common?.currentEmail}
                    <span className='text-app-danger'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type='text' placeholder={lang?.common?.typeCurrentEmail} {...field} />
                  </FormControl>
                  <FormMessage className='text-app-danger' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='newEmail'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-app-text-color text-sm mb-2 block'>
                    {lang?.common?.newEmail}
                    <span className='text-app-danger'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type='text' placeholder={lang?.common?.typeNewEmail} {...field} />
                  </FormControl>
                  <FormMessage className='text-app-danger' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='retypeNewEmail'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-app-text-color text-sm mb-2 block'>
                    {lang?.common?.retypeNewEmail}
                    <span className='text-app-danger'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type='text' placeholder={lang?.common?.typeRetypeNewEmail} {...field} />
                  </FormControl>
                  <FormMessage className='text-app-danger' />
                </FormItem>
              )}
            />

            <div className='pt-8'>
              <Button
                type='submit'
                className='w-full bg-app-primary uppercase hover:bg-app-primary-hover text-white py-4 text-lg font-medium rounded-lg transition-colors'
              >
                {lang?.common?.save}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
