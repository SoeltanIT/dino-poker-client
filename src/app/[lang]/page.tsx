import ListGamePage from '@/components/organisms/Games'
import BannerSection from '@/components/organisms/Promotion/BannerSection'
import { type Promotion } from '@/components/organisms/Promotion/PromoCarousel'
import { getDictionary, getLocal } from '@/dictionaries/dictionaries'
import { BannerDTO } from '@/types/bannerDTO'
import { getAnnouncementText } from '@/utils/api/internal/getAnnouncementText'
import { getListBanner } from '@/utils/api/internal/listBanner'
import { getListPromotion } from '@/utils/api/internal/listPromotion'
import { mapPromotionList } from '@/utils/mappers/promotion'
import { headers } from 'next/headers'

function absoluteUrl(path: string) {
  const h = headers()
  const proto = h.get('x-forwarded-proto') ?? 'https'
  const host = h.get('x-forwarded-host') ?? h.get('host')!
  return `${proto}://${host}${path}`
}

export default async function Home({ params }: any) {
  const locale = await getLocal()
  const dict = await getDictionary(params?.lang)

  let initialData = null
  let promoRaw: any = null
  let bannerRaw: any = null
  let announcementText: any = null
  let isLoading = true
  let isLoadingPromo = true
  let isLoadingBanner = true
  let isLoadingAnnouncement = true

  try {
    const url = absoluteUrl(`/api/transactions/game_list?page=1&pageSize=12`)
    const res = await fetch(url, { next: { revalidate: 120 } })
    initialData = await res.json()

    promoRaw = await getListPromotion()
    bannerRaw = await getListBanner()
    announcementText = await getAnnouncementText()

    isLoading = !initialData
    isLoadingPromo = !promoRaw
    isLoadingBanner = !bannerRaw
    isLoadingAnnouncement = !announcementText
  } catch (err) {
    console.log('err', err)
  }

  // map API → UI (pakai shape data kamu)
  const promos: Promotion[] = mapPromotionList(promoRaw?.data ?? promoRaw ?? []) as Promotion[]

  const DUMMY_EVENTS: BannerDTO[] = [
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
      sub_title: 'limited time — don’t miss it',
      is_active: true
    }
  ]

  return (
    <div className='mx-auto w-full max-w-screen-2xl space-y-4 md:px-20 px-6 mt-4'>
      <BannerSection
        lang={dict}
        promos={promos}
        eventItems={bannerRaw ?? DUMMY_EVENTS}
        isLoadingPromo={isLoadingPromo}
        announcement={announcementText}
        locale={locale}
        guideCard={{
          title: 'USER GUIDE',
          subtitle: 'on how to collect your points',
          imageUrl: '/images/default/user_guide.png',
          href: `/${locale}/user-guide/poker/texas-poker`
        }}
      />

      <ListGamePage
        lang={dict}
        locale={locale}
        initialData={initialData?.data}
        initialPage={1}
        isInitialLoading={isLoading}
        initialTotalPage={initialData?.totalPage || 1}
      />
    </div>
  )
}
