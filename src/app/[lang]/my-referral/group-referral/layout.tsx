import { ReactNode } from 'react'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Referral Group Detail Page',
  description: 'My Referral Group Detail Page'
}

export default function Layout({ children }: { children: ReactNode }) {
  return children
}
