'use client'

import {
  UsernameAdjustmentFormData,
  usernameAdjustmentSchema
} from '@/@core/utils/schema/Adjustment/UsernameAdjustmentSchema'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LangProps } from '@/types/langProps'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'

export interface AdjustmentUsernameFormProps {
  lang: LangProps
}

export function AdjustmentUsernameForm({ lang }: AdjustmentUsernameFormProps) {
  const form = useForm<UsernameAdjustmentFormData>({
    resolver: zodResolver(usernameAdjustmentSchema(lang)),
    defaultValues: {
      username: ''
    }
  })
  const isLoading = false

  const onSubmit = form.handleSubmit(async (data: UsernameAdjustmentFormData) => {
    console.log(data)
  })

  return (
    <Card className='max-w-md mx-auto border border-app-neutral300'>
      <CardHeader>
        {/* <CardTitle>Update Your ID to English Characters</CardTitle> */}
        <CardTitle>{lang?.adjustment?.title}</CardTitle>
        <CardDescription>{lang?.adjustment?.description}</CardDescription>
      </CardHeader>
      <CardContent className='px-6 pb-6'>
        <div className='w-full'>
          <Form {...form}>
            <form className='space-y-6' onSubmit={onSubmit}>
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
              <Button
                type='submit'
                className='w-full bg-app-primary hover:bg-app-primary-hover text-white py-4 text-lg font-medium rounded-lg transition-colors'
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className='animate-spin' /> : lang?.common?.submit}
              </Button>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  )
}
