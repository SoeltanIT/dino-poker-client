'use client'
import { Button } from '@/components/ui/button'
import { queryString } from '@/utils/queryString'
import { Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { MyWalletProps } from './types'

export default function MyWalletPage({ lang, locale }: MyWalletProps) {
  const currentPathName = usePathname()

  const searchParams = useSearchParams()

  let query = {}

  if (searchParams?.entries) {
    query = Object.fromEntries(searchParams?.entries())
  }

  return (
    <div className='flex flex-col w-full min-h-screen text-app-text-color px-6 lg:px-16 mt-10'>
      {/* Header */}
      <div className='flex flex-row items-center justify-between gap-4 mb-8'>
        <div>
          <h1 className='text-3xl font-bold text-app-text-color mb-2 uppercase'>{lang?.common?.myWallet}</h1>
          <p className='text-app-neutral500'>{lang?.common?.descMyWallet}</p>
        </div>
        <Link
          href={{
            pathname: currentPathName,
            query: queryString({
              ...query,
              wallet: 'show'
            })
          }}
        >
          <Button className='bg-app-primary hover:bg-app-primary-hover text-white flex items-center gap-2 uppercase'>
            <Plus className='w-4 h-4' />
            {lang?.common?.add}
          </Button>
        </Link>
      </div>

      {/* Table & Empty State */}
      <div className='flex overflow-hidden flex-col'>
        {/* Table Header */}
        <div className='hidden h-[50px] md:grid grid-cols-4 bg-app-background-secondary px-4 text-center items-center justify-center text-sm font-medium text-app-neutral500 mb-4 rounded-md'>
          <div>{lang?.common?.addressLabel}</div>
          <div>{lang?.common?.crypto}</div>
          <div>{lang?.common?.network}</div>
          <div>{lang?.common?.address}</div>
        </div>

        {/* Empty State */}
        <div className='flex flex-col items-center justify-center py-24 text-center bg-app-background-secondary rounded-md border border-app-neutral600 gap-4'>
          <Image
            src={'/images/walletNotFound.png'}
            alt='Wallet Not Found'
            width={1000}
            height={1000}
            className='h-[100px] w-[100px] object-contain object-center'
          />
          <p className='text-app-text-color text-sm'>
            No wallet found, lets start adding{' '}
            <Link
              href={{
                pathname: currentPathName,
                query: queryString({
                  ...query,
                  wallet: 'show'
                })
              }}
              className='text-app-text-color underline'
            >
              {lang?.common?.wallet}.
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
