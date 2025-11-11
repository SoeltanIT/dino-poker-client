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
import { AddWalletProps } from './types'

const tabs = ['EMAIL', 'PHONE'] as const
const cryptoOption = ['DOGE', 'BTC', 'SOL']
const networkOption = ['Network 1', 'Network 2', 'Network 3']

export default function AddWallet({ lang, locale }: AddWalletProps) {
  const currentPathName = usePathname()
  const searchParams = useSearchParams()
  let query = {}
  if (searchParams?.entries) {
    query = Object.fromEntries(searchParams?.entries())
  }

  const [addressLabel, setAddressLabel] = useState('')
  const [address, setAddress] = useState('')
  const [selectedNetwork, setSelectedNetwork] = useState('')
  const [isNetworkDropdownOpen, setIsNetworkDropdownOpen] = useState(false)

  const [selectedCrypto, setSelectedCrypto] = useState('')
  const [isCryptoDropdownOpen, setIsCryptoDropdownOpen] = useState(false)

  const cryptoDropdownRef = useRef<HTMLDivElement | null>(null)
  const networkDropdownRef = useRef<HTMLDivElement | null>(null)

  const [activeSubTab, setActiveSubTab] = useState<(typeof tabs)[number]>('EMAIL')
  const [verifyBy, setVerifyBy] = useState('')
  const [verificationCode, setVerificationCode] = useState('')

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cryptoDropdownRef.current && !cryptoDropdownRef.current.contains(event.target as Node)) {
        setIsCryptoDropdownOpen(false)
      }
      if (networkDropdownRef.current && !networkDropdownRef.current.contains(event.target as Node)) {
        setIsNetworkDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleOtpChange = (value: string) => {}

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
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
              wallet: undefined
            })
          }}
          className=''
        >
          <IconClose size={IconSize.md} className='text-app-text-color' />
        </Link>
      </div>
      <div>
        <div className='flex items-center pb-6'>
          <div className='text-xl font-bold uppercase text-app-text-color'>{lang?.common?.addWallet}</div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='flex-1 flex flex-col'>
          {/* Withdrawal Amount */}
          <div className='mb-6'>
            <Label htmlFor='address-label' className='text-app-text-color text-sm mb-2 block'>
              {lang?.common?.addressLabel}
              <span className='text-app-danger'>*</span>
            </Label>
            <Input
              id='address-label'
              type='text'
              placeholder={lang?.common?.typeAddressLabel}
              value={addressLabel}
              onChange={e => setAddressLabel(e.target.value)}
            />
          </div>

          <>
            <div className='mb-6'>
              <Label className='text-app-text-color text-sm mb-2 block'>
                {lang?.common?.crypto}
                <span className='text-app-danger'>*</span>
              </Label>
              <div className='relative' ref={cryptoDropdownRef}>
                <button
                  type='button'
                  onClick={() => setIsCryptoDropdownOpen(!isCryptoDropdownOpen)}
                  className='w-full bg-app-white100 text-app-text-color placeholder-app-neutral500 h-10 px-3 rounded-md flex items-center justify-between transition-colors'
                >
                  <span className={selectedCrypto ? 'text-app-text-color' : 'text-app-neutral500'}>
                    {selectedCrypto || 'Select'}
                  </span>
                  <ChevronDown className='h-4 w-4 text-app-neutral500' />
                </button>

                {isCryptoDropdownOpen && (
                  <div className='absolute top-full left-0 right-0 mt-1 bg-app-background-primary rounded-md shadow-lg z-10'>
                    {cryptoOption.map(option => (
                      <button
                        key={option}
                        type='button'
                        onClick={() => {
                          setSelectedCrypto(option)
                          setIsCryptoDropdownOpen(false)
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
              <Label className='text-app-text-color text-sm mb-2 block'>
                {lang?.common?.network}
                <span className='text-app-danger'>*</span>
              </Label>
              <div className='relative' ref={networkDropdownRef}>
                <button
                  type='button'
                  onClick={() => setIsNetworkDropdownOpen(!isNetworkDropdownOpen)}
                  className='w-full bg-app-white100 text-app-text-color placeholder-app-neutral500 h-10 px-3 rounded-md flex items-center justify-between transition-colors'
                >
                  <span className={selectedNetwork ? 'text-app-text-color' : 'text-app-neutral500'}>
                    {selectedNetwork || 'Select'}
                  </span>
                  <ChevronDown className='h-4 w-4 text-app-neutral500' />
                </button>

                {isNetworkDropdownOpen && (
                  <div className='absolute top-full left-0 right-0 mt-1 bg-app-background-primary rounded-md shadow-lg z-10'>
                    {networkOption.map(option => (
                      <button
                        key={option}
                        type='button'
                        onClick={() => {
                          setSelectedNetwork(option)
                          setIsNetworkDropdownOpen(false)
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
          </>

          <div className='mb-6'>
            <Label htmlFor='address' className='text-app-text-color text-sm mb-2 block'>
              {lang?.common?.address}
              <span className='text-app-danger'>*</span>
            </Label>
            <Input
              id='address'
              type='text'
              placeholder={lang?.common?.typeAddress}
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
          </div>

          {/* <p className="text-sm text-app-text-color font-medium">
            {lang?.common?.verification}
          </p>

          <div className="pt-6">
            <TabSwitcher
              tabs={tabs}
              activeTab={activeSubTab}
              onTabChange={setActiveSubTab}
            />
          </div> */}

          {/* Verification */}
          {/* <div className="mb-6">
            <Label
              htmlFor="verifyBy"
              className="text-app-text-color text-sm mb-2 block"
            >
              {lang?.common?.verify}{" "}
              {activeSubTab === "EMAIL" ? "Email" : "Phone Number"}
              <span className="text-app-danger">*</span>
            </Label>
            <div className="flex space-x-2">
              <Input
                id="verifyBy"
                type="text"
                placeholder={lang?.common?.typeEmailPassword}
                value={verifyBy}
                onChange={(e) => setVerifyBy(e.target.value)}
                className="flex-1"
              />
              <Button
                variant={"outline"}
                type="button"
                className="text-xs bg-transparent border-app-neutral600 h-10 px-4 uppercase"
              >
                {lang?.common?.sendCode}
              </Button>
            </div>
          </div>

          <div className="mb-8">
            <Label
              htmlFor="verificationOtp"
              className="text-app-text-color text-sm mb-2 block"
            >
              {activeSubTab === "EMAIL" ? "Email" : "Phone Number"}{" "}
              {lang?.common?.verificationCode}
              <span className="text-app-danger">*</span>
            </Label>
            <OtpInput onChange={handleOtpChange} />
          </div> */}

          {/* Submit Button */}
          <div className='mt-auto pb-6'>
            <Button
              type='submit'
              className='w-full bg-app-primary uppercase hover:bg-app-primary-hover text-white py-4 text-sm font-medium rounded-lg transition-colors'
            >
              {lang?.common?.saveAndVerify}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
