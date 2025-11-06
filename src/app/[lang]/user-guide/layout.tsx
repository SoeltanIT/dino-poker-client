import { ReactNode } from 'react'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'User Guide Page',
  description: 'User Guide Page'
}

export default function Layout({ children }: { children: ReactNode }) {
  return children
}
