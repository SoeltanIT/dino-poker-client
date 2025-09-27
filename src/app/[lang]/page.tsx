import ListGamePage from '@/components/organisms/Games'
import { getDictionary, getLocal } from '@/dictionaries/dictionaries'
import { getGameList } from '@/utils/api/internal/getGameList'

export const revalidate = 60

export default async function Home({ params, ...props }: any) {
  const locale = await getLocal()
  const dict = await getDictionary(params?.lang)

  let initialData = null

  let isLoading = true

  try {
    // Fetch user data
    initialData = await getGameList({ page: 1, pageSize: 12 })

    if (initialData) {
      isLoading = false
    }
  } catch (err: any) {
    console.log('err')
  }

  return (
    <ListGamePage
      lang={dict}
      locale={locale}
      initialData={initialData}
      initialPage={1}
      isInitialLoading={isLoading}
      initialTotalPage={initialData?.totalPage || 1}
    />
  )
}
