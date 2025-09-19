'use client'

import CountdownTimerPromotion from '@/components/molecules/CountdownTimer/CountdownTimerPromotion'
import { Card, CardContent } from '@/components/ui/card'
import { Clock, ImageIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { PromotionProps } from './types'
import { truncateHtml } from '@/utils/helper/truncateHtml'
import { useState } from 'react'

export default function PromotionListing({ lang, locale, initialData }: PromotionProps) {
  // const [activeFilter, setActiveFilter] = useState<'all' | 'trending' | 'member'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const charLimit = 200

  const toggleExpanded = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id))
  }

  return (
    <div className='min-h-screen flex flex-col w-full text-app-text-color px-6 lg:px-16 my-10'>
      <div className='container flex flex-col'>
        {/* Header */}
        <div className='mb-[36px]'>
          <h1 className='text-3xl font-bold text-app-text-color uppercase'>{lang?.common?.promotion}</h1>
        </div>

        {/* Desktop Layout */}
        <div className='hidden md:flex gap-8'>
          {/* Filter Sidebar */}
          {/* <div className='w-64 flex-shrink-0'>
            <div className='space-y-2'>
              <Button
                onClick={() => setActiveFilter('all')}
                variant={activeFilter === 'all' ? 'default' : 'outline'}
                className={`w-full justify-start gap-3 h-12 ${
                  activeFilter === 'all'
                    ? 'bg-[#5f32e7] hover:bg-[#5f32e7]/90 text-white border-none'
                    : 'bg-transparent border-[#FFFFFF1A] text-app-neutral500 hover:text-white hover:bg-transparent'
                }`}
              >
                <div className='w-5 h-5 rounded bg-gray-600'></div>
                <span className='font-medium'>ALL</span>
              </Button>

              <Button
                onClick={() => setActiveFilter('trending')}
                variant={activeFilter === 'trending' ? 'default' : 'outline'}
                className={`w-full justify-start gap-3 h-12 ${
                  activeFilter === 'trending'
                    ? 'bg-[#5f32e7] hover:bg-[#5f32e7]/90 text-white border-none'
                    : 'bg-transparent border-[#FFFFFF1A] text-app-neutral500 hover:text-white hover:bg-transparent'
                }`}
              >
                <TrendingUp className='w-5 h-5' />
                <span className='font-medium'>TRENDING</span>
              </Button>

              <Button
                onClick={() => setActiveFilter('member')}
                variant={activeFilter === 'member' ? 'default' : 'outline'}
                className={`w-full justify-start gap-3 h-12 ${
                  activeFilter === 'member'
                    ? 'bg-[#5f32e7] hover:bg-[#5f32e7]/90 text-white border-none'
                    : 'bg-transparent border-[#FFFFFF1A] text-app-neutral500 hover:text-white hover:bg-transparent'
                }`}
              >
                <Users className='w-5 h-5' />
                <span className='font-medium'>MEMBER</span>
              </Button>
            </div>
          </div> */}

          {/* Promotion Cards */}
          <div className='flex-1 flex flex-col gap-4'>
            {initialData && initialData?.length > 0 ? (
              initialData.map(promo => {
                return (
                  <Link key={promo.id} href={`/promotion/${promo.id}`}>
                    <Card className='cursor-pointer transition-opacity bg-app-white100'>
                      <CardContent className='flex gap-4'>
                        <div className='w-[350px] h-[165px] flex-shrink-0 rounded-lg overflow-hidden'>
                          {promo?.banner ? (
                            <Image
                              src={promo.banner}
                              alt={`Promotion Banner-${promo.banner}-Desktop`}
                              width={150}
                              height={150}
                              className='w-full h-full object-cover'
                            />
                          ) : (
                            <div className='flex items-center justify-center w-full h-full'>
                              <ImageIcon width={75} height={75} className='text-app-text-color' />
                            </div>
                          )}
                        </div>
                        <div className='flex-1 flex flex-col justify-between py-4 pr-4'>
                          <div>
                            <div className='flex items-center gap-2 text-app-neutral500 text-sm mb-2'>
                              <Clock className='w-4 h-4' />
                              <CountdownTimerPromotion endDate={promo?.end_date} lang={lang} />
                            </div>
                            <h3 className='text-app-text-color text-xl font-bold mb-1'>{promo.name}</h3>
                            <div className='text-app-neutral500'>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html:
                                    expandedId === promo.id
                                      ? promo?.content || ''
                                      : truncateHtml(promo?.content || '', charLimit)
                                }}
                              />

                              {(promo?.content?.length ?? 0) > charLimit && (
                                <button
                                  onClick={e => {
                                    e.preventDefault() // prevent Link click
                                    toggleExpanded(promo.id)
                                  }}
                                  className='text-xs text-app-text-color mt-1 underline'
                                >
                                  {expandedId === promo.id
                                    ? lang?.common?.seeLess || 'See Less'
                                    : lang?.common?.seeMore || 'See More →'}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })
            ) : (
              <div className='flex flex-col items-center justify-center w-full h-[50vh]'>
                <ImageIcon width={75} height={75} className='text-app-text-color' />
                <span className='mt-3'>{lang?.common?.noPromoFound}</span>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className='md:hidden'>
          {/* Filter Tabs */}
          {/* <div className='flex gap-2 mb-6 overflow-x-auto pb-2'>
            <Button
              onClick={() => setActiveFilter('all')}
              variant={activeFilter === 'all' ? 'default' : 'outline'}
              size='sm'
              className={`flex items-center gap-2 rounded-full whitespace-nowrap ${
                activeFilter === 'all'
                  ? 'bg-[#5f32e7] hover:bg-[#5f32e7]/90 text-white border-none'
                  : 'bg-transparent border-[#FFFFFF1A] text-app-neutral500 hover:text-white hover:bg-transparent'
              }`}
            >
              <div className='w-4 h-4 rounded bg-gray-600'></div>
              <span className='font-medium'>ALL</span>
            </Button>

            <Button
              onClick={() => setActiveFilter('trending')}
              variant={activeFilter === 'trending' ? 'default' : 'outline'}
              size='sm'
              className={`flex items-center gap-2 rounded-full whitespace-nowrap ${
                activeFilter === 'trending'
                  ? 'bg-[#5f32e7] hover:bg-[#5f32e7]/90 text-white border-none'
                  : 'bg-transparent border-[#FFFFFF1A] text-app-neutral500 hover:text-white hover:bg-transparent'
              }`}
            >
              <TrendingUp className='w-4 h-4' />
              <span className='font-medium'>TRENDING</span>
            </Button>

            <Button
              onClick={() => setActiveFilter('member')}
              variant={activeFilter === 'member' ? 'default' : 'outline'}
              size='sm'
              className={`flex items-center gap-2 rounded-full whitespace-nowrap ${
                activeFilter === 'member'
                  ? 'bg-[#5f32e7] hover:bg-[#5f32e7]/90 text-white border-none'
                  : 'bg-transparent border-[#FFFFFF1A] text-app-neutral500 hover:text-white hover:bg-transparent'
              }`}
            >
              <Users className='w-4 h-4' />
              <span className='font-medium'>MEMBER</span>
            </Button>
          </div> */}

          {/* Promotion Cards */}
          <div className='gap-4 flex flex-col'>
            {initialData &&
              initialData.map(promo => (
                <Link key={promo.id} href={`/promotion/${promo.id}`}>
                  <Card className='cursor-pointer transition-opacity bg-app-white100 overflow-hidden'>
                    <div className='aspect-video w-full'>
                      {promo?.banner ? (
                        <Image
                          src={promo.banner}
                          alt={`Promotion Banner-${promo.banner}-Mobile`}
                          width={150}
                          height={150}
                          className='w-full h-full object-cover'
                        />
                      ) : (
                        <div className='flex items-center justify-center w-full h-full'>
                          <ImageIcon width={75} height={75} className='text-app-text-color' />
                        </div>
                      )}
                    </div>
                    <CardContent className='p-4'>
                      <div className='flex items-center gap-2 text-app-neutral500 text-sm mb-3'>
                        <Clock className='w-4 h-4' />
                        <CountdownTimerPromotion endDate={promo?.end_date} lang={lang} />
                      </div>
                      <h3 className='text-app-text-color text-lg font-bold mb-2'>{promo.name}</h3>
                      <div className='text-app-neutral500'>
                        <div
                          dangerouslySetInnerHTML={{
                            __html:
                              expandedId === promo.id
                                ? promo?.content || ''
                                : truncateHtml(promo?.content || '', charLimit)
                          }}
                        />

                        {(promo?.content?.length ?? 0) > charLimit && (
                          <button
                            onClick={e => {
                              e.preventDefault() // prevent Link click
                              toggleExpanded(promo.id)
                            }}
                            className='text-xs text-app-text-color mt-1 underline'
                          >
                            {expandedId === promo.id
                              ? lang?.common?.seeLess || 'See Less'
                              : lang?.common?.seeMore || 'See More →'}
                          </button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
