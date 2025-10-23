import { getValidServerSession, handleServerAuthError } from '@/@core/lib/server-auth-utils'
import BetHistoryPage from '@/components/organisms/Profile/BetHistory'
import { getDictionary, getLocale } from '@/dictionaries/dictionaries'
import { getListBetTransaction } from '@/utils/api/internal/betHistory'
import { getRakeBackSummary } from '@/utils/api/internal/getRakeBackSummary'
import { getListPokerTransaction } from '@/utils/api/internal/pokerHistory'

// export const runtime = 'edge'

export default async function Page({ params, ...props }: any) {
  const dict = await getDictionary(params?.lang)
  const locale = await getLocale()

  let isLoading = true // Set to true if you want to show loading state initially

  let initialData = null
  let initialSummaryData = null

  try {
    // Check if user has valid session first
    const session = await getValidServerSession()
    if (!session) {
      // No valid session, redirect to login
      await handleServerAuthError(locale)
      return null // This won't be reached due to redirect
    }

    const [historyData, summaryData] = await Promise.all([
      getListBetTransaction({
        // getListPokerTransaction({
        page: 1,
        pageSize: 10
      }),
      getRakeBackSummary()
    ])

    initialData = historyData
    initialSummaryData = summaryData

    if (initialData || initialSummaryData) {
      isLoading = false
    }
  } catch (err: any) {
    // ✅ CRITICAL: Re-throw Next.js navigation errors (redirect/notFound)
    if (err?.digest?.startsWith('NEXT_REDIRECT') || err?.digest?.startsWith('NEXT_NOT_FOUND')) {
      throw err
    }

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
      initialSummaryData={initialSummaryData}
      initialPage={1}
      isInitialLoading={isLoading}
      initialTotalPage={initialData?.totalPage || 1}
    />
  )
}
