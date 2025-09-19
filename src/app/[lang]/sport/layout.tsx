import { ReactNode } from 'react'

import type { Metadata } from 'next'
import { handleServerAuthError } from '@/@core/lib/server-auth-utils'
import { getSEOPage } from '@/utils/api/internal/getSEOPage'
import { getDictionary } from '@/dictionaries/dictionaries'
import { Locale } from '@/i18n-config'

const commonKeyword: string[] = [
  'sports betting',
  'online sports betting',
  'football betting',
  'basketball betting',
  'tennis betting',
  'soccer odds',
  'live sports odds',
  'bet on sports',
  'esports betting',
  'online esports betting',
  'CSGO betting',
  'League of Legends betting',
  'Dota 2 betting',
  'Valorant betting',
  'FIFA esports betting',
  'live betting',
  'in-play betting',
  'safe betting site',
  'real money betting',
  'sportsbook online',

  '스포츠 베팅',
  '온라인 스포츠 베팅',
  '축구 베팅',
  '농구 베팅',
  '테니스 베팅',
  '야구 베팅',
  '라이브 스포츠 베팅',
  'e스포츠 베팅',
  '온라인 e스포츠 베팅',
  '리그오브레전드 베팅',
  '롤 베팅',
  '도타2 베팅',
  '발로란트 베팅',
  '피파 e스포츠 베팅',
  '라이브 베팅',
  '인플레이 베팅',
  '안전한 베팅 사이트',
  '실시간 베팅',
  '스포츠북 온라인'
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
    initialSEO = await getSEOPage('sport')
  } catch (err: any) {}

  return {
    title: initialSEO?.title ?? lang?.metadata?.sportTitle,
    description: initialSEO?.description ?? lang?.metadata?.sportDescription,
    keywords: initialSEO?.keyword ?? commonKeyword,
    alternates: {
      canonical: `${initialSEO?.canonical}/${params?.lang}/sport`,
      languages: {
        en: `${initialSEO?.canonical}/en/sport`,
        ko: `${initialSEO?.canonical}/ko/sport`
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
