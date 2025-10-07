import { getValidServerSession, handleServerAuthError } from '@/@core/lib/server-auth-utils'
import MyReferralGroupSettings from '@/components/organisms/Referral/ReferralGroupSettings'
import { getDictionary, getLocale } from '@/dictionaries/dictionaries'
import { getReferralGroupHistory } from '@/utils/api/internal/getReferralHistory'
import { getReferralSettings } from '@/utils/api/internal/getReferralSettings'
import { getReferralSummary } from '@/utils/api/internal/getReferralSummary'

// export const runtime = 'edge'

export default async function Page({ params, ...props }: any) {
  const dict = await getDictionary(params?.lang)
  const locale = await getLocale()

  let initialData = null
  let initialSummaryData = null

  try {
    // Check if user has valid session first
    const session = await getValidServerSession()
    const roles = Number(session?.user?.roles) || 2
    if (!session && roles !== 3) {
      // No valid session, redirect to login
      await handleServerAuthError(locale)
    }

    initialData = await getReferralSettings()
  } catch (err: any) {
    // ✅ CRITICAL: Re-throw Next.js navigation errors (redirect/notFound)
    // These errors MUST bubble up to be handled by Next.js framework
    if (err?.digest?.startsWith('NEXT_REDIRECT') || err?.digest?.startsWith('NEXT_NOT_FOUND')) {
      throw err
    }

    // Handle 401 errors from backend
    if (err.isUnauthorized || err?.response?.status === 401) {
      await handleServerAuthError(locale)
      return null // This won't be reached due to redirect
    }

    console.error('[Referral Detail Page] Error:', err)
  }

  return <MyReferralGroupSettings lang={dict} locale={locale} initialData={initialData} />
}
