'use client'
import Image from 'next/image'
import { useState } from 'react'
import { BankAccountProps } from './types'

export default function BankAccount({ lang, locale, initialData }: BankAccountProps) {
  const [showAccount, setShowAccount] = useState(false)

  const toggleShow = () => {
    setShowAccount(prev => !prev)
  }

  const getMaskedAccountNumber = (number: string) => {
    const visibleLength = 4
    const maskedLength = Math.max(0, number.length - visibleLength)

    return (
      <span className='inline-flex items-center gap-1'>
        <span>{number.slice(0, visibleLength)}</span>
        {Array.from({ length: maskedLength }).map((_, idx) => (
          <div key={idx} className='h-1.5 w-1.5 rounded-full bg-app-text-color' />
        ))}
      </span>
    )
  }

  return (
    <div className='flex flex-col w-full min-h-screen text-app-text-color px-6 lg:px-16 mt-10'>
      {/* Header */}
      <div className='flex flex-row items-center justify-between gap-4 mb-8'>
        <div>
          <h1 className='text-3xl font-bold text-app-text-color mb-2 uppercase'>{lang?.common?.bankAccount}</h1>
          {/* <p className='text-app-neutral500'>{lang?.common?.descBankAccount}</p> */}
        </div>
        {/* <Link
          href={{
            pathname: currentPathName,
            query: queryString({
              ...query,
              bank: "show",
            }),
          }}
        >
          <Button className="bg-app-primary hover:bg-app-primary-hover text-white flex items-center gap-2 uppercase">
            <Plus className="w-4 h-4" />
            {lang?.common?.add}
          </Button>
        </Link> */}
      </div>

      {/* Table & Empty State */}
      <div className='flex overflow-hidden flex-col'>
        {/* Table Header */}
        <div className='hidden h-[50px] md:grid grid-cols-3 bg-app-background-secondary px-6 items-center justify-center text-sm font-semibold text-app-text-header-table mb-4 rounded-[8px]'>
          <div>{lang?.common?.bankName}</div>
          <div>{lang?.common?.accountName}</div>
          <div>{lang?.common?.bankNumber}</div>
        </div>

        {/* Mobile Header */}
        <div className='md:hidden px-4 py-4 mb-[10px] bg-app-background-secondary text-app-text-color text-sm font-medium uppercase tracking-wide rounded-[8px]'>
          {lang?.common?.bankAccount}
        </div>

        {/* Account Rows */}

        {/* Empty State */}
        {!initialData?.bank_account_number && !initialData?.bank_account_number ? (
          <div className='flex flex-col items-center justify-center py-24 text-center gap-4'>
            <Image
              src={'/images/walletNotFound.png'}
              alt='Wallet Not Found'
              width={1000}
              height={1000}
              className='h-[100px] w-[100px] object-contain object-center'
            />
            <p className='text-app-text-color text-sm'>{lang?.common?.noBankDataFound}</p>
          </div>
        ) : (
          <div className='divide-y divide-gray-200 bg-app-background-primary text-white transition-colors rounded-[8px] border border-app-neutral300'>
            {/* {mockBankAccounts.map(account => ( */}
            <div className=''>
              {/* Desktop Layout */}
              <div className='hidden md:grid md:grid-cols-3 px-6 py-3 items-center'>
                <div className='flex items-center gap-3'>
                  {/* <div className='w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0'>
                    <div className='w-6 h-6 bg-white rounded-full flex items-center justify-center'>
                      <div className='w-3 h-3 bg-blue-500 rounded-full'></div>
                    </div>
                  </div> */}
                  <span className='font-medium text-app-text-color'>{initialData?.bank_name}</span>
                </div>
                <div className='font-medium text-app-text-color capitalize'>{initialData?.name}</div>
                <div className='flex items-center gap-4'>
                  <div className='font-medium text-app-text-color'>
                    {getMaskedAccountNumber(initialData?.bank_account_number)}
                  </div>
                  {/* <button onClick={toggleShow} type='button'>
                    {showAccount ? (
                      <EyeOff size={20} className='text-app-text-color' />
                    ) : (
                      <Eye size={20} className='text-app-text-color' />
                    )}
                  </button> */}
                </div>
              </div>

              {/* Mobile Layout */}
              <div className='md:hidden px-4 py-4'>
                <div className='flex items-center gap-3 mb-2'>
                  {/* <div className='w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0'>
                    <div className='w-6 h-6 bg-white rounded-full flex items-center justify-center'>
                      <div className='w-3 h-3 bg-blue-500 rounded-full'></div>
                    </div>
                  </div> */}
                  <div>
                    <div className='font-medium text-sm text-app-text-color'>{initialData?.bank_name}</div>
                    <div className='text-sm text-app-text-color capitalize'>{initialData?.name}</div>
                  </div>
                </div>
                <div className='flex items-center gap-4'>
                  <div className='font-semibold text-app-text-color'>
                    {getMaskedAccountNumber(initialData?.bank_account_number)}
                  </div>
                  {/* <button onClick={toggleShow} type='button'>
                    {showAccount ? (
                      <EyeOff size={18} className='text-app-text-color' />
                    ) : (
                      <Eye size={18} className='text-app-text-color' />
                    )}
                  </button> */}
                </div>
              </div>
            </div>
            {/* ))} */}
          </div>
        )}
      </div>
    </div>
  )
}
