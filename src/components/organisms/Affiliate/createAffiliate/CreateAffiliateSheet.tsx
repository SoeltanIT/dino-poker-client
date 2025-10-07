'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, Plus } from 'lucide-react'
import { ReactNode, useState } from 'react'
import { Resolver, SubmitHandler, useForm } from 'react-hook-form'

import { GetData, useMutationQuery } from '@/@core/hooks/use-query'
import { CreateAffiliateSchema, CreateAffiliateType } from '@/@core/utils/schema/CreateAffiliate/CreateAffiliateSchema'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { LangProps } from '@/types/langProps'
import { ListMasterBankDTO } from '@/types/listMasterBankDTO'
import { ToastContainer } from 'react-toastify'

interface CreateAffiliateSheetProps {
  lang: LangProps
  trigger?: ReactNode
  onSuccess?: () => void
  parentCode?: string
}

export default function CreateAffiliateSheet({ lang, trigger, onSuccess, parentCode }: CreateAffiliateSheetProps) {
  const [open, setOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { data: respListMasterBank, isLoading } = GetData<ListMasterBankDTO[]>(
    '/listMasterBank', // hits your Next.js API route, not the real backend
    ['getListMasterBank']
  )

  type FormType = CreateAffiliateType
  type ResolverType = Resolver<FormType>

  const form = useForm<CreateAffiliateType>({
    resolver: zodResolver(CreateAffiliateSchema(lang)) as ResolverType,
    defaultValues: {
      code_name: '',
      username: '',
      password: '',
      bank_name: '',
      bank_account_number: '',
      parent_code: parentCode,
      commission: 0
    }
  })

  const { mutateAsync: createAffiliate, isPending } = useMutationQuery<any, any>(
    ['createAffiliate'],
    'post',
    'json',
    true,
    lang?.common?.affiliateCreatedSuccessfully || 'Affiliate created successfully'
  )

  const onSubmit: SubmitHandler<FormType> = async (data: FormType) => {
    try {
      const resp = await createAffiliate({
        url: '/affiliates',
        body: {
          code_name: data.code_name,
          username: data.username,
          password: data.password,
          bank_name: data.bank_name,
          bank_account_number: data.bank_account_number,
          parent_code: data.parent_code || '',
          commission: data.commission
        }
      })
      if (resp?.status === 'success') {
        setOpen(false)
        form.reset()
        onSuccess?.()
      }
    } catch (error) {
      return
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <button className='bg-app-primary hover:bg-app-primary-hover text-white px-4 py-2 rounded-lg flex items-center gap-2 uppercase text-sm'>
            <Plus className='w-5 h-5' />
            {lang?.common?.createAffiliate || 'Create Affiliate'}
          </button>
        )}
      </SheetTrigger>
      <SheetContent className='w-full sm:max-w-md overflow-y-auto scrollbar-hide'>
        <ToastContainer position='top-right' />

        <div className='mb-8 mt-6 text-xl font-bold uppercase text-app-text-color'>
          {lang?.common?.createAffiliate || 'Create Affiliate'}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* Code Name */}
            <FormField
              control={form.control}
              name='code_name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-app-text-color text-sm mb-2 block'>
                    Code Name
                    <span className='text-app-danger'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type='text' placeholder='Enter code name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Username */}
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-app-text-color text-sm mb-2 block'>
                    {lang?.common?.username}
                    <span className='text-app-danger'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type='text' placeholder={lang?.common?.typeUsername} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-app-text-color text-sm mb-2 block'>
                    {lang?.common?.password}
                    <span className='text-app-danger'>*</span>
                  </FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder={lang?.common?.typePassword}
                        className='pr-10'
                        {...field}
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
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

            {/* Bank Name */}
            <FormField
              control={form.control}
              name='bank_name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-app-text-color text-sm mb-2 block'>
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
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bank Account Number */}
            <FormField
              control={form.control}
              name='bank_account_number'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-app-text-color text-sm mb-2 block'>
                    {lang?.register?.accountNumber}
                    <span className='text-app-danger'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type='text' placeholder={lang?.common?.typeAccountNumber} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Parent Code */}
            <FormField
              control={form.control}
              name='parent_code'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-app-text-color text-sm mb-2 block'>
                    Parent Code <span className='text-app-placeholder text-xs'>({lang?.common?.optional})</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      placeholder='Enter parent code'
                      {...field}
                      readOnly={!!parentCode}
                      disabled={!!parentCode}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Commission */}
            <FormField
              control={form.control}
              name='commission'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-app-text-color text-sm mb-2 block'>
                    Commission (%)
                    <span className='text-app-danger'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Enter commission percentage'
                      min={0}
                      max={100}
                      step={1}
                      {...field}
                      onChange={e => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className='pt-8'>
              <Button
                type='submit'
                disabled={isPending}
                className='w-full bg-app-primary uppercase hover:bg-app-primary-hover text-white py-4 text-lg font-medium rounded-lg transition-colors'
              >
                {isPending ? <Loader2 className='animate-spin' /> : lang?.common?.create || 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
