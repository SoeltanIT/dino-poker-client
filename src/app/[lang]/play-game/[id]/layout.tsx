import { ReactNode } from 'react'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Play Game Page',
  description: 'Play Game Page'
}

export default function Layout({ children }: { children: ReactNode }) {
  return children
}
