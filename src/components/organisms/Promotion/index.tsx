'use client'

import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, ImageIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { PromotionProps } from './types'

export default function PromotionListing({ lang, locale, initialData }: PromotionProps) {
  // Format date to YYYY.M.D (without leading zeros for month and day)
  const formatStartDate = (dateString?: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${year}.${month}.${day}`
  }

  return (
    <div className='min-h-screen flex flex-col px-2 md:px-0  items-center w-full text-app-text-color  '>
      <div className='px-6 lg:px-16 w-full mb-7 py-5 border-b border-app-neutral200 border-t border-app-neutral200'>
        <Link href={`/${locale}/promotion`}>
          <button className='flex items-center gap-2 text-app-neutral600 hover:text-app-neutral700  p-0 h-auto bg-transparent border-0 cursor-pointer transition-colors'>
            <ArrowLeft className='w-5 h-5' />
            <span className='text-base'>{lang?.common?.back}</span>
          </button>
        </Link>
      </div>
      <div className='container md:w-[876px] w-full mx-auto flex flex-col'>
        {/* Header */}
        <div className='mb-[36px]'>
          <h1 className='text-3xl font-bold text-app-text-color mb-2'>{lang?.common?.promotion}</h1>
          <p className='text-base text-gray-500'>{lang?.common?.promotionDescription}</p>
        </div>

        {/* Desktop Layout */}
        <div className='hidden md:flex gap-8'>
          {/* Promotion Cards */}
          <div className='flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6 gap-4'>
            {initialData && initialData?.length > 0 ? (
              initialData.map(promo => {
                return (
                  <Link className='col-span-2' key={promo.id} href={`/promotion/${promo.id}`}>
                    <Card className='cursor-pointer transition-opacity bg-white overflow-hidden rounded-lg shadow-sm flex flex-col hover:shadow-md transition-shadow'>
                      {/* Banner Section */}
                      <div className='w-full h-[180px] relative overflow-hidden flex-shrink-0'>
                        {promo?.banner ? (
                          <Image
                            src={promo.banner}
                            alt={`Promotion Banner-${promo.banner}-Desktop`}
                            width={200}
                            height={180}
                            className='w-full h-full object-cover'
                          />
                        ) : (
                          <div className='flex items-center justify-center w-full h-full bg-gradient-to-br from-purple-600 via-purple-500 to-blue-400'>
                            <ImageIcon width={40} height={40} className='text-white' />
                          </div>
                        )}
                      </div>
                      {/* White Background Section with Promotion Details */}
                      <CardContent className='p-3 bg-white flex-1 flex flex-col justify-between'>
                        <div className='flex flex-col gap-1.5'>
                          {/* Rocket emoji + Title */}
                          <div className='flex items-center gap-1'>
                            <h3 className='text-app-text-color text-sm sm:text-base md:text-lg  font-medium line-clamp-2'>
                              {promo.name}
                            </h3>
                          </div>
                          {/* Subtitle - Bold */}
                          {promo?.sub_title && (
                            <p className='text-app-text-color text-sm font-bold line-clamp-2'>{promo.sub_title}</p>
                          )}
                        </div>
                        {/* Start Date */}
                        {promo?.start_date && (
                          <p className='text-[12px] text-gray-500 mt-auto'>
                            {locale === 'ko' ? '시작일' : 'Start date'}: {formatStartDate(promo.start_date)}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                )
              })
            ) : (
              <div className='flex flex-col items-center justify-center w-full h-[50vh] col-span-full'>
                <ImageIcon width={75} height={75} className='text-app-text-color' />
                <span className='mt-3'>{lang?.common?.noPromoFound}</span>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className='md:hidden'>
          {/* Promotion Cards */}
          <div className='grid grid-cols-1  gap-3'>
            {initialData && initialData.length > 0 ? (
              initialData.map(promo => (
                <Link key={promo.id} href={`/promotion/${promo.id}`}>
                  <Card className='cursor-pointer transition-opacity bg-white overflow-hidden rounded-lg shadow-sm w-full flex flex-col'>
                    {/* Banner Section */}
                    <div className='w-full h-[150px] relative overflow-hidden flex-shrink-0'>
                      {promo?.banner ? (
                        <Image
                          src={promo.banner}
                          alt={`Promotion Banner-${promo.banner}-Mobile`}
                          width={200}
                          height={150}
                          className='w-full h-full object-cover'
                        />
                      ) : (
                        <div className='flex items-center justify-center w-full h-full bg-gradient-to-br from-purple-600 via-purple-500 to-blue-400'>
                          <ImageIcon width={40} height={40} className='text-white' />
                        </div>
                      )}
                    </div>
                    {/* White Background Section with Promotion Details */}
                    <CardContent className='p-3 bg-white flex flex-col'>
                      <div className='flex flex-col gap-1.5'>
                        {/* Rocket emoji + Title */}
                        <div className='flex items-center gap-1'>
                          <h3 className='text-app-text-color text-base font-medium line-clamp-2'>{promo.name}</h3>
                        </div>
                        {/* Subtitle - Bold */}
                        {promo?.sub_title && (
                          <p className='text-app-text-color text-sm font-medium line-clamp-2'>{promo.sub_title}</p>
                        )}
                      </div>
                      {/* Start Date */}
                      {promo?.start_date && (
                        <p className='text-[10px] text-gray-500 '>
                          {locale === 'ko' ? '시작일' : 'Start date'}: {formatStartDate(promo.start_date)}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className='flex flex-col items-center justify-center w-full h-[50vh] col-span-full'>
                <ImageIcon width={75} height={75} className='text-app-text-color' />
                <span className='mt-3'>{lang?.common?.noPromoFound}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
