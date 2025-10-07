'use client'

import { useEffect, useRef } from 'react'

interface TelegramSSOProps {
  botUsername: string
  onAuth: (userData: any) => void
  onError?: (error: string) => void
}

export default function TelegramSSO({ botUsername, onAuth, onError }: TelegramSSOProps) {
  const widgetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
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

      // Define the global callback function
      ; (window as any).onTelegramAuth = (user: any) => {
        try {
          console.log('Telegram auth data:', user)
          onAuth(user)
        } catch (error) {
          console.error('Telegram auth error:', error)
          onError?.('Authentication failed')
        }
      }

    // Append script to the widget container
    widgetRef.current.appendChild(script)

    // Cleanup function
    return () => {
      if (widgetRef.current) {
        widgetRef.current.innerHTML = ''
      }
      delete (window as any).onTelegramAuth
    }
  }, [botUsername, onAuth, onError])

  return (
    <div ref={widgetRef} className="w-full">
      {/* The Telegram widget will be injected here */}
    </div>
  )
}