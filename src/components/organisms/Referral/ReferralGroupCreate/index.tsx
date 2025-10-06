'use client'

import { LoadingTable, LoadingText } from '@/components/atoms/Loading'
import { ChangeSharedSettingSheet } from '@/components/organisms/Referral/ReferralGroupSettings/changeSharedSetting'
import { useReferralSettings } from '@/utils/api/internal/getReferralSettings'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { MyReferralGroupCreateProps } from './types'

export default function MyReferralGroupCreate({ lang, locale, initialData }: MyReferralGroupCreateProps) {
  // Use client-side hooks for data fetching with server-side initial data
  const {
    data: respReferralSettings,
    isFetching: isFetchingSettings,
    error: settingsError,
    refetch: refetchSettings
  } = useReferralSettings(initialData || undefined)
  const settings = respReferralSettings?.data
  const isLoading = isFetchingSettings

  return (
    <div className='min-h-screen flex flex-col w-full text-app-text-color px-6 lg:px-20 my-10 mx-auto'>
      <div className='flex flex-col'>
        {/* Back Button */}

        {/* Desktop Header */}
        <div className='flex lg:flex-row flex-col mb-4 lg:mb-0 items-center justify-between'>
          <div className='w-full lg:mb-8 mb-2'>
            <Link
              href={`/${locale}/my-referral`}
              className='flex items-center gap-2 text-app-text-color hover:opacity-90 mb-2 p-0 h-auto hover:bg-transparent'
            >
              <ArrowLeft className='w-5 h-5' />
              <span>{lang?.common?.back}</span>
            </Link>
            <div className='flex items-center gap-2 justify-between w-full flex-wrap'>
              <h1 className='text-2xl font-bold uppercase'>{lang?.common?.sharedSettings}</h1>
              <ChangeSharedSettingSheet
                lang={lang || {}}
                initialData={{
                  user_share: settings?.user_share || 0,
                  affiliate_share: settings?.affiliate_share || 0
                }}
                onSuccess={() => refetchSettings()}
              />
            </div>
          </div>
        </div>

        <div className='lg:flex lg:gap-8'>
          {/* Settings List */}
          <div className='flex-1'>
            {/* Mobile Settings List */}
            <div className='lg:hidden'>
              {isLoading ? (
                <LoadingText lines={3} />
              ) : settings ? (
                <div className='space-y-3'>
                  <div className='bg-app-background-secondary rounded-lg p-4 border border-gray-800 space-y-2'>
                    <div className='flex justify-between items-center'>
                      <div className='text-app-neutral500 text-sm'>{lang?.common?.availableShare}</div>
                      <div className='text-app-neutral500 text-sm'>{settings.available_share}</div>
                    </div>
                    <div className='flex justify-between items-center'>
                      <div className='text-app-neutral500 text-sm'>{lang?.common?.userShare}</div>
                      <div className='text-sm'>{settings.user_share}%</div>
                    </div>

                    <div className='flex justify-between items-center'>
                      <div className='text-app-neutral500 text-sm'>{lang?.common?.affiliateShare}</div>
                      <div className='text-app-success font-bold text-sm'>{settings.affiliate_share}%</div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className='p-8 text-center flex flex-col gap-3 items-center'>
                    <Image
                      src={'/images/betNotFound.png'}
                      alt='Bet Not Found'
                      width={1000}
                      height={1000}
                      className='h-[100px] w-[100px] object-contain object-center'
                    />
                    <p className='text-gray-300'>{lang?.common?.noSettings}.</p>
                  </div>
                </>
              )}
            </div>

            {/* Desktop Table */}
            <div className='hidden lg:block'>
              <div className='overflow-hidden'>
                <div className='hidden items-center md:grid md:grid-cols-3 gap-4 px-4 py-3 bg-app-background-secondary rounded-[8px] mb-[10px] text-sm font-semibold text-app-text-header-table uppercase'>
                  <div>{lang?.common?.availableShare}</div>
                  <div>{lang?.common?.userShare}</div>
                  <div>{lang?.common?.affiliateShare}</div>
                </div>

                <div className='rounded-lg bg-app-background-secondary border border-app-neutral600'>
                  {isLoading ? (
                    <LoadingTable columns={3} rows={1} showHeader={false} />
                  ) : settings ? (
                    [settings].map((setting, index) => (
                      <div key={index} className='grid grid-cols-3 gap-4 p-4 last:border-b-0'>
                        <div className='text-app-text-color'>{setting.available_share}</div>
                        <div className='text-app-text-color'>{setting.user_share}%</div>
                        <div className='text-app-text-color'>{setting.affiliate_share}%</div>
                      </div>
                    ))
                  ) : (
                    <div className='p-8 text-center flex flex-col gap-3 items-center'>
                      <Image
                        src={'/images/betNotFound.png'}
                        alt='Bet Not Found'
                        width={1000}
                        height={1000}
                        className='h-[100px] w-[100px] object-contain object-center'
                      />
                      <p className='text-gray-300'>{lang?.common?.noSettings}.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
