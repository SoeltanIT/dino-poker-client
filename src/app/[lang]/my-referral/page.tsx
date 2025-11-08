import { getValidServerSession, handleServerAuthError } from '@/@core/lib/server-auth-utils'
import MyReferral from '@/components/organisms/Referral'
import MyReferralDetail from '@/components/organisms/Referral/ReferralDetail'
import MyReferralGroupHistory from '@/components/organisms/Referral/ReferralGroupDetail'
import { getDictionary, getLocale } from '@/dictionaries/dictionaries'
import { getReferral } from '@/utils/api/internal/getReferral'
import { getReferralGroupHistory, getReferralHistory } from '@/utils/api/internal/getReferralHistory' // ← add this
import { getReferralSummary } from '@/utils/api/internal/getReferralSummary'

// export const runtime = 'edge'

type Role = 2 | 3 // 2 = member, 3 = manager (adjust if you have more)

export default async function Page({ params }: { params: { lang: any } }) {
  const dict = await getDictionary(params?.lang)

  const locale = await getLocale()

  let roles: Role = 2

  let initialData: Awaited<ReturnType<typeof getReferral>> | null = null
  let initialHistoryData:
    | Awaited<ReturnType<typeof getReferralHistory>>
    | Awaited<ReturnType<typeof getReferralGroupHistory>>
    | null = null
  let initialSummaryData: Awaited<ReturnType<typeof getReferralSummary>> | null = null

  let isLoading = true
  let isHistoryLoading = true

  try {
    // 1) Session first, to know which endpoint to call for history
    const session = await getValidServerSession()
    if (!session) {
      await handleServerAuthError(locale)
      return null
    }
    roles = Number(session?.user?.roles) === 3 ? 3 : 2

    // 2) Pick the correct history promise based on role
    const historyPromise =
      roles === 2
        ? getReferralHistory({ page: 1, pageSize: 10 }) // member’s personal history
        : getReferralGroupHistory({ page: 1, pageSize: 10 }) // manager/group history

    // 3) Fetch in parallel
    const [data, historyData, summaryData] = await Promise.all([getReferral(), historyPromise, getReferralSummary()])

    initialData = data
    initialHistoryData = historyData
    initialSummaryData = summaryData

    if (initialData) isLoading = false
    if (initialHistoryData) isHistoryLoading = false
  } catch (err: any) {
    // Preserve Next.js navigation errors
    if (err?.digest?.startsWith('NEXT_REDIRECT') || err?.digest?.startsWith('NEXT_NOT_FOUND')) {
      throw err
    }

    isLoading = false
    if (err?.isUnauthorized || err?.response?.status === 401) {
      await handleServerAuthError(locale)
      return null
    }
  }

  if (!initialData) return null

  return (
    <div className='min-h-screen'>
      <MyReferral lang={dict} locale={locale} isLoading={isLoading} initialData={initialData} />

      {roles === 2 ? (
        <MyReferralDetail
          lang={dict}
          locale={locale}
          initialData={initialHistoryData as Awaited<ReturnType<typeof getReferralHistory>>}
          initialSummaryData={initialSummaryData}
          isLoading={isLoading}
        />
      ) : (
        <MyReferralGroupHistory
          lang={dict}
          locale={locale}
          initialData={initialHistoryData as Awaited<ReturnType<typeof getReferralGroupHistory>>}
          initialSummaryData={initialSummaryData}
          isLoading={isHistoryLoading}
          roles={roles}
        />
      )}
    </div>
  )
}
