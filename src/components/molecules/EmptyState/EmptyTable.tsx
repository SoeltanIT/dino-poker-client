'use client'

import Image from 'next/image'

export interface EmptyTableProps {
  message?: string
  image?: string
}

export function EmptyTable({ message, image }: EmptyTableProps) {
  return (
    <div className='p-8 text-center flex flex-col gap-3 items-center'>
      <Image
        src={image || '/images/betNotFound.png'}
        alt='Bet Not Found'
        width={1000}
        height={1000}
        className='h-[100px] w-[100px] object-contain object-center'
      />
      <p className='text-app-text-color text-sm'>{message}</p>
    </div>
  )
}
