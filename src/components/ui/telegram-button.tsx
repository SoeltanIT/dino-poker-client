'use client'

import { Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { LangProps } from '@/types/langProps'

interface TelegramButtonProps {
  lang: LangProps
  botUsername: string
  onAuth: (userData: any) => void
  onError?: (error: string) => void
  disabled?: boolean
  className?: string
  children?: React.ReactNode
}

export default function TelegramButton({
  lang,
  botUsername,
  onAuth,
  onError,
  disabled = false,
  className = '',
  children
}: TelegramButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const widgetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Define the global callback function for Telegram auth
    ;(window as any).onTelegramAuth = (user: any) => {
      try {
        setIsLoading(false)
        onAuth(user)
      } catch (error) {
        setIsLoading(false)
        onError?.('Authentication failed')
      }
    }

    // Load the Telegram widget on mount
    if (widgetRef.current && !disabled) {
      // Clear any existing content
      widgetRef.current.innerHTML = ''

      // Create the widget script
      const script = document.createElement('script')
      script.src = 'https://telegram.org/js/telegram-widget.js?22'
      script.setAttribute('data-telegram-login', botUsername)
      script.setAttribute('data-size', 'large')
      script.setAttribute('data-onauth', 'onTelegramAuth(user)')
      script.setAttribute('data-request-access', 'write')
      script.async = true

      // Append script to the container
      widgetRef.current.appendChild(script)
    }

    return () => {
      delete (window as any).onTelegramAuth
    }
  }, [botUsername, onAuth, onError, disabled])

  if (disabled) {
    return (
      <div className='flex flex-col items-center gap-2'>
        <p className='text-app-text-color text-sm'>{lang?.common?.loginWithTelegram}</p>
        <div className='w-12 h-12 rounded-full flex items-center justify-center p-0 bg-gray-300 opacity-50'>
          <span className='text-gray-500 text-xs'></span>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <p className='text-app-text-color text-sm'>{lang?.common?.loginWithTelegram}</p>

      <div onClick={() => setIsLoading(true)} className='relative inline-block w-12 h-12'>
        {/* Visual button */}
        <div className='w-full h-full rounded-full flex items-center justify-center bg-transparent'>
          {isLoading ? (
            <Loader2 className='animate-spin h-6 w-6' />
          ) : (
            <Image src='/images/telegram_logo.svg' alt='Telegram' width={45} height={45} />
          )}
        </div>

        {/* Clickable Telegram iframe area (clipped to circle) */}
        <div
          ref={widgetRef}
          className='-left-0 top-1 absolute inset-0 rounded-full overflow-hidden opacity-1 cursor-pointer'
          style={{ zIndex: 10 }}
        />
      </div>
    </div>
  )
}
