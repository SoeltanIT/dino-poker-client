import { ReactNode } from 'react'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Promotion Detail Page',
  description: 'Promotion Detail Page'
}

export default function Layout({ children }: { children: ReactNode }) {
  return children
}
