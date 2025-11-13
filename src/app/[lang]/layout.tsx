import { Providers } from '@/components/providers/Providers'
import AppTemplate from '@/components/templates/App'
import { getDictionary } from '@/dictionaries/dictionaries'
import { Locale } from '@/i18n-config'
import { ConfigType } from '@/types/config'
import { getSEOPage } from '@/utils/api/internal/getSEOPage'
import { getWebConfig } from '@/utils/api/internal/webConfig'
import { getAppFeaturesServer } from '@/utils/server/app-features'
import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { ToastContainer } from 'react-toastify'
import { baiJamjuree, notoSansKR } from '../font'
import '../globals.css'

// Viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1
}

const commonKeywords = [
  'poker',
  'poker korea',
  'kpoker',
  'online poker',
  'texas holdem',
  'poker tournaments',
  'live poker',
  'poker betting',
  'poker strategy',
  'poker hands',
  'poker rooms',
  '토토',
  '고윈',
  '고윈코리아',
  '포커',
  '텍사스 홀덤',
  '온라인 포커',
  '포커 토너먼트'
]

// ✅ Dynamic metadata generation per locale
export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  const lang = await getDictionary(params.lang)

  let initialSEO: {
    title?: string
    description?: string
    keyword?: string | string[]
    canonical?: string
    ogImage?: string | string[]
    twitterImage?: string | string[]
  } | null = null

  try {
    // Fetch user data
    initialSEO = await getSEOPage('home')
  } catch (err: any) {}

  const localizedKeywords: Record<Locale, string[]> = {
    en: [
      ...commonKeywords,
      'poker platform',
      'play and win poker',
      'live poker odds',
      'real money poker',
      'no limit holdem',
      'online poker rooms'
    ],
    ko: [
      ...commonKeywords,
      '포커 플랫폼',
      '포커로 플레이하고 승리하세요',
      '실시간 포커 배당률',
      '실전 머니 포커',
      '노리밋 홀덤',
      '온라인 포커룸'
    ]
  }

  let canonical = 'https://kpoker.gg'

  return {
    title: initialSEO?.title ?? lang.metadata?.title ?? 'KPOKER.gg',
    description: initialSEO?.description ?? lang.metadata?.description,
    keywords: initialSEO?.keyword ?? localizedKeywords[params.lang],

    alternates: {
      canonical: `${initialSEO?.canonical ?? canonical}`,
      languages: {
        en: `${initialSEO?.canonical ?? canonical}/en`,
        ko: `${initialSEO?.canonical ?? canonical}/ko`
      }
    }
  }
}

export default async function RootLayout({
  children,
  ...props
}: {
  children: React.ReactNode
  params: { lang: Locale }
}) {
  const params = props?.params ?? { lang: 'ko' }
  const lang = await getDictionary(params.lang)

  const webConfig = await getWebConfig()
  const initialFeatures = await getAppFeaturesServer()

  const configMap = Object.fromEntries(webConfig.map(item => [item.key, item.value])) as ConfigType

  return (
    <html lang={params.lang} suppressHydrationWarning>
      <head>
        <meta charSet='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover' />
        <meta name='robots' content='index, follow' />
        <meta name='theme-color' content='#5f32e7' />
        <link rel='icon' href='/favicon.ico' />

        {/* ✅ JSON-LD Structured Data */}
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'KPOKER',
              url: 'https://kpoker.gg/',
              alternateName: ['KPOKER'],
              inLanguage: ['en', 'ko'],
              publisher: {
                '@type': 'Organization',
                name: 'KPOKER',
                url: 'https://kpoker.gg/',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://kpoker.gg/images/logo.png',
                  width: 512,
                  height: 512
                }
              }
            })
          }}
        />

        {/* VP Height Fix Script */}
        <script
          type='text/javascript'
          dangerouslySetInnerHTML={{
            __html: `
        function uVph() {
          if (window.innerWidth < 768) {
            document.documentElement.style.setProperty("--vp-height", window.innerHeight + "px");
          } else {
            document.documentElement.style.removeProperty("--vp-height");
          }
        }
        window.addEventListener("resize", uVph);
        uVph();
      `
          }}
          async
        />
      </head>
      <body className={`${baiJamjuree.className} ${notoSansKR.variable}`}>
        <Providers initialFeatures={initialFeatures}>
          <AppTemplate config={configMap} {...props}>
            {children}
          </AppTemplate>
          <ToastContainer />
        </Providers>

        {/* Google Analytics 4 (GA4) */}
        <Script src='https://www.googletagmanager.com/gtag/js?id=G-TTNN5LGXZN' strategy='afterInteractive' />
        <Script
          id='ga4-init'
          strategy='afterInteractive'
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
      function gtag(){ dataLayer.push(arguments); }
      gtag('js', new Date());
      gtag('config', 'G-TTNN5LGXZN');`
          }}
        />
      </body>
    </html>
  )
}
