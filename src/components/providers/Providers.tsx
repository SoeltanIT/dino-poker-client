// app/providers.tsx
'use client'

import { AppFeatures, AppFeaturesProvider } from '@/@core/context/AppFeaturesContext'
import { ReactQueryProvider } from '@/@core/hooks/ReactQueryProvider'
import SessionWrapper from '@/components/providers/SessionWrapper'
import dynamic from 'next/dynamic'
import { CookiesProvider } from 'react-cookie'

const TelegramMiniAppProvider = dynamic(() => import('./TelegramMiniApp').then(mod => mod.TelegramMiniAppProvider), {
  ssr: false
})

interface ProvidersProps {
  children: React.ReactNode
  initialFeatures?: AppFeatures
}

export function Providers({ children, initialFeatures }: ProvidersProps) {
  return (
    <CookiesProvider>
      <SessionWrapper>
        <ReactQueryProvider>
          <AppFeaturesProvider initialFeatures={initialFeatures}>
            <TelegramMiniAppProvider>{children}</TelegramMiniAppProvider>
          </AppFeaturesProvider>
        </ReactQueryProvider>
      </SessionWrapper>
    </CookiesProvider>
  )
}
