import { getDictionary } from '@/dictionaries/dictionaries'
import { Locale } from '@/i18n-config'
import { getSEOPage } from '@/utils/api/internal/getSEOPage'
import type { Metadata } from 'next'
import { ReactNode } from 'react'

const commonKeyword = [
  'esports betting',
  'esports bonus',
  'betting promotions',
  'valorant betting',
  'dota 2 betting',
  'lol betting',
  'betting offers',
  'gowin promotions',
  'sportsbook bonus',
  'welcome bonus',
  '이스포츠 배팅',
  '이스포츠 보너스',
  '배팅 프로모션',
  '발로란트 배팅',
  '도타2 배팅',
  '롤 배팅',
  '보너스 혜택',
  '고윈 프로모션',
  '스포츠북 보너스',
  '웰컴 보너스'
]

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  const lang = await getDictionary(params.lang)
  let initialSEO: {
    title?: string
    description?: string
    keyword?: string | string[]
    canonical?: string
  } | null = null

  try {
    // Fetch user data
    initialSEO = await getSEOPage('promotion')
  } catch (err: any) {}

  return {
    title: initialSEO?.title ?? lang?.metadata?.promotionTitle,
    description: initialSEO?.description ?? lang?.metadata?.promotionDescription,
    keywords: initialSEO?.keyword ?? commonKeyword,
    alternates: {
      canonical: `${initialSEO?.canonical}/${params?.lang}/promotion`,
      languages: {
        en: `${initialSEO?.canonical}/en/promotion`,
        ko: `${initialSEO?.canonical}/ko/promotion`
      }
    },
    robots: {
      index: true, //must true
      follow: true //must true
    }
    // Optional: structured data/breadcrumb can also go here via JSON-LD
  }
}

export default function Layout({ children }: { children: ReactNode }) {
  return children
}
