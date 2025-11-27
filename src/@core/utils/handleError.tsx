'use client'

import axios from 'axios'
import { signOut } from 'next-auth/react'
import { toast } from 'react-toastify'

export const handleError = async (error: any, disableErrorToast = false) => {
  //console.error('[GetData] ❌ Error caught!!!')

  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    const message = error.response?.data?.message

    //console.error('[AxiosError]', {
    //   status,
    //   message,
    //   full: error.response
    // })

    // Handle 401 specifically for client-side
    if (status === 401 && typeof window !== 'undefined') {
      const locale = window.location.pathname.split('/')[1] || 'ko'
      console.warn('[handleError] 401 detected — signing out...')

      // Clear client-side session and redirect
      await signOut({
        callbackUrl: `/${locale}`,
        redirect: true
      })
      return // Don't show toast if redirecting
    }

    // Show error message for other errors
    if (!disableErrorToast) {
      toast.error(message || `Error ${status || ''}: Something went wrong`)
    }
  } else {
    console.error('[UnknownError]', error)
    if (!disableErrorToast) {
      toast.error(error?.message || 'Unexpected error')
    }
  }
}
