import { ReactNode } from 'react'

import { getAppFeaturesServer } from '@/utils/server/app-features'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'My Promotion Page',
  description: 'My Promotion Page'
}

export default async function Layout({ children }: { children: ReactNode }) {
  const features = await getAppFeaturesServer()
  if (features.promotion) {
    return children
  }
  redirect('/')
}
