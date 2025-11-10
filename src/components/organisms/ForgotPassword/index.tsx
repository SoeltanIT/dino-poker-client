'use client'

import { ForgotPasswordProps } from './types'

export default function ForgotPasswordPage({ lang, locale }: ForgotPasswordProps) {
  const handleContactSupport = () => {
    const waitForLiveChat = (cb: () => void) => {
      if (
        typeof window !== 'undefined' &&
        typeof window.LiveChatWidget !== 'undefined' &&
        typeof window.LiveChatWidget.call === 'function'
      ) {
        cb()
      } else {
        setTimeout(() => waitForLiveChat(cb), 300)
      }
    }

    waitForLiveChat(() => {
      const widget = window.LiveChatWidget

      widget.call('maximize')
    })
  }

  return (
    <div className='min-h-screen flex justify-center px-4 sm:px-6 lg:px-8 mt-[35px]'>
      <div className='max-w-[80%] w-full'>
        <div className='text-left mb-4'>
          <h1 className='text-4xl font-bold text-app-text-color mb-4'>{lang?.common?.forgotPassword}</h1>
          {/* <p className='text-app-neutral600 text-lg'>{lang?.common?.descForgotPassword}</p> */}
          <div className='flex md:flex-row flex-col md:items-center gap-2'>
            <p className='text-app-text-color text-lg'>{lang?.common?.clickHereToReset}</p>
            <div
              onClick={() => handleContactSupport()}
              className='text-app-primary hover:text-app-primary-hover cursor-pointer font-semibold underline italic'
            >
              {lang?.common?.resetPassword}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
