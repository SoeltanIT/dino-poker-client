import { ReactNode } from 'react'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Referral Group Detail Page',
  description: 'My Referral Group Detail Page'
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className='min-h-screen'>
      <div className='flex flex-col w-full text-app-text-color px-6 lg:px-20 mt-10'>
        <div className='flex flex-col'>{children}</div>
      </div>
    </div>
  )
}
