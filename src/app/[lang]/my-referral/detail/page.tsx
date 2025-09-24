import { getValidServerSession, handleServerAuthError } from '@/@core/lib/server-auth-utils'
import MyReferralDetail from '@/components/organisms/Referral/ReferralDetail'
import { getDictionary, getLocale } from '@/dictionaries/dictionaries'
import { getReferralHistory } from '@/utils/api/internal/getReferralHistory'
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
    if (!session) {
      // No valid session, redirect to login
      await handleServerAuthError(locale)
      return null // This won't be reached due to redirect
    }

    const roles = (session.user as any)?.roles || 2

    // Fetch referral history and summary data in parallel
    const [historyData, summaryData] = await Promise.all([
      getReferralHistory({
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
    isLoading = false
    // Handle 401 errors from backend
    if (err.isUnauthorized || err?.response?.status === 401) {
      await handleServerAuthError(locale)
      return null // This won't be reached due to redirect
    }

    console.error('[Referral Detail Page] Error:', err)
  }

  return (
    <MyReferralDetail
      lang={dict}
      locale={locale}
      initialData={initialData}
      initialSummaryData={initialSummaryData}
      isLoading={isLoading}
    />
  )
}
