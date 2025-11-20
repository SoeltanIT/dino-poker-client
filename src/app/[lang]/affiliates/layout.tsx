import { ReactNode } from 'react'

import { getValidServerSession, handleServerAuthError } from '@/@core/lib/server-auth-utils'
import { getLocale } from '@/dictionaries/dictionaries'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Affiliates Page',
  description: 'Affiliates Page'
}

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await getValidServerSession()
  const roles = Number(session?.user?.roles) || 2
  const locale = await getLocale()

  if (!session && roles !== 3) {
    // No valid session, redirect to login
    await handleServerAuthError(locale)
    return null // This won't be reached due to redirect
  }

  return children
}
