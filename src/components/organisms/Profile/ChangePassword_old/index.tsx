'use client'

import { IconClose, IconSize } from '@/components/atoms/Icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { queryString } from '@/utils/queryString'
import { Label } from '@radix-ui/react-label'
import { ChevronDown, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useRef, useState } from 'react'
import { ChangePasswordProps } from './types'

const typePassword = ['Account', 'Bank']

export default function ChangePassword({ lang, locale }: ChangePasswordProps) {
  const currentPathName = usePathname()
  const searchParams = useSearchParams()
  let query = {}
  if (searchParams?.entries) {
    query = Object.fromEntries(searchParams.entries())
  }

  const [selectedTypePassword, setSelectedTypePassword] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [retypeNewPassword, setRetypeNewPassword] = useState('')

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    retype: false
  })

  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const [isTypePasswordDropdownOpen, setIsTypePasswordDropdownOpen] = useState(false)

  const typePasswordDropdownRef = useRef<HTMLDivElement | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // console.log('Form submitted:', {
    //   selectedTypePassword,
    //   currentPassword,
    //   newPassword,
    //   retypeNewPassword
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
              password: undefined
            })
          }}
        >
          <IconClose size={IconSize.md} className='text-app-text-color' />
        </Link>
      </div>

      <div>
        <div className='flex items-center pb-6'>
          <div className='text-xl font-bold uppercase text-app-text-color'>{lang?.common?.changePassword}</div>
        </div>

        <form onSubmit={handleSubmit} className='flex-1 flex flex-col'>
          {/* Type Password Dropdown */}
          <div className='mb-6'>
            <Label className='text-app-text-color text-sm mb-2 block'>
              {lang?.common?.typePassword}
              <span className='text-app-danger'>*</span>
            </Label>
            <div className='relative' ref={typePasswordDropdownRef}>
              <button
                type='button'
                onClick={() => setIsTypePasswordDropdownOpen(!isTypePasswordDropdownOpen)}
                className='w-full bg-app-white100 text-app-text-color placeholder-app-neutral500 h-10 px-3 rounded-md flex items-center justify-between transition-colors'
              >
                <span className={selectedTypePassword ? 'text-app-text-color' : 'text-app-neutral500'}>
                  {selectedTypePassword || 'Select'}
                </span>
                <ChevronDown className='h-4 w-4 text-app-neutral500' />
              </button>

              {isTypePasswordDropdownOpen && (
                <div className='absolute top-full left-0 right-0 mt-1 bg-app-background-primary rounded-md shadow-lg z-10'>
                  {typePassword.map(option => (
                    <button
                      key={option}
                      type='button'
                      onClick={() => {
                        setSelectedTypePassword(option)
                        setIsTypePasswordDropdownOpen(false)
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

          {/* Current Password */}
          <div className='mb-6'>
            <Label className='text-app-text-color text-sm mb-2 block'>
              {lang?.common?.currentPassword} <span className='text-app-danger'>*</span>
            </Label>
            <div className='relative'>
              <Input
                type={showPassword.current ? 'text' : 'password'}
                placeholder={lang?.common?.typeCurrentPassword}
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                className='pr-10'
              />
              <button
                type='button'
                onClick={() => togglePasswordVisibility('current')}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-app-neutral500 hover:text-app-text-color'
              >
                {showPassword.current ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className='mb-6'>
            <Label className='text-app-text-color text-sm mb-2 block'>
              {lang?.common?.newPassword} <span className='text-app-danger'>*</span>
            </Label>
            <div className='relative'>
              <Input
                type={showPassword.new ? 'text' : 'password'}
                placeholder={lang?.common?.typeNewPassword}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className='pr-10'
              />
              <button
                type='button'
                onClick={() => togglePasswordVisibility('new')}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-app-neutral500 hover:text-app-text-color'
              >
                {showPassword.new ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Retype New Password */}
          <div className='mb-6'>
            <Label className='text-app-text-color text-sm mb-2 block'>
              {lang?.common?.retypeNewPassword} <span className='text-app-danger'>*</span>
            </Label>
            <div className='relative'>
              <Input
                type={showPassword.retype ? 'text' : 'password'}
                placeholder={lang?.common?.typeRetypeNewPassword}
                value={retypeNewPassword}
                onChange={e => setRetypeNewPassword(e.target.value)}
                className='pr-10'
              />
              <button
                type='button'
                onClick={() => togglePasswordVisibility('retype')}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-app-neutral500 hover:text-app-text-color'
              >
                {showPassword.retype ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
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
