'use client'

import { UserMeResponse } from '@/@core/interface/User'
import { useSession } from 'next-auth/react'
import { IconLiveChat } from '../Icons'

export const LiveChatButton = ({ user, ready }: { user?: UserMeResponse; ready: boolean }) => {
  const { data: session } = useSession()

  const handleClick = () => {
    if (
      typeof window !== 'undefined' &&
      typeof window.LiveChatWidget !== 'undefined' &&
      typeof window.LiveChatWidget.call === 'function'
    ) {
      if (!ready) {
        console.warn('[LiveChat] Widget is not ready yet. Aborting...')
        return
      }

      const widget = window.LiveChatWidget

      if (!widget || typeof widget.call !== 'function') {
        console.error('[LiveChat] LiveChatWidget is not available or malformed.')
        return
      }

      if (session?.user) {
        widget.call('set_customer_name', session.user.name ?? '')
      } else {
        console.warn('[LiveChat] Session user not found. Skipping customer info.')
      }
      window.LiveChatWidget.call('maximize')
    } else {
      console.warn('[LiveChat] Widget not ready')
    }
  }

  return ready ? (
    <button
      onClick={() => handleClick()}
      className='flex items-center justify-center w-14 h-14 bg-app-primary hover:bg-app-primary-hover rounded-full shadow-lg mt-3 md:mt-0'
    >
      <IconLiveChat className='w-6 h-6 text-white' />
    </button>
  ) : null
}
