'use client'

import { GetData, useMutationQuery } from '@/@core/hooks/use-query'
import { UserMeResponse } from '@/@core/interface/User'
import { AdjustmentFormData, adjustmentSchema } from '@/@core/utils/schema/Adjustment/AdjustmentSchema'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LangProps } from '@/types/langProps'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useForm } from 'react-hook-form'

export interface AdjustmentUsernameFormProps {
  lang: LangProps
  locale: Locale
}

export function AdjustmentUsernameForm({ lang, locale }: AdjustmentUsernameFormProps) {
  const { data: userData, isLoading: userDataLoading } = GetData<UserMeResponse>(
    '/me', // hits your Next.js API route, not the real backend
    ['user', 'me'],
    false,
    undefined,
    true
  )
  const user = userData?.data
  const form = useForm<AdjustmentFormData>({
    resolver: zodResolver(adjustmentSchema(lang)),
    defaultValues: {
      username: '',
      nickname: ''
    }
  })

  const { mutateAsync: updateUser, isPending } = useMutationQuery<any, any>(
    ['userUpdate'],
    'put',
    'json',
    true,
    lang?.adjustment?.success,
    [['user', 'me']]
  )

  const onSubmit = form.handleSubmit(async (data: AdjustmentFormData) => {
    try {
      const resp = await updateUser({
        url: '/user/update',
        body: data
      })
      if (resp?.status === 'success') {
        await signOut({ callbackUrl: `/${locale}` })
      }
    } catch (error) {
      return
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <Card className='max-w-md mx-auto border border-app-borderDefault'>
          <CardHeader>
            <CardTitle>{lang?.adjustment?.id?.title}</CardTitle>
            <CardDescription>{lang?.adjustment?.id?.description}</CardDescription>
          </CardHeader>
          <CardContent className='px-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='col-span-1'>
                <Label>{lang?.adjustment?.currentUsername}</Label>
                <Input type='text' value={user?.username} disabled className='w-full mt-2' />
              </div>
              <div className='col-span-1'>
                <FormField
                  control={form.control}
                  name='username'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{lang?.register?.username}</FormLabel>
                      <FormControl>
                        <Input type='text' placeholder={lang?.register?.placeholderUsername} {...field} />
                      </FormControl>
                      <FormMessage className='text-app-danger' />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
          <div className='border-t border-app-borderDefault mt-6' />
          <CardHeader>
            <CardTitle>{lang?.adjustment?.nickname?.title}</CardTitle>
            <CardDescription>{lang?.adjustment?.nickname?.description}</CardDescription>
          </CardHeader>
          <CardContent className='px-6'>
            <FormField
              control={form.control}
              name='nickname'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{lang?.register?.nickname}</FormLabel>
                  <FormControl>
                    <Input type='text' placeholder={lang?.register?.placeholderNickname} {...field} />
                  </FormControl>
                  <FormMessage className='text-app-danger' />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className='mt-6'>
            <Button
              type='submit'
              className='w-full bg-app-primary hover:bg-app-primary-hover text-white py-4 text-lg font-medium rounded-lg transition-colors'
              disabled={isPending}
            >
              {isPending ? <Loader2 className='animate-spin' /> : lang?.common?.save}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
