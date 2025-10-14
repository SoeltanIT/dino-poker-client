// app/providers.tsx
'use client'

import { ReactQueryProvider } from '@/@core/hooks/ReactQueryProvider'
import SessionWrapper from '@/components/providers/SessionWrapper'
import { TelegramMiniAppProvider } from '@/components/providers/TelegramMiniApp'
import { CookiesProvider } from 'react-cookie'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CookiesProvider>
      <SessionWrapper>
        <ReactQueryProvider>
          <TelegramMiniAppProvider>{children}</TelegramMiniAppProvider>
        </ReactQueryProvider>
      </SessionWrapper>
    </CookiesProvider>
  )
}
