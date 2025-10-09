'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { Resolver, SubmitHandler, useForm } from 'react-hook-form'

import { useMutationQuery } from '@/@core/hooks/use-query'
import { RegistrationFormData, registrationSchema } from '@/@core/utils/schema/Registration/RegistrationSchema'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Locale } from '@/i18n-config'
import { LangProps } from '@/types/langProps'
import { useQueryClient } from '@tanstack/react-query'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { getSession, signIn } from 'next-auth/react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCookies } from 'react-cookie'
import { toast } from 'react-toastify'

export default function RegisterForm({ lang, locale }: { lang: LangProps; locale?: Locale }) {
  const pathname = usePathname()
  const router = useRouter()
  const queryClient = useQueryClient()

  const searchParams = useSearchParams()
  const referral = searchParams.get('referral')

  const [cookies, setCookie, removeCookie] = useCookies(['_authorization'])

  const [open, setOpen] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  const [showRetypePassword, setShowRetypePassword] = useState(false)

  type FormType = RegistrationFormData
  type ResolverType = Resolver<FormType>
  type RegistrationPayload = {
    email: string
    username: string
    password: string
    referral_code?: string
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
      referral_code: referral ?? ''
    }
  })

  // keep form state in sync when the URL param arrives/changes
  useEffect(() => {
    if (referral) {
      form.setValue('referral_code', referral, { shouldValidate: true, shouldDirty: false })
    }
  }, [referral, form])

  const onSubmit: SubmitHandler<FormType> = async (data: FormType) => {
    const payload: RegistrationPayload = {
      email: data.email,
      username: data.username,
      password: data.password,
      referral_code: data.referral_code || undefined
    }

    try {
      const resp = await registerUser({
        url: '/register',
        body: payload
      })

      if (resp?.status === 'success') {
        try {
          const res = await signIn('credentials', {
            redirect: false,
            username: data?.username,
            password: data?.password
          })

          if (res?.error === 'CredentialsSignin') {
            toast.error(`Error Something went wrong`)
          } else if (res?.ok) {
            const session = await getSession()
            const token = session?.accessToken

            if (token) {
              setCookie('_authorization', token, {
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24
              })
              await queryClient.invalidateQueries({ queryKey: ['user', 'me'] })
              await queryClient.invalidateQueries({ queryKey: ['getBalance'] })

              setOpen(false)
              form.reset() // Reset the form after successful registration
              if (pathname === `/${locale}`) {
                window.location.reload()
              } else {
                router.push(`/${locale}`)
              }
            }
          }
        } catch {
          setOpen(false)
          form.reset()
          toast.error(`Login Failed. Try again`)
          router.push(`/${locale}`)
        }
      } else {
        setOpen(false)
        form.reset()
        toast.error(`Login Failed. Try again`)
        router.push(`/${locale}`)
        // Handle failure (e.g., show an error message)
      }
    } catch (error) {}
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          className='text-white h-10 px-6 uppercase hover:opacity-90'
          style={{
            background: 'linear-gradient(96.67deg, #5F32E7 0%, #9747FF 100%)'
          }}
        >
          {lang?.common?.register}
        </Button>
      </SheetTrigger>
      <SheetContent className='w-full sm:max-w-md overflow-y-auto scrollbar-hide'>
        <div className='mt-6 text-xl font-bold uppercase text-app-text-color'>{lang?.common?.register}</div>
        <p className='text-app-text-color text-base mb-8'>{lang?.register?.subTitleRegister}</p>

        {/* Form - keep the existing form content exactly the same */}
        <Form {...form}>
          <form id='register-form' onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <p className='text-xl font-semibold text-app-text-color'>{lang?.register?.personalInformation}</p>
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

            {/* transaction password fields removed */}

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
                    <Input
                      {...field}
                      type='text'
                      placeholder={lang?.register?.typeReferralCode}
                      defaultValue={referral ?? ''}
                      readOnly={!!referral}
                    />
                  </FormControl>
                  <FormMessage className='text-app-danger' />
                </FormItem>
              )}
            />

            {/* consent section removed */}

            <div className='pt-8'>
              <Button
                type='submit'
                disabled={isPending}
                className='w-full bg-app-primary uppercase hover:bg-app-primary-hover text-white py-4 text-lg font-medium rounded-lg transition-colors'
              >
                {isPending ? <Loader2 className='animate-spin' /> : lang?.common?.register}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
