import { type Promotion } from '@/components/organisms/Promotion/PromoCarousel'
import { getDictionary, getLocal } from '@/dictionaries/dictionaries'
import { type Locale } from '@/i18n-config'
import { BannerDTO } from '@/types/bannerDTO'
import { getAnnouncementText } from '@/utils/api/internal/getAnnouncementText'
import { getGameList, type GameListResponse } from '@/utils/api/internal/getGameList'
import { getListBanner } from '@/utils/api/internal/listBanner'
import { getListPromotion } from '@/utils/api/internal/listPromotion'
import { mapPromotionList, type PromotionApi } from '@/utils/mappers/promotion'
import dynamic from 'next/dynamic'
import { type Metadata } from 'next'

// ============================================================================
// Dynamic Imports - Reduce Initial JavaScript Bundle
// ============================================================================
const ListGamePage = dynamic(() => import('@/components/organisms/Games'), {
  loading: () => null // Games will show their own skeleton
})

const BannerSection = dynamic(() => import('@/components/organisms/Promotion/BannerSection'), {
  loading: () => (
    <div className='h-[480px] md:h-[325px] w-full animate-pulse bg-gray-800/20 rounded-2xl' />
  )
})

// ============================================================================
// Next.js Segment Config - Enable ISR with 2-minute revalidation
// ============================================================================
export const revalidate = 120 // Revalidate page every 2 minutes

// ============================================================================
// SEO Metadata
// ============================================================================
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Dino Poker - Play Online Poker Games',
    description: 'Play exciting poker games online. Join now and start winning!',
    openGraph: {
      title: 'Dino Poker',
      description: 'Play exciting poker games online',
      type: 'website'
    }
  }
}

// ============================================================================
// Page Props Type
// ============================================================================
interface HomePageProps {
  params: {
    lang: Locale
  }
}

// ============================================================================
// Fallback Data
// ============================================================================
const FALLBACK_BANNERS: BannerDTO[] = [
  {
    id: 'ev-1',
    image: '/images/dummy/dummy_event.png',
    title: 'YEAR END EVENT',
    sub_title: 'follow and get the benefits',
    is_active: true
  },
  {
    id: 'ev-2',
    image: '/images/dummy/dummy_promotion.png',
    title: 'BLACK FRIDAY BONUS',
    sub_title: "limited time — don't miss it",
    is_active: true
  }
]

// ============================================================================
// Main Page Component
// ============================================================================
export default async function Home({ params }: HomePageProps) {
  // Fetch locale and dictionary first (these are fast and needed for all data)
  const [locale, dict] = await Promise.all([getLocal(), getDictionary(params?.lang)])

  // ============================================================================
  // Parallel Data Fetching - This is the key performance optimization
  // All API calls run simultaneously instead of sequentially
  // ============================================================================
  const [gameListResult, promotionsResult, bannersResult, announcementResult] = await Promise.allSettled([
    getGameList({ page: 1, pageSize: 12 }),
    getListPromotion(),
    getListBanner(),
    getAnnouncementText()
  ])

  // ============================================================================
  // Extract Data with Proper Error Handling
  // Each API call is handled independently, so one failure doesn't break the page
  // ============================================================================

  // Games data
  const gameListData: GameListResponse =
    gameListResult.status === 'fulfilled' ? gameListResult.value : { page: 1, totalPage: 1, data: [] }

  // Promotions data
  const promotionsData: PromotionApi[] = promotionsResult.status === 'fulfilled' ? promotionsResult.value || [] : []

  // Banners data
  const bannersData: BannerDTO[] =
    bannersResult.status === 'fulfilled' ? bannersResult.value || FALLBACK_BANNERS : FALLBACK_BANNERS

  // Announcement data
  const announcementData = announcementResult.status === 'fulfilled' ? announcementResult.value : null

  // ============================================================================
  // Log Errors in Development
  // ============================================================================
  if (process.env.NODE_ENV === 'development') {
    if (gameListResult.status === 'rejected') {
      console.error('[Home Page] Game list fetch failed:', gameListResult.reason)
    }
    if (promotionsResult.status === 'rejected') {
      console.error('[Home Page] Promotions fetch failed:', promotionsResult.reason)
    }
    if (bannersResult.status === 'rejected') {
      console.error('[Home Page] Banners fetch failed:', bannersResult.reason)
    }
    if (announcementResult.status === 'rejected') {
      console.error('[Home Page] Announcement fetch failed:', announcementResult.reason)
    }
  }

  // ============================================================================
  // Transform Data for UI Components
  // ============================================================================
  const promos: Promotion[] = mapPromotionList(promotionsData)

  // ============================================================================
  // Render Page
  // ============================================================================
  return (
    <div className='mx-auto w-full max-w-screen-2xl space-y-4 md:px-20 px-6 mt-4'>
      <BannerSection
        lang={dict}
        promos={promos}
        eventItems={bannersData}
        isLoadingPromo={false}
        announcement={announcementData}
        locale={locale}
        guideCard={{
          title: 'USER GUIDE',
          subtitle: 'on how to collect your points',
          imageUrl: '/images/default/user_guide.jpeg',
          href: `/${locale}/user-guide/poker/texas-poker`
        }}
      />

      <ListGamePage
        lang={dict}
        locale={locale}
        initialData={gameListData.data}
        initialPage={1}
        isInitialLoading={false}
        initialTotalPage={gameListData.totalPage}
      />
    </div>
  )
}
