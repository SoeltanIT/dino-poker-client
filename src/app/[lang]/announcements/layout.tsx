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
    initialSEO = await getSEOPage('announcements')
  } catch (err: any) {}

  return {
    title: initialSEO?.title ?? lang?.metadata?.announcementsTitle,
    description: initialSEO?.description ?? lang?.metadata?.announcementsDescription,
    keywords: initialSEO?.keyword,
    alternates: {
      canonical: `${initialSEO?.canonical}/${params?.lang}/announcements`,
      languages: {
        en: `${initialSEO?.canonical}/en/announcements`,
        ko: `${initialSEO?.canonical}/ko/announcements`
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
