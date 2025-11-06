// app/providers.tsx
'use client'

import { AppFeaturesProvider } from '@/@core/context/AppFeaturesContext'
import { ReactQueryProvider } from '@/@core/hooks/ReactQueryProvider'
import SessionWrapper from '@/components/providers/SessionWrapper'
import { TelegramMiniAppProvider } from '@/components/providers/TelegramMiniApp'
import { CookiesProvider } from 'react-cookie'
import { AppFeatures } from '@/@core/context/AppFeaturesContext'

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
