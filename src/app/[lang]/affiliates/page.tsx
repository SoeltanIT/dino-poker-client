import { getValidServerSession, handleServerAuthError } from '@/@core/lib/server-auth-utils'
import MyAffiliate from '@/components/organisms/Affiliate'
import { getDictionary, getLocale } from '@/dictionaries/dictionaries'
import { getAffiliateList } from '@/utils/api/internal/getAffiliateList'
import { getReferral } from '@/utils/api/internal/getReferral'

// export const runtime = 'edge'

export default async function Page({ params, ...props }: any) {
  const dict = await getDictionary(params?.lang)
  const locale = await getLocale()

  let initialAff = null
  let myReferralData = null

  try {
    // Check if user has valid session first
    const session = await getValidServerSession()
    const roles = Number(session?.user?.roles) || 2
    if (!session && roles !== 3) {
      // No valid session, redirect to login
      await handleServerAuthError(locale)
      return null // This won't be reached due to redirect
    }

    initialAff = await getAffiliateList(session?.user?.id || '', {
      page: 1,
      pageSize: 10
    })
    myReferralData = await getReferral()
  } catch (err: any) {
    // ✅ CRITICAL: Re-throw Next.js navigation errors (redirect/notFound)
    if (err?.digest?.startsWith('NEXT_REDIRECT') || err?.digest?.startsWith('NEXT_NOT_FOUND')) {
      throw err
    }

    // Handle 401 errors from backend
    if (err.isUnauthorized || err?.response?.status === 401) {
      await handleServerAuthError(locale)
      return null // This won't be reached due to redirect
    }

    err = err.message || 'Failed to load data'
  }
  if (initialAff && myReferralData) {
    return <MyAffiliate lang={dict} locale={locale} initialAffiliateData={initialAff} myReferralData={myReferralData} />
  }
  return null
}
