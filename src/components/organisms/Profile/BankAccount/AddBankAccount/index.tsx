'use client'

import { IconClose, IconSize } from '@/components/atoms/Icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { queryString } from '@/utils/queryString'
import { Label } from '@radix-ui/react-label'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { AddBankAccountProps } from './types'

const bankOption = ['KOREA 1', 'KOREA 2', 'KOREA 3']
const networkOption = ['Network 1', 'Network 2', 'Network 3']

export default function AddBankAccount({ lang, locale }: AddBankAccountProps) {
  const currentPathName = usePathname()
  const searchParams = useSearchParams()
  let query = {}
  if (searchParams?.entries) {
    query = Object.fromEntries(searchParams?.entries())
  }

  const [accountName, setAccountName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')

  const [selectedBank, setSelectedBank] = useState('')
  const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false)

  const bankDropdownRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bankDropdownRef.current && !bankDropdownRef.current.contains(event.target as Node)) {
        setIsBankDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    // console.log('Form submitted:', {
    //   type: 'addwallet'
    // })
  }

  return (
    <div className='h-screen flex flex-col px-6 overflow-y-auto md:min-h-screen scrollbar-hide'>
      {/* Header */}
      <div className='flex justify-end pt-[17px]'>
        <Link
          href={{
            pathname: currentPathName,
            query: queryString({
              ...query,
              bank: undefined
            })
          }}
          className=''
        >
          <IconClose size={IconSize.md} className='text-app-text-color' />
        </Link>
      </div>
      <div>
        <div className='flex items-center pb-6'>
          <div className='text-xl font-bold uppercase text-app-text-color'>{lang?.common?.addBankAccount}</div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='flex-1 flex flex-col'>
          <div className='mb-6'>
            <Label className='text-app-text-color text-sm mb-2 block'>
              {lang?.common?.bankName}
              <span className='text-app-danger'>*</span>
            </Label>
            <div className='relative' ref={bankDropdownRef}>
              <button
                type='button'
                onClick={() => setIsBankDropdownOpen(!isBankDropdownOpen)}
                className='w-full bg-app-white100 text-app-text-color placeholder-app-neutral500 h-10 px-3 rounded-md flex items-center justify-between transition-colors'
              >
                <span className={selectedBank ? 'text-app-text-color' : 'text-app-neutral500'}>
                  {selectedBank || 'Select'}
                </span>
                <ChevronDown className='h-4 w-4 text-app-neutral500' />
              </button>

              {isBankDropdownOpen && (
                <div className='absolute top-full left-0 right-0 mt-1 bg-app-background-primary rounded-md shadow-lg z-10'>
                  {bankOption.map(option => (
                    <button
                      key={option}
                      type='button'
                      onClick={() => {
                        setSelectedBank(option)
                        setIsBankDropdownOpen(false)
                      }}
                      className='w-full text-left px-3 py-2 text-app-text-color transition-colors first:rounded-t-md last:rounded-b-md'
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className='mb-6'>
            <Label htmlFor='account-name' className='text-app-text-color text-sm mb-2 block'>
              {lang?.common?.accountName}
              <span className='text-app-danger'>*</span>
            </Label>
            <Input
              id='account-name'
              type='text'
              placeholder={lang?.common?.typeAccountName}
              value={accountName}
              onChange={e => setAccountName(e.target.value)}
            />
          </div>

          <div className='mb-8'>
            <Label htmlFor='account-number' className='text-app-text-color text-sm mb-2 block'>
              {lang?.common?.accountNumber}
              <span className='text-app-danger'>*</span>
            </Label>
            <Input
              id='account-number'
              type='text'
              placeholder={lang?.common?.typeAccountNumber}
              value={accountNumber}
              onChange={e => setAccountNumber(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div className='mt-auto pb-6'>
            <Button
              type='submit'
              className='w-full bg-app-primary uppercase hover:bg-app-primary-hover text-white py-4 text-lg font-medium rounded-lg transition-colors'
            >
              {lang?.common?.save}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
