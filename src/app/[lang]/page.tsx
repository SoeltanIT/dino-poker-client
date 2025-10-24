import ListGamePage from '@/components/organisms/Games'
import { getDictionary, getLocal } from '@/dictionaries/dictionaries'

import { headers } from 'next/headers'

function absoluteUrl(path: string) {
  const h = headers()
  const proto = h.get('x-forwarded-proto') ?? 'https'
  const host = h.get('x-forwarded-host') ?? h.get('host')!
  return `${proto}://${host}${path}`
}

export default async function Home({ params, ...props }: any) {
  const locale = await getLocal()
  const dict = await getDictionary(params?.lang)
  let initialData = null

  let isLoading = true

  try {
    // Fetch user data
    // initialData = await getGameList({ page: 1, pageSize: 12 })
    const url = absoluteUrl(`/api/transactions/game_list?page=1&pageSize=12&provider_name=Fizzy Bubbly`)
    const res = await fetch(url, { next: { revalidate: 2 * 60 } })
    initialData = await res.json()

    if (initialData) {
      isLoading = false
    }
  } catch (err: any) {
    console.log('err', err)
  }
  return (
    <ListGamePage
      lang={dict}
      locale={locale}
      initialData={initialData?.data}
      initialPage={1}
      isInitialLoading={isLoading}
      initialTotalPage={initialData?.totalPage || 1}
    />
  )
}
