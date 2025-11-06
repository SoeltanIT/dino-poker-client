import Announcement from '@/components/organisms/Banner/Announcement'
import ListGamePage from '@/components/organisms/Games'
import PromoCarousel, { type Promotion } from '@/components/organisms/Promotion/PromoCarousel'
import PromoHeaderSection from '@/components/organisms/Promotion/PromoHeaderSection'
import { getDictionary, getLocal } from '@/dictionaries/dictionaries'
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
  let isLoading = true
  let isLoadingPromo = true

  try {
    const url = absoluteUrl(`/api/transactions/game_list?page=1&pageSize=12`)
    const res = await fetch(url, { next: { revalidate: 120 } })
    initialData = await res.json()

    promoRaw = await getListPromotion()

    isLoading = !initialData
    isLoadingPromo = !promoRaw
  } catch (err) {
    console.log('err', err)
  }

  // map API → UI (pakai shape data kamu)
  const promos: Promotion[] = mapPromotionList(promoRaw?.data ?? promoRaw ?? []) as Promotion[]

  return (
    <div className='mx-auto w-full max-w-screen-2xl space-y-4 md:px-20 px-6 mt-4'>
      <PromoHeaderSection lang={dict} promos={promos} isLoadingPromo={isLoadingPromo} />

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
