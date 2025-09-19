'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { Resolver, SubmitHandler, useForm } from 'react-hook-form'

import { useMutationQuery } from '@/@core/hooks/use-query'
import { RegistrationFormData, registrationSchema } from '@/@core/utils/schema/Registration/RegistrationSchema'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Locale } from '@/i18n-config'
import { LangProps } from '@/types/langProps'
import { useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { CalendarIcon, Eye, EyeOff, Loader2 } from 'lucide-react'
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
  const [showWithdrawalPassword, setShowWithdrawalPassword] = useState(false)
  const [showRetypeWithdrawalPassword, setShowRetypeWithdrawalPassword] = useState(false)

  const [openCalendar, setOpenCalendar] = useState(false)

  type FormType = RegistrationFormData
  type ResolverType = Resolver<FormType>
  type RegistrationPayload = Omit<
    RegistrationFormData,
    'date_of_birth' | 'retypePassword' | 'retype_transaction_password'
  > & {
    date_of_birth: string // formatted as yyyy-MM-dd
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
      language: 'en',
      name: '',
      password: '',
      phone_number: '',
      phone_number_code: '+1',
      roles: 2, //admin 1, user 2
      transaction_password: '',
      username: '',
      date_of_birth: undefined, // ✅ ADD THIS LINE
      consent: false,
      retype_transaction_password: '',
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
      email: data?.email,
      language: 'en',
      name: data?.name,
      password: data?.password,
      phone_number: data?.phone_number,
      phone_number_code: '+1',
      roles: data?.roles,
      transaction_password: data?.transaction_password,
      username: data?.username,
      consent: data?.consent,
      date_of_birth: data.date_of_birth ? format(data.date_of_birth, 'yyyy-MM-dd') : '',
      referral_code: data?.referral_code ?? ''
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

            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-app-text-color'>
                    {lang?.register?.name}
                    <span className='text-app-danger'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={lang?.register?.placeholderName} />
                  </FormControl>
                  <FormMessage className='text-app-danger' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='date_of_birth'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel className='text-app-text-color'>
                    {lang?.register?.dob || 'Date of Birth'}
                    <span className='text-app-danger'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
                      <PopoverTrigger asChild>
                        <Button
                          variant='outline'
                          className={`!border-0 w-full bg-app-white100 text-left text-app-text-color font-normal ${
                            !field.value ? 'text-muted-foreground' : ''
                          }`}
                        >
                          {field.value ? format(field.value, 'yyyy-MM-dd') : lang?.register?.selectDate}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          locale={locale}
                          captionLayout='dropdown'
                          defaultMonth={new Date(new Date().getFullYear() - 19, new Date().getMonth())}
                          selected={field.value}
                          onSelect={date => {
                            field.onChange(date)
                            setOpenCalendar(false) // ✅ close on select
                          }}
                          disabled={date => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage className='text-app-danger' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='phone_number'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-app-text-color'>
                    {lang?.register?.phoneNumber}
                    <span className='text-app-danger'>*</span>
                  </FormLabel>
                  <FormControl>
                    <div className='flex gap-2'>
                      <Input {...field} placeholder={lang?.common?.typePhoneNumber} className='flex-1' />
                      {/* <Button
                              type="button"
                              variant="outline"
                              className="bg-transparent border-gray-600 text-app-neutral500 hover:bg-gray-700 hover:text-white px-4"
                              onClick={(e) => {
                                handleSendOTP();
                              }}
                            >
                              SEND CODE
                            </Button> */}
                    </div>
                  </FormControl>
                  <FormMessage className='text-app-danger' />
                </FormItem>
              )}
            />

            <p className='text-xl font-semibold text-app-text-color'>{lang?.register?.WithdrawInformation}</p>
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
                {isPending ? <Loader2 className='animate-spin' /> : lang?.common?.register}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
