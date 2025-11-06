import { ReactNode } from 'react'

import { getDictionary } from '@/dictionaries/dictionaries'
import { Locale } from '@/i18n-config'
import { getSEOPage } from '@/utils/api/internal/getSEOPage'
import type { Metadata } from 'next'

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
    initialSEO = await getSEOPage('banners')
  } catch (err: any) {}

  return {
    title: initialSEO?.title ?? lang?.metadata?.bannersTitle,
    description: initialSEO?.description ?? lang?.metadata?.bannersDescription,
    keywords: initialSEO?.keyword,
    alternates: {
      canonical: `${initialSEO?.canonical}/${params?.lang}/banners`,
      languages: {
        en: `${initialSEO?.canonical}/en/banners`,
        ko: `${initialSEO?.canonical}/ko/banners`
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
