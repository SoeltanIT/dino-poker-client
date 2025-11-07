'use client'

import { Card } from '@/components/ui/card'
import { Locale } from '@/i18n-config'
import { AnnouncementDTO } from '@/types/announcementDTO'
import { LangProps } from '@/types/langProps'
import { ArrowLeft, ImageIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export interface DetailAnnouncementProps {
  lang: LangProps
  locale?: Locale
  initialData: AnnouncementDTO
}

export default function DetailAnnouncement({ initialData, lang, locale }: DetailAnnouncementProps) {
  return (
    <div className='min-h-screen flex flex-col w-full md:w-[870px] text-app-text-color px-6 lg:px-16 my-10 mx-auto'>
      <div className='container mx-auto flex flex-col'>
        {/* Back Button */}
        <Link href={`/${locale}/announcements`}>
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
              <h1 className='text-4xl font-bold text-app-text-color mb-2'>{initialData?.title}</h1>
            </div>

            {/* Main Content Card */}
            <Card className='overflow-hidden mb-8 bg-app-white100'>
              {/* Image */}
              <div className='aspect-[2/1] w-full'>
                {!!initialData?.image ? (
                  <Image
                    src={initialData?.image}
                    alt={`Detail Announcement-${initialData?.image}-Desktop`}
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

            {/* Description */}
            <div dangerouslySetInnerHTML={{ __html: initialData?.description || '' }} className='text-app-text-color' />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className='md:hidden'>
          {/* Title */}
          <div className='mb-6'>
            <h1 className='text-2xl font-bold text-app-text-color mb-2'>{initialData?.title}</h1>
          </div>

          {/* Image */}
          <div className='aspect-video w-full rounded-t-lg overflow-hidden'>
            {!!initialData?.image ? (
              <Image
                src={initialData?.image}
                alt={`Detail Announcement-${initialData?.image}-Mobile`}
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
          <div className='text-app-text-color mb-8'>
            <div dangerouslySetInnerHTML={{ __html: initialData?.description || '' }} />
          </div>
          {/* Description */}
        </div>
      </div>
    </div>
  )
}
