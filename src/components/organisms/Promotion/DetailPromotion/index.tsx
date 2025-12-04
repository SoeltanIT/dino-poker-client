'use client'

import { useAppFeatures } from '@/@core/context/AppFeaturesContext'
import { GetData } from '@/@core/hooks/use-query'
import { UseServerSendEvent } from '@/@core/hooks/UseServerSendEvent'
import { BalanceResponse } from '@/@core/interface/balance/Balance'
import { UserMeResponse } from '@/@core/interface/User'
import { HeaderSheet } from '@/components/layout/header/views/transaction'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { TransferBalanceFeeResponseMapped } from '@/types/transferBalanceFeeDTO'
import { ArrowLeft, ImageIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { DetailPromotionProps } from './types'

export default function PromotionDetail({ initialData, lang, locale, isLogin }: DetailPromotionProps) {
  const [activeTab, setActiveTab] = useState<'DEPOSIT' | 'WITHDRAW'>('DEPOSIT')
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [selectedPromotion, setSelectedPromotion] = useState<any>(null)
  const { features } = useAppFeatures()

  // Format date to YYYY.M.D (without leading zeros for month and day)
  const formatStartDate = (dateString: string) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${year}.${month}.${day}`
  }

  const { data: userData, isLoading: userDataLoading } = GetData<UserMeResponse>(
    '/me', // hits your Next.js API route, not the real backend
    ['user', 'me']
  )
  const { balanceTrigger } = UseServerSendEvent()
  const { data: respBalance, isLoading: balanceLoading } = GetData<BalanceResponse>(
    '/balance', // hits your Next.js API route, not the real backend
    ['getBalance', balanceTrigger] //trigger put here if need to refresh on SSE event
  )

  const { data: respTransferBalanceFee } = GetData<TransferBalanceFeeResponseMapped>(
    '/transfer_balance_fee', // hits your Next.js API route, not the real backend
    ['getTransferBalanceFee'],
    false,
    undefined,
    true,
    undefined,
    undefined,
    undefined,
    'GET', // method
    {},
    'transaction'
  )

  return (
    <div className='min-h-screen relative flex flex-col w-full items-center justify-center text-app-text-color   mx-auto'>
      <div className='px-6 lg:px-16 w-full mb-7 py-5 border-b border-app-neutral200 border-t border-app-neutral200'>
        <Link href={`/${locale}/promotion`}>
          <button className='flex items-center gap-2 text-app-neutral600 hover:text-app-neutral700  p-0 h-auto bg-transparent border-0 cursor-pointer transition-colors'>
            <ArrowLeft className='w-5 h-5' />
            <span className='text-base'>{lang?.common?.back}</span>
          </button>
        </Link>
      </div>
      <div className='container flex md:w-[870px] flex-col'>
        {/* Back Button */}

        {/* Desktop Layout */}
        <div className='hidden md:block'>
          <div className='mx-auto'>
            {/* Main Content Card */}
            <Card className='overflow-hidden mb-4 bg-app-white100 rounded-2xl'>
              {/* Image */}
              <div className='aspect-[2/1] w-full'>
                {initialData?.banner !== '' ? (
                  <Image
                    src={initialData?.banner}
                    alt={`Detail Banner-${initialData?.banner}-Desktop`}
                    width={800}
                    height={400}
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <div className='flex items-center justify-center w-full h-full'>
                    <ImageIcon width={75} height={75} className='text-app-text-color' />
                  </div>
                )}
              </div>
            </Card>

            {/* Info Card - Light blue card below banner */}
            <Card
              className='rounded-2xl shadow-sm border border-blue-200/30 mb-8 p-5 md:p-6'
              style={{ backgroundColor: '#F0F8FF' }}
            >
              <div className='flex flex-col gap-3'>
                {/* Line 1: Rocket icon + Title */}
                <div className='flex items-center gap-2'>
                  <h2 className='text-base md:text-4xl font-medium text-app-text-color leading-tight'>
                    {initialData?.name}
                  </h2>
                </div>
                {/* Subtitle */}
                <p className='text-sm md:text-base font-bold text-app-text-color'>{initialData.sub_title || ''}</p>
                {initialData?.start_date && (
                  <p className='text-sm md:text-sm font-thin text-app-text-color'>
                    {locale === 'ko' ? '시작일' : 'Start date'}: {formatStartDate(initialData.start_date)}
                  </p>
                )}

                {isLogin && (
                  <Button
                    size='lg'
                    onClick={() => {
                      setSelectedPromotion({
                        id: initialData?.id,
                        name: initialData?.name
                      })
                      setActiveTab('DEPOSIT')
                      setIsSheetOpen(true)
                    }}
                    className='bg-app-primary hover:bg-app-primary-hover uppercase text-white px-8 py-3 text-lg font-semibold'
                  >
                    {lang?.common?.claim}
                  </Button>
                )}
              </div>
            </Card>

            {/* Description */}
            <div
              dangerouslySetInnerHTML={{ __html: initialData?.content }}
              className='text-app-text-color promotion-content'
            />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className='md:hidden'>
          {/* Image */}
          <div className='aspect-video w-full rounded-2xl overflow-hidden mb-3'>
            {initialData?.banner !== 'image' ? (
              <Image
                src={initialData?.banner}
                alt={`Detail Banner-${initialData?.banner}-Mobile`}
                width={800}
                height={400}
                className='w-full h-full object-cover'
              />
            ) : (
              <div className='flex items-center justify-center w-full h-full'>
                <ImageIcon width={45} height={45} className='text-app-text-color' />
              </div>
            )}
          </div>

          {/* Info Card - Light blue card below banner */}
          <Card
            className='rounded-2xl shadow-sm border border-blue-200/30 mb-6 p-4'
            style={{ backgroundColor: '#F0F8FF' }}
          >
            <div className='flex flex-col gap-2.5'>
              {/* Line 1: Rocket icon + Title */}
              <div className='flex items-center gap-2'>
                <h2 className='text-3xl font-medium text-app-text-color leading-tight'>{initialData?.name}</h2>
              </div>

              {/* Subtitle */}
              <p className='text-xs font-semibold text-app-text-color'>{initialData.sub_title || ''}</p>

              {/* Start Date */}
              {initialData?.start_date && (
                <p className='text-xs font-thin text-app-text-color'>
                  {locale === 'ko' ? '시작일' : 'Start date'}: {formatStartDate(initialData.start_date)}
                </p>
              )}
            </div>
          </Card>

          {/* Description */}
          <div
            dangerouslySetInnerHTML={{ __html: initialData?.content }}
            className='text-app-text-color mb-8 promotion-content'
          />

          {/* Claim Button */}
          {isLogin && (
            <Button
              onClick={() => {
                setSelectedPromotion({
                  id: initialData?.id,
                  name: initialData?.name
                })
                setActiveTab('DEPOSIT')
                setIsSheetOpen(true)
              }}
              className='w-full bg-app-primary hover:bg-app-primary-hover uppercase text-white py-4 text-lg font-semibold'
            >
              {lang?.common?.claim}
            </Button>
          )}
        </div>
      </div>
      {activeTab && (
        <HeaderSheet
          selectedPromotion={selectedPromotion}
          open={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          defaultValue={activeTab}
          lang={lang}
          locale={locale}
          data={userData}
          balance={respBalance?.data}
          features={features}
          dataFee={respTransferBalanceFee?.data}
        />
      )}
    </div>
  )
}
