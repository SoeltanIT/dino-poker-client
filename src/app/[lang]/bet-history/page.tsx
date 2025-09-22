import { getValidServerSession, handleServerAuthError } from '@/@core/lib/server-auth-utils'
import BetHistoryPage from '@/components/organisms/Profile/BetHistory'
import { getDictionary, getLocale } from '@/dictionaries/dictionaries'
import { getListPokerTransaction } from '@/utils/api/internal/pokerHistory'

// export const runtime = 'edge'

export default async function Page({ params, ...props }: any) {
  const dict = await getDictionary(params?.lang)
  const locale = await getLocale()

  let isLoading = true // Set to true if you want to show loading state initially

  let initialData = null

  try {
    // Check if user has valid session first
    const session = await getValidServerSession()
    if (!session) {
      // No valid session, redirect to login
      await handleServerAuthError(locale)
      return null // This won't be reached due to redirect
    }

    // Fetch user data
    initialData = await getListPokerTransaction({
      page: 1,
      pageSize: 10 // semua status
    })
    if (initialData?.data) {
      isLoading = false
    }
  } catch (err: any) {
    isLoading = false
    // Handle 401 errors from backend
    if (err.isUnauthorized || err?.response?.status === 401) {
      await handleServerAuthError(locale)
      return null // This won't be reached due to redirect
    }

    err = err.message || 'Failed to load data'
  }

  return (
    <BetHistoryPage
      lang={dict}
      locale={locale}
      initialData={initialData}
      initialPage={1}
      isInitialLoading={isLoading}
      initialTotalPage={initialData?.totalPage || 1}
    />
  )
}
