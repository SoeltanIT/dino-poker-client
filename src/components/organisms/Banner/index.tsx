'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Locale } from '@/i18n-config'
import { BannerDTO } from '@/types/bannerDTO'
import { LangProps } from '@/types/langProps'
import { truncateHtml } from '@/utils/helper/truncateHtml'
import { ImageIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export interface BannerListingProps {
  lang?: LangProps
  locale?: Locale
  initialData?: BannerDTO[]
}

export function BannerListing({ lang, locale, initialData }: BannerListingProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const charLimit = 200
  const toggleExpanded = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id))
  }

  return (
    <div className='min-h-screen flex flex-col w-full text-app-text-color px-6 lg:px-16 my-10'>
      <div className='container mx-auto flex flex-col'>
        {/* Header */}
        <div className='mb-[36px]'>
          <h1 className='text-3xl font-bold text-app-text-color uppercase'>{lang?.common?.banners}</h1>
        </div>
        {/* Desktop Layout */}
        <div className='hidden md:flex gap-8'>
          {/* Banner Cards */}
          <div className='flex-1 flex flex-col gap-4'>
            {initialData && initialData?.length > 0 ? (
              initialData.map(item => {
                return (
                  <Link key={item.id} href={`/banners/${item.id}`}>
                    <Card className='cursor-pointer transition-opacity bg-app-white100'>
                      <CardContent className='flex gap-4'>
                        <div className='w-[350px] h-[165px] flex-shrink-0 rounded-lg overflow-hidden'>
                          {item?.image ? (
                            <Image
                              src={item.image}
                              alt={`Banner-${item.image}`}
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
                            <h3 className='text-app-text-color text-xl font-bold mb-1'>{item.title}</h3>
                            <div className='text-app-neutral500'>
                              <p>{item.sub_title}</p>
                              <p
                                dangerouslySetInnerHTML={{
                                  __html:
                                    expandedId === item.id
                                      ? item?.description || ''
                                      : truncateHtml(item?.description || '', charLimit)
                                }}
                              />
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
                <span className='mt-3'>{lang?.common?.noBannerFound}</span>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className='md:hidden'>
          {/* Banner Cards */}
          <div className='gap-4 flex flex-col'>
            {initialData && initialData.length > 0 ? (
              initialData.map(item => (
                <Link key={item.id} href={`/banners/${item.id}`}>
                  <Card className='cursor-pointer transition-opacity bg-app-white100 overflow-hidden'>
                    <div className='aspect-video w-full'>
                      {item?.image ? (
                        <Image
                          src={item.image}
                          alt={`Banner-${item.image}-Mobile`}
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
                      <h3 className='text-app-text-color text-lg font-bold mb-2'>{item.title}</h3>{' '}
                      <div className='text-app-neutral500'>
                        <p>{item.sub_title}</p>
                        <p
                          dangerouslySetInnerHTML={{
                            __html:
                              expandedId === item.id
                                ? item?.description || ''
                                : truncateHtml(item?.description || '', charLimit)
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className='flex flex-col items-center justify-center w-full h-[50vh]'>
                <ImageIcon width={75} height={75} className='text-app-text-color' />
                <span className='mt-3'>{lang?.common?.noBannerFound}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
