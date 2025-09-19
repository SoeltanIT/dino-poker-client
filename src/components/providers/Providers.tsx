// app/providers.tsx
'use client'

import { CookiesProvider } from 'react-cookie'
import SessionWrapper from '@/components/providers/SessionWrapper'
import { ReactQueryProvider } from '@/@core/hooks/ReactQueryProvider'
import { ToastContainer } from 'react-toastify'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CookiesProvider>
      <SessionWrapper>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </SessionWrapper>
    </CookiesProvider>
  )
}
