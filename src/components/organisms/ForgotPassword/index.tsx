'use client'

import type React from 'react'
import { useState } from 'react'
import { ForgotPasswordProps } from './types'

export default function ForgotPasswordPage({ lang, locale }: ForgotPasswordProps) {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    //console.log('Reset password for email:', email)
    // Handle password reset logic here
  }

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

        {/* <form
          onSubmit={handleSubmit}
          className="space-y-8 mt-[36px] flex flex-col"
        >
          <div className="space-y-4">
            <Label htmlFor="email" className="text-app-text-color text-lg">
              {lang?.common?.email}
              <span className="text-app-danger">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder={lang?.common?.typeEmail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full max-w-[375px] self-center bg-app-primary hover:bg-app-primary-hover text-white font-semibold py-4 text-lg rounded-lg"
          >
            {lang?.common?.reset}
          </Button>
        </form> */}
      </div>
    </div>
  )
}
