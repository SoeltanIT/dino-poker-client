'use client'

import { GetData } from '@/@core/hooks/use-query'
import { UserMeResponse } from '@/@core/interface/User'
import DepositWithdrawSheet from '@/components/layout/header/views/transaction/DepositWithdrawSheet'
import CountdownTimerPromotion from '@/components/molecules/CountdownTimer/CountdownTimerPromotion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Clock, ImageIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { DetailPromotionProps } from './types'

export default function PromotionDetail({ initialData, lang, locale, isLogin }: DetailPromotionProps) {
  const [activeTab, setActiveTab] = useState<'DEPOSIT' | 'WITHDRAW'>('DEPOSIT')
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [selectedPromotion, setSelectedPromotion] = useState<any>(null)

  const { data: userData, isLoading: userDataLoading } = GetData<UserMeResponse>(
    '/me', // hits your Next.js API route, not the real backend
    ['user', 'me']
  )

  return (
    <div className='min-h-screen flex flex-col w-full md:w-[870px] text-app-text-color px-6 lg:px-16 my-10 mx-auto'>
      <div className='container flex flex-col'>
        {/* Back Button */}
        <Link href={`/${locale}/promotion`}>
          <button className='flex items-center gap-2 text-app-text-color hover:opacity-90 mb-6 p-0 h-auto hover:bg-transparent'>
            <ArrowLeft className='w-5 h-5' />
            <span>{lang?.common?.back}</span>
          </button>
        </Link>

        {/* Desktop Layout */}
        <div className='hidden md:block'>
          <div className='mx-auto'>
            {/* Title */}
            <div className='mb-8'>
              <h1 className='text-4xl font-bold text-app-text-color mb-2'>{initialData?.name}</h1>
            </div>

            {/* Main Content Card */}
            <Card className='overflow-hidden mb-8 bg-app-white100'>
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

              {/* Timer and Claim Button */}
              <CardContent className='p-6 flex items-center justify-between'>
                <div className='flex items-center gap-2 text-app-neutral500'>
                  <Clock className='w-5 h-5' />
                  <CountdownTimerPromotion endDate={initialData?.end_date} lang={lang} />
                </div>
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
              </CardContent>
            </Card>

            {/* Description */}
            <div dangerouslySetInnerHTML={{ __html: initialData?.content }} className='text-app-text-color' />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className='md:hidden'>
          {/* Title */}
          <div className='mb-6'>
            <h1 className='text-2xl font-bold text-app-text-color mb-2'>{initialData?.name}</h1>
            {/* <p className='text-app-neutral500'>{initialData.subtitle}</p> */}
          </div>

          {/* Image */}
          <div className='aspect-video w-full rounded-t-lg overflow-hidden'>
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

          {/* Timer */}
          <div className='mb-6 bg-app-white100 flex items-center gap-2 text-app-neutral500 p-3 rounded-b-lg'>
            <Clock className='w-4 h-4' />
            <CountdownTimerPromotion endDate={initialData?.end_date} lang={lang} />
          </div>

          {/* Description */}
          <div dangerouslySetInnerHTML={{ __html: initialData?.content }} className='text-app-text-color mb-8' />

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
        <DepositWithdrawSheet
          selectedPromotion={selectedPromotion}
          open={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          defaultValue={activeTab}
          lang={lang}
          locale={locale}
          data={userData}
        />
      )}
    </div>
  )
}
