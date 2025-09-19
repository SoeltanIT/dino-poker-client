'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MyPromotionProps } from './types'
import { TabSwitcher } from '@/components/molecules/TabSwitcher'
import { cn } from '@/lib/utils'
import { thousandSeparator } from '@/utils/helper/formatNumber'
import { ImageIcon } from 'lucide-react'
import { GetData } from '@/@core/hooks/use-query'
import { MyPromotionDTO } from '@/types/promotionDTO'
import CountdownTimerPromotion from '@/components/molecules/CountdownTimer/CountdownTimerPromotion'

export default function MyPromotion({ lang, locale }: MyPromotionProps) {
  const [activeTab, setActiveTab] = useState('ongoing')
  const tabs = [
    { name: lang?.common?.onGoing, value: 'ongoing' },
    { name: lang?.common?.history, value: 'history' }
  ]

  const { data: respPromoOnGoing, isLoading: onGoingLoading } = GetData<any>(
    '/promotion/my-promotion',
    ['getMyPromotionOngoing'],
    false,
    undefined,
    true,
    undefined,
    undefined,
    undefined,
    'GET',
    undefined,
    'promotion'
  )

  const { data: respPromoHistory, isLoading: historyLoading } = GetData<any>(
    '/promotion/my-promotion/my-promotion-history',
    ['getMyPromotionHistory'],
    false,
    undefined,
    true,
    undefined,
    undefined,
    undefined,
    'GET',
    undefined,
    'promotion'
  )

  const currentCards: MyPromotionDTO[] = activeTab === 'ongoing' ? respPromoOnGoing : respPromoHistory

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_going':
        return 'bg-app-accentYellow'
      case 'success':
        return 'bg-app-success'
      case 'failed':
        return 'bg-app-danger'
      case 'pending':
        return 'bg-app-neutral600'
      default:
        return 'bg-app-neutral600'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'on_going':
        return lang?.common?.onGoing
      case 'success':
        return lang?.common?.success
      case 'failed':
        return lang?.common?.failed
      case 'pending':
        return lang?.common?.pending
      default:
        return '-'
    }
  }

  return (
    <div className='min-h-screen flex flex-col w-full text-app-text-color px-6 lg:px-16 my-10'>
      <div className='container flex flex-col'>
        {/* Title */}
        <div className='mb-[36px]'>
          <h1 className='text-3xl font-bold text-app-text-color uppercase'>{lang?.common?.myPromotion}</h1>
        </div>

        <TabSwitcher tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Cards Grid */}
        {currentCards && currentCards?.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {currentCards.map((card, index) => {
              const turnoverTarget = Number(card?.turnover_target ?? 0)
              const turnoverAchieved = Number(card?.turnover_achieved ?? 0)

              const progressPercentage =
                turnoverTarget === 0 || turnoverAchieved === 0 ? 0 : (turnoverAchieved / turnoverTarget) * 100

              const showProgressBar = progressPercentage > 0 && isFinite(progressPercentage)

              return (
                <div key={index} className='bg-app-white100 rounded-xl overflow-hidden'>
                  {/* Game Image */}

                  <div className='flex items-center justify-center relative aspect-video'>
                    <div className='absolute bg-black/50 p-1.5 rounded-lg text-white text-xs z-50 right-2 bottom-6'>
                      {lang?.common?.promoEnd}: <CountdownTimerPromotion endDate={card?.end_date} lang={lang} />
                    </div>
                    {card?.banner ? (
                      <Image src={card.banner} alt={`My-Promotion-${card.banner}`} fill className='object-cover' />
                    ) : (
                      <ImageIcon className='w-[50%] h-[50%] text-app-neutral500' />
                    )}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
                  </div>

                  {/* Card Content */}
                  <div className='p-4'>
                    {/* Timer and Status Row */}
                    <div className='flex justify-between items-center mb-4 min-h-[40px] w-full'>
                      <div className='text-app-text-color text-[13px] w-[75%] line-clamp-2 font-medium'>
                        {card?.name}
                      </div>
                      <div
                        className={cn(
                          'text-sm font-medium text-white py-0.5 px-1 rounded',
                          getStatusColor(card.status)
                        )}
                      >
                        {getStatusText(card.status)}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className='mb-3'>
                      <div className='bg-app-bg-container-progress rounded-md h-8 relative overflow-hidden'>
                        {showProgressBar && (
                          <div
                            className={cn(
                              'h-full transition-all duration-300 rounded-md',
                              card?.status === 'failed' ? 'bg-app-bg-progress-disabled' : 'bg-app-bg-progress-bar'
                            )}
                            style={{ width: `${progressPercentage}%` }}
                          />
                        )}

                        <div className='absolute inset-0 flex items-center justify-center gap-1'>
                          <span className='text-app-neutral400 text-sm font-medium'>
                            KRW {thousandSeparator(turnoverAchieved)}
                          </span>
                          <span className='text-app-neutral400'>/</span>
                          <span className='text-app-success text-sm font-medium'>
                            KRW {thousandSeparator(turnoverTarget)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center py-24 text-center gap-4'>
            <Image
              src='/images/myPromotionNotFound.png'
              alt='No Promotion Found'
              width={1000}
              height={1000}
              className='h-[100px] w-[100px] object-contain object-center'
            />
            <span className='text-app-text-color text-sm'>{lang?.common?.noPromoFound}</span>
          </div>
        )}
      </div>
    </div>
  )
}
