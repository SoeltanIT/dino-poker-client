'use client'

import PromoSideCard from '@/components/atoms/Card/PromotionCard/PromoSideCard'
import Announcement from '@/components/organisms/Banner/Announcement'
import PromoCarousel, { type Promotion } from '@/components/organisms/Promotion/PromoCarousel'
import { LangProps } from '@/types/langProps'

type Props = {
  promos: Promotion[]
  isLoadingPromo?: boolean
  eventCard?: {
    title: string
    subtitle?: string
    imageUrl?: string
    href?: string
    ctaText?: string
    isLoading?: boolean
  }
  guideCard?: {
    title: string
    subtitle?: string
    imageUrl?: string
    href?: string
    ctaText?: string
    isLoading?: boolean
  }
  announcement?: { message?: string; winners?: string[]; durationSec?: number }
  lang: LangProps
}

export default function PromoHeaderSection({
  promos,
  isLoadingPromo,
  eventCard = {
    title: 'YEAR END EVENT',
    subtitle: 'follow and get the benefits',
    imageUrl: '/images/dummy/dummy_event.png',
    href: '/events',
    ctaText: 'MORE INFO'
  },
  guideCard = {
    title: 'USER GUIDE',
    subtitle: 'on how to collect your points',
    imageUrl: '/images/dummy/dummy_user_guide.png',
    href: '/user-guide',
    ctaText: 'MORE INFO'
  },
  announcement,
  lang
}: Props) {
  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-12'>
      {/* KIRI: Event (row span 2) */}
      <div className='md:col-span-3 md:row-span-2'>
        <PromoSideCard
          title={eventCard.title}
          subtitle={eventCard.subtitle}
          imageUrl={eventCard.imageUrl}
          href={eventCard.href}
          ctaText={eventCard.ctaText}
          isLoading={eventCard.isLoading}
          className='h-full'
        />
      </div>

      {/* ATAS: Announcement (span tengah+kanan) */}
      <div className='md:col-span-9'>
        <Announcement
          durationSec={announcement?.durationSec ?? 28}
          winners={announcement?.winners}
          // message bisa dimix via props kalau perlu
        />
      </div>

      {/* BAWAH: Promo (tengah) + Guide (kanan) */}
      <div className='md:col-span-6'>
        <PromoCarousel
          items={promos}
          isLoading={isLoadingPromo}
          options={{ loop: true, align: 'start', duration: 20 }}
          autoplay
          intervalMs={4800}
          lang={lang}
        />
      </div>

      <div className='md:col-span-3'>
        <PromoSideCard
          title={guideCard.title}
          subtitle={guideCard.subtitle}
          imageUrl={guideCard.imageUrl}
          href={guideCard.href}
          ctaText={guideCard.ctaText}
          isLoading={guideCard.isLoading}
        />
      </div>
    </div>
  )
}
