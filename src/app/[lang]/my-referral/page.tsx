import { getValidServerSession, handleServerAuthError } from '@/@core/lib/server-auth-utils'
import MyReferral from '@/components/organisms/Referral'
import { getDictionary, getLocale } from '@/dictionaries/dictionaries'
import { getReferral } from '@/utils/api/internal/getReferral'

// export const runtime = 'edge'

export default async function Page({ params, ...props }: any) {
  const dict = await getDictionary(params?.lang)
  const locale = await getLocale()

  let initialData = null

  let isLoading = true

  try {
    // Check if user has valid session first
    const session = await getValidServerSession()
    if (!session) {
      // No valid session, redirect to login
      await handleServerAuthError(locale)
      return null // This won't be reached due to redirect
    }

    initialData = await getReferral()
    if (initialData) {
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

  return initialData ? (
    <MyReferral lang={dict} locale={locale} isLoading={isLoading} initialData={initialData} />
  ) : (
    <div></div>
  )
}
