import { handleServerAuthError } from '@/@core/lib/server-auth-utils'
import { BifrostIframe } from '@/components/organisms/BifrostIframe/BifrostIframe'
import PokerPage from '@/components/organisms/Poker'
import { getDictionary, getLocal } from '@/dictionaries/dictionaries'
import { LangProps } from '@/types/langProps'
import { getGameList } from '@/utils/api/internal/getGameList'

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
    <PokerPage
      lang={dict}
      locale={locale}
      initialData={initialData}
      initialPage={1}
      isInitialLoading={isLoading}
      initialTotalPage={initialData?.totalPage || 1}
    />
  )
}
