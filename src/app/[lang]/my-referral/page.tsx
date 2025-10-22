import { getValidServerSession, handleServerAuthError } from '@/@core/lib/server-auth-utils'
import MyReferral from '@/components/organisms/Referral'
import MyReferralGroupHistory from '@/components/organisms/Referral/ReferralGroupDetail'
import { getDictionary, getLocale } from '@/dictionaries/dictionaries'
import { getReferral } from '@/utils/api/internal/getReferral'
import { getReferralGroupHistory } from '@/utils/api/internal/getReferralHistory'
import { getReferralSummary } from '@/utils/api/internal/getReferralSummary'

// export const runtime = 'edge'

export default async function Page({ params, ...props }: any) {
  const dict = await getDictionary(params?.lang)
  const locale = await getLocale()

  let roles = 2

  let initialData = null
  let initialHistoryData = null
  let initialSummaryData = null

  let isLoading = true
  let isHistoryLoading = true

  try {
    // Check if user has valid session first
    const session = await getValidServerSession()
    roles = Number(session?.user?.roles) || 2
    if (!session) {
      // No valid session, redirect to login
      await handleServerAuthError(locale)
      return null // This won't be reached due to redirect
    }

    const [data, historyData, summaryData] = await Promise.all([
      getReferral(),
      getReferralGroupHistory({
        page: 1,
        pageSize: 10
      }),
      getReferralSummary()
    ])

    initialData = data
    initialHistoryData = historyData
    initialSummaryData = summaryData

    if (initialData) {
      isLoading = false
    }
    if (initialHistoryData) {
      isHistoryLoading = false
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
  if (initialData) {
    return (
      <>
        <MyReferral lang={dict} locale={locale} isLoading={isLoading} initialData={initialData} />
        <MyReferralGroupHistory
          lang={dict}
          locale={locale}
          initialData={initialHistoryData}
          initialSummaryData={initialSummaryData}
          isLoading={isHistoryLoading}
          roles={roles}
        />
      </>
    )
  }
  return null
}
