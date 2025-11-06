import { ReactNode } from 'react'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Events Page',
  description: 'Events Page'
}

export default function Layout({ children }: { children: ReactNode }) {
  return children
}
