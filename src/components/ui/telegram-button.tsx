'use client'

import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface TelegramButtonProps {
  botUsername: string
  onAuth: (userData: any) => void
  onError?: (error: string) => void
  disabled?: boolean
  className?: string
  children?: React.ReactNode
}

export default function TelegramButton({
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
    ; (window as any).onTelegramAuth = (user: any) => {
      try {
        console.log('Telegram auth data:', user)
        setIsLoading(false)
        onAuth(user)
      } catch (error) {
        console.error('Telegram auth error:', error)
        setIsLoading(false)
        onError?.('Authentication failed')
      }
    }

    return () => {
      delete (window as any).onTelegramAuth
    }
  }, [onAuth, onError])

  const handleTelegramAuth = () => {
    if (disabled || isLoading) return

    setIsLoading(true)

    // Create a hidden container for the Telegram widget
    if (!widgetRef.current) return

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

    // Append script to the hidden container
    widgetRef.current.appendChild(script)

    // Trigger click on the widget button after a short delay
    setTimeout(() => {
      const widgetButton = widgetRef.current?.querySelector('iframe')?.contentDocument?.querySelector('button')
      if (widgetButton) {
        (widgetButton as HTMLButtonElement).click()
      } else {
        // Fallback: try to find and click the widget button
        const iframe = widgetRef.current?.querySelector('iframe')
        if (iframe) {
          iframe.click()
        }
      }
    }, 1000)
  }

  return (
    <>
      {/* Hidden container for Telegram widget */}
      <div ref={widgetRef} className="hidden" />

      {/* Custom circular button */}
      <Button
        type="button"
        onClick={handleTelegramAuth}
        disabled={disabled || isLoading}
        className={`w-12 h-12 bg-[#0088cc] hover:bg-[#006699] text-white rounded-full transition-colors duration-200 flex items-center justify-center border border-app-neutral700 p-0 ${className}`}
      >
        {isLoading ? (
          <Loader2 className="animate-spin h-6 w-6" />
        ) : (
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16l-1.61 7.59c-.12.56-.44.7-.9.44l-2.49-1.84-1.2 1.15c-.13.13-.24.24-.49.24l.18-2.55 4.64-4.19c.2-.18-.04-.28-.31-.1l-5.74 3.61-2.47-.77c-.54-.17-.55-.54.11-.8l9.68-3.73c.45-.17.84.1.7.8z" />
          </svg>
        )}
      </Button>
    </>
  )
}
