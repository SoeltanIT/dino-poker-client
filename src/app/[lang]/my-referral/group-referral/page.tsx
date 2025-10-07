import { getValidServerSession, handleServerAuthError } from '@/@core/lib/server-auth-utils'
import MyReferralGroupHistoryProps from '@/components/organisms/Referral/ReferralGroupDetail'
import { getDictionary, getLocale } from '@/dictionaries/dictionaries'
import { getReferralGroupHistory } from '@/utils/api/internal/getReferralHistory'
import { getReferralSummary } from '@/utils/api/internal/getReferralSummary'

// export const runtime = 'edge'

export default async function Page({ params, ...props }: any) {
  const dict = await getDictionary(params?.lang)
  const locale = await getLocale()

  let initialData = null
  let initialSummaryData = null
  let isLoading = true

  try {
    // Check if user has valid session first
    const session = await getValidServerSession()
    const roles = Number(session?.user?.roles) || 2
    if (!session && roles !== 3) {
      // No valid session, redirect to login
      await handleServerAuthError(locale)
      return null // This won't be reached due to redirect
    }

    // Fetch referral history and summary data in parallel
    const [historyData, summaryData] = await Promise.all([
      getReferralGroupHistory({
        page: 1,
        pageSize: 10
      }),
      getReferralSummary()
    ])

    initialData = historyData
    initialSummaryData = summaryData

    if (initialData || initialSummaryData) {
      isLoading = false
    }
  } catch (err: any) {
    // ✅ CRITICAL: Re-throw Next.js navigation errors (redirect/notFound)
    // These errors MUST bubble up to be handled by Next.js framework
    if (err?.digest?.startsWith('NEXT_REDIRECT') || err?.digest?.startsWith('NEXT_NOT_FOUND')) {
      throw err
    }

    isLoading = false
    // Handle 401 errors from backend
    if (err.isUnauthorized || err?.response?.status === 401) {
      await handleServerAuthError(locale)
      return null // This won't be reached due to redirect
    }

    console.error('[Referral Detail Page] Error:', err)
  }

  return (
    <MyReferralGroupHistoryProps
      lang={dict}
      locale={locale}
      initialData={initialData}
      initialSummaryData={initialSummaryData}
      isLoading={isLoading}
    />
  )
}
