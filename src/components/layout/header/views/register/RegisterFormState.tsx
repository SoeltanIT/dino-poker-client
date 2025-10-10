'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { getSession, signIn } from 'next-auth/react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useCookies } from 'react-cookie'
import { Resolver, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import { useMutationQuery } from '@/@core/hooks/use-query'
import { RegistrationFormData, registrationSchema } from '@/@core/utils/schema/Registration/RegistrationSchema'
import { Button } from '@/components/ui/button'
import { CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Locale } from '@/i18n-config'
import { LangProps } from '@/types/langProps'
import { Eye, EyeOff } from 'lucide-react'

type RegisterFormProps = {
  lang: LangProps
  locale?: Locale
  open: boolean
  setOpen: (val: boolean) => void
}

export default function RegisterForm({ lang, locale, open, setOpen }: RegisterFormProps) {
  const pathname = usePathname()
  const router = useRouter()
  const queryClient = useQueryClient()
  const searchParams = useSearchParams()
  const referral = searchParams.get('referral')
  const [cookies, setCookie] = useCookies(['_authorization'])

  const [showPassword, setShowPassword] = useState(false)
  const [showRetypePassword, setShowRetypePassword] = useState(false)
  // removed withdrawal password toggles

  type FormType = RegistrationFormData
  type ResolverType = Resolver<FormType>
  type RegistrationPayload = {
    email: string
    username: string
    password: string
    referral_code?: string
    consent: boolean
    roles: string | undefined
    language: string
  }

  const { mutateAsync: registerUser, isPending } = useMutationQuery<RegistrationPayload, any>(
    ['getuserregister'],
    'post',
    'json',
    true,
    lang?.register?.registerSuccessfully
  )

  const form = useForm<FormType>({
    resolver: zodResolver(registrationSchema(lang)) as ResolverType,
    defaultValues: {
      email: '',
      username: '',
      password: '',
      retypePassword: '',
      referral_code: referral ?? '',
      consent: false,
      roles: '2'
    }
  })

  const onSubmit: SubmitHandler<FormType> = async data => {
    const payload: RegistrationPayload = {
      email: data.email,
      username: data.username,
      password: data.password,
      referral_code: data.referral_code || undefined,
      consent: data.consent,
      roles: data.roles,
      language: 'en'
    }

    try {
      const resp = await registerUser({ url: '/register', body: payload })
      if (resp?.status === 'success') {
        const res = await signIn('credentials', {
          redirect: false,
          username: data.username,
          password: data.password
        })

        if (res?.ok) {
          const session = await getSession()
          const token = session?.accessToken
          if (token) {
            setCookie('_authorization', token, {
              path: '/',
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              maxAge: 86400
            })

            await queryClient.invalidateQueries({ queryKey: ['user', 'me'] })
            await queryClient.invalidateQueries({ queryKey: ['getBalance'] })

            setOpen(false)
            form.reset()
            pathname === `/${locale}` ? window.location.reload() : router.push(`/${locale}`)
          }
        } else {
          throw new Error('Login failed')
        }
      } else {
        throw new Error('Registration failed')
      }
    } catch {
      setOpen(false)
      form.reset()
      toast.error(`Login Failed. Try again`)
      router.push(`/${locale}`)
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className='w-full sm:max-w-md overflow-y-auto scrollbar-hide'>
        <div className='mt-6 text-xl font-bold uppercase text-app-text-color'>{lang?.common?.register}</div>
        <p className='text-app-text-color text-base mb-8'>{lang?.register?.subTitleRegister}</p>

        <Form {...form}>
          <form id='register-form' onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* Username */}
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-app-text-color'>
                    {lang?.register?.username}
                    <span className='text-app-danger'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={lang?.register?.placeholderUsername} />
                  </FormControl>
                  <FormMessage className='text-app-danger' />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-app-text-color'>
                    {lang?.register?.password}
                    <span className='text-app-danger'>*</span>
                  </FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        placeholder={lang?.register?.placeholderPassword}
                        className='pr-10'
                      />
                      <button
                        type='button'
                        className='absolute right-0 top-0 h-full px-3 text-app-text-color'
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className='text-app-danger' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='retypePassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-app-text-color'>
                    {lang?.register?.retypePassword}
                    <span className='text-app-danger'>*</span>
                  </FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        {...field}
                        type={showRetypePassword ? 'text' : 'password'}
                        placeholder={lang?.register?.retypePassword}
                        className='pr-10'
                      />
                      <button
                        type='button'
                        className='absolute right-0 top-0 h-full px-3 text-app-text-color'
                        onClick={() => setShowRetypePassword(!showRetypePassword)}
                      >
                        {showRetypePassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className='text-app-danger' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-app-text-color'>
                    {lang?.register?.email}
                    <span className='text-app-danger'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type='text' placeholder={lang?.common?.typeEmail} />
                  </FormControl>
                  <FormMessage className='text-app-danger' />
                </FormItem>
              )}
            />

            {/* name removed */}

            {/* date_of_birth removed */}

            {/* phone_number removed */}

            <p className='text-xl font-semibold text-app-text-color'>{lang?.register?.referral}</p>
            <FormField
              control={form.control}
              name='referral_code'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-app-text-color'>
                    {lang?.register?.referralCode}
                    <span className='text-app-neutral500 capitalize'> ({lang?.common?.optional})</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type='text' placeholder={lang?.register?.typeReferralCode} />
                  </FormControl>
                  <FormMessage className='text-app-danger' />
                </FormItem>
              )}
            />

            {/* transaction password removed */}

            <div className='space-y-4'>
              <CardContent className='pt-2'>
                <div className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='consent'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-app-text-color font-medium'>
                          {lang?.register?.consentForAdvertising}
                        </FormLabel>
                        <FormControl>
                          <div className='flex items-start space-x-2 mt-2'>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className='mt-1 data-[state=checked]:bg-app-primary data-[state=checked]:border-app-primary'
                            />
                            <FormLabel className='text-app-danger text-sm leading-relaxed'>
                              {lang?.register?.checkBoxConsent}
                            </FormLabel>
                          </div>
                        </FormControl>
                        <FormMessage className='text-app-danger' />
                      </FormItem>
                    )}
                  />

                  <div className='border border-app-white100 rounded-lg p-4 space-y-2'>
                    <div className='space-y-2 text-sm text-app-danger'>
                      <div className='flex items-start space-x-2'>
                        <div className='w-2 h-2 bg-app-neutral500 rounded-full mt-2 flex-shrink-0'></div>
                        <p className='text-sm text-app-neutral500'>{lang?.register?.notesConsent1}</p>
                      </div>
                      <div className='flex items-start space-x-2'>
                        <div className='w-2 h-2 bg-app-neutral500 rounded-full mt-2 flex-shrink-0'></div>
                        <p className='text-sm text-app-neutral500'>{lang?.register?.notesConsent2}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>

            <div className='pt-8'>
              <Button
                type='submit'
                disabled={isPending}
                className='w-full bg-app-primary uppercase hover:bg-app-primary-hover text-white py-4 text-lg font-medium rounded-lg transition-colors'
              >
                {lang?.common?.register}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
