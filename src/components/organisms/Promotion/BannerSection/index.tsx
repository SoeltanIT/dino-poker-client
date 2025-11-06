'use client'

import BannerCard from '@/components/atoms/Card/BannerCard/BannerCard'
import Announcement from '@/components/organisms/Banner/Announcement'
import EventCarousel, { EventItemUI } from '@/components/organisms/Banner/Event'
import PromoCarousel, { type Promotion } from '@/components/organisms/Promotion/PromoCarousel'
import { LangProps } from '@/types/langProps'
import clsx from 'clsx'

type Card = {
  title: string
  subtitle?: string
  imageUrl?: string
  href?: string
  ctaText?: string
  isLoading?: boolean
}

type Props = {
  promos: Promotion[]
  isLoadingPromo?: boolean
  eventItems?: EventItemUI[] // ⬅️ data event utk carousel kiri
  isLoadingEvent?: boolean
  guideCard?: Card
  announcement?: { title?: string }[]
  className?: string
  lang: LangProps
}

export default function BannerSection({
  promos,
  isLoadingPromo,
  eventItems = [],
  isLoadingEvent,
  guideCard = {
    title: 'USER GUIDE',
    subtitle: 'on how to collect your points',
    imageUrl: '/images/dummy/dummy_user_guide.png',
    href: '/user-guide'
  },
  announcement,
  className,
  lang
}: Props) {
  // desktop height for the bottom row (px)

  return (
    <div
      className={clsx(
        // mobile: 1 kolom; md: 12 kolom, 2 baris fixed
        'grid grid-cols-1 gap-4 md:grid-cols-12 md:[grid-template-rows:60px_245px]'
      )}
    >
      {/* LEFT: Event (row-span 2, total 325px mengikuti tinggi 2 row + gap) */}
      <div className='md:col-span-3 md:row-span-2'>
        <div className='h-[180px] md:h-full'>
          <EventCarousel items={eventItems} isLoading={isLoadingEvent} className='h-full' lang={lang} />
        </div>
      </div>

      {/* TOP RIGHT: Announcement (60px) */}
      {announcement && announcement?.length > 0 && (
        <div className='md:col-span-9'>
          <div className='h-[44px] md:h-[60px]'>
            <Announcement announcement={announcement} durationSec={28} className='h-full' />
          </div>
        </div>
      )}

      {/* BOTTOM MIDDLE: Promo (245px) */}
      <div className='md:col-span-6'>
        <div className='h-[180px] md:h-[245px]'>
          <PromoCarousel
            items={promos}
            isLoading={isLoadingPromo}
            options={{ loop: true, align: 'start', duration: 20 }}
            autoplay
            intervalMs={4800}
            className='h-full'
            lang={lang}
          />
        </div>
      </div>

      {/* BOTTOM RIGHT: Guide (245px) */}
      <div className='md:col-span-3'>
        <div className='h-[180px] md:h-[245px]'>
          <BannerCard
            title={guideCard.title}
            subtitle={guideCard.subtitle}
            imageUrl={guideCard.imageUrl}
            href={guideCard.href}
            ctaText={guideCard.ctaText}
            isLoading={guideCard.isLoading}
            className='h-full'
            lang={lang}
          />
        </div>
      </div>
    </div>
  )
}
