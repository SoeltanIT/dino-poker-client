import type { PropsWithChildren } from 'react'

export function TableCard({ children }: PropsWithChildren) {
  return (
    <div className='overflow-hidden rounded-2xl border border-app-neutral600'>
      <table className='w-full text-sm text-app-text-color my-0 [&_thead]:border-app-neutral600 [&_thead_tr]:bg-[#0E1B2A]'>
        {children}
      </table>
    </div>
  )
}
