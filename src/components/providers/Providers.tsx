// app/providers.tsx
'use client'

import { ReactQueryProvider } from '@/@core/hooks/ReactQueryProvider'
import SessionWrapper from '@/components/providers/SessionWrapper'
import dynamic from 'next/dynamic'
import { CookiesProvider } from 'react-cookie'

const TelegramMiniAppProvider = dynamic(() => import('./TelegramMiniApp').then(mod => mod.TelegramMiniAppProvider), {
  ssr: false
})

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
