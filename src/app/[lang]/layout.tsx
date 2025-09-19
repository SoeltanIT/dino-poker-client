import { handleServerAuthError } from '@/@core/lib/server-auth-utils'
import { Providers } from '@/components/providers/Providers'
import AppTemplate from '@/components/templates/App'
import { getDictionary } from '@/dictionaries/dictionaries'
import { Locale } from '@/i18n-config'
import { ConfigType } from '@/types/config'
import { getSEOPage } from '@/utils/api/internal/getSEOPage'
import { getWebConfig } from '@/utils/api/internal/webConfig'
import type { Metadata, Viewport } from 'next'
import { ToastContainer } from 'react-toastify'
import { baiJamjuree } from '../font'
import '../globals.css'
import Script from 'next/script'

// Viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1
}

const commonKeywords = [
  'gowin',
  'gowin.gg',
  'esports betting',
  'valorant betting',
  'league of legends betting',
  'dota 2 betting',
  'csgo betting',
  'live betting',
  'korean esports',
  'online esports betting',
  '토토',
  '고윈',
  '고윈코리아',
  'valorant',
  'league of legends',
  'LoL',
  'dota 2',
  'csgo'
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
    en: [...commonKeywords, 'betting platform', 'play and win', 'e-sports odds', 'live match odds'],
    ko: [...commonKeywords, 'e스포츠 배팅', '발로란트 배팅', '롤 배팅', '도타2 배팅', '실시간 배당률', '한국 e스포츠']
  }

  return {
    title: initialSEO?.title ?? lang.metadata?.title ?? 'GOWIN.GG',
    description: initialSEO?.description ?? lang.metadata?.description,
    keywords: initialSEO?.keyword ?? localizedKeywords[params.lang],
    // openGraph: {
    //   title: initialSEO?.title ?? lang.metadata?.title,
    //   description: initialSEO?.description ?? lang.metadata?.description,
    //   url: `${initialSEO?.canonical ?? 'https://gowin.gg'}/${params.lang}`,
    //   siteName: 'Gowin.gg',
    //   locale: params.lang,
    //   type: 'website'
    // },
    // twitter: {
    //   card: 'summary_large_image',
    //   title: initialSEO?.title ?? lang.metadata?.title,
    //   description: initialSEO?.description ?? lang.metadata?.description
    // },
    alternates: {
      canonical: `${initialSEO?.canonical}`,
      languages: {
        en: `${initialSEO?.canonical}/en`,
        ko: `${initialSEO?.canonical}/ko`
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
              name: 'GOWIN.GG',
              url: 'https://gowin.gg/',
              alternateName: ['GOWIN', '고윈', 'Go Win'],
              inLanguage: ['en', 'ko'],
              publisher: {
                '@type': 'Organization',
                name: 'GOWIN',
                url: 'https://gowin.gg/',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://gowin.gg/images/logo.png',
                  width: 512,
                  height: 512
                }
              }
            })
          }}
        />

        {/* Google Tag Manager */}
        {/* <GoogleTagManager gtmId={'G-20SZ06083B'} /> */}

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
      <body className={`${baiJamjuree.className}`}>
        <Providers>
          <AppTemplate config={configMap} {...props}>
            {children}
          </AppTemplate>
          <ToastContainer />
        </Providers>

        {/* Google Analytics 4 (GA4) */}
        <Script src='https://www.googletagmanager.com/gtag/js?id=G-20SZ06083B' strategy='afterInteractive' />
        <Script
          id='ga4-init'
          strategy='afterInteractive'
          dangerouslySetInnerHTML={{
            __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){ dataLayer.push(arguments); }
      gtag('js', new Date());
      gtag('config', 'G-20SZ06083B');
    `
          }}
        />
      </body>
    </html>
  )
}
