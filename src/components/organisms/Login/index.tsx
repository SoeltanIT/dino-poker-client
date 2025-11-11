'use client'

import { LoginFormData, LoginSchema } from '@/@core/utils/schema/Login/LoginSchema'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import TelegramButton from '@/components/ui/telegram-button'
import { LangProps } from '@/types/langProps'
import { useLiveChatContext } from '@/utils/context/LiveChatProvider'
import { getLinkToForgotPassword } from '@/utils/linkFactory/linkFactory'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { getSession, signIn } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import { useCookies } from 'react-cookie'
import { Resolver, SubmitHandler, useForm } from 'react-hook-form'

export default function LoginModal({
  lang,
  locale,
  open,
  onClose
}: {
  lang: LangProps
  locale?: string
  open: boolean
  onClose: () => void
}) {
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  type FormType = LoginFormData
  type ResolverType = Resolver<FormType>

  const queryClient = useQueryClient()

  const [cookies, setCookie, removeCookie] = useCookies(['_authorization'])

  const form = useForm<FormType>({
    resolver: zodResolver(LoginSchema(lang)) as ResolverType,
    defaultValues: {
      username: '',
      password: ''
    }
  })

  const { ready } = useLiveChatContext()

  const handleSessionLiveChat = (session: any) => {
    console.log('[LiveChat] handleSessionLiveChat called.')

    if (!ready) {
      console.warn('[LiveChat] Widget is not ready yet. Aborting...')
      return
    }

    const widget = window.LiveChatWidget

    if (!widget || typeof widget.call !== 'function') {
      console.error('[LiveChat] LiveChatWidget is not available or malformed.')
      return
    }

    widget.call('set_session_variables', { name: session.user.name })

    setTimeout(() => {
      widget.call('maximize')
    }, 5000)
  }

  const handleLoginSuccess = async () => {
    const session = await getSession()
    const token = session?.accessToken

    if (token) {
      setCookie('_authorization', token, {
        path: '/',
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24
      })
      await queryClient.invalidateQueries({ queryKey: ['user', 'me'] })
      await queryClient.invalidateQueries({ queryKey: ['getBalance'] })
    }
    handleSessionLiveChat(session)
    onClose()
    window.location.reload()
  }

  const handleTelegramAuth = async (userData: any) => {
    setError('')
    setLoading(true)

    try {
      // Use NextAuth signIn with telegram provider
      const res = await signIn('telegram', {
        redirect: false,
        telegramData: JSON.stringify(userData)
      })

      if (res?.error) {
        console.log('Telegram login failed:', res)
        setError('Telegram login failed')
      } else if (res?.ok) {
        await handleLoginSuccess()
      }
    } catch (error) {
      console.error('Telegram auth error:', error)
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit: SubmitHandler<FormType> = async (data: FormType) => {
    setError('')
    setLoading(true)

    try {
      const res = await signIn('credentials', {
        redirect: false,
        username: data?.username,
        password: data?.password
      })

      if (res?.error === 'CredentialsSignin') {
        setError(lang?.form?.invalid_username_password)
      } else if (res?.ok) {
        await handleLoginSuccess()
      }
    } catch {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={state => !state && onClose()}>
      <DialogContent className='bg-app-background-primary text-app-text-color rounded-2xl border border-app-neutral700 shadow-xl max-w-[300px] mx-auto'>
        <DialogHeader>
          <DialogTitle className='text-center text-2xl font-medium text-app-text-color uppercase'>
            {lang?.common?.login}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form id='login-form-mobile' onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
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
                    <Input {...field} placeholder={lang?.common?.typeUsername} />
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
                        placeholder={lang?.common?.typePassword}
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

            <div className='flex items-center justify-end pb-0.5'>
              <Link
                href={getLinkToForgotPassword(locale)}
                onClick={() => onClose()}
                className='underline text-xs text-app-text-color hover:opacity-90'
              >
                {lang?.common?.forgotPassword}
              </Link>
            </div>
            <div className='mb-4 flex justify-center items-center'>
              <TelegramButton
                lang={lang}
                botUsername={process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME as string}
                onAuth={handleTelegramAuth}
                onError={setError}
                disabled={loading}
              />
            </div>
            {error && <div className='text-app-danger text-xs mt-1 text-center'>{error}</div>}

            <Button
              type='submit'
              disabled={loading}
              className='w-full bg-app-primary hover:bg-app-primary-hover text-white py-3 rounded-lg font-medium mt-6'
            >
              {loading ? <Loader2 className='animate-spin' /> : lang?.common?.login}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
