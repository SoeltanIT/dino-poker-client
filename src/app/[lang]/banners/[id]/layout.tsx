import { ReactNode } from 'react'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Detail Events Page',
  description: 'Detail Events Page'
}

export default function Layout({ children }: { children: ReactNode }) {
  return children
}
