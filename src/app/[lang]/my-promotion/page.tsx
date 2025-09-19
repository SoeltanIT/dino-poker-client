import { getValidServerSession, handleServerAuthError } from '@/@core/lib/server-auth-utils'
import MyPromotion from '@/components/organisms/MyPromotion'
import { getDictionary, getLocale } from '@/dictionaries/dictionaries'
import { getListMyPromotion } from '@/utils/api/internal/listMyPromotion'
import { getListMyPromotionHistory } from '@/utils/api/internal/listMyPromotionHistory'
import { getListPromotion } from '@/utils/api/internal/listPromotion'

// export const runtime = 'edge'

export default async function Page({ params, ...props }: any) {
  const dict = await getDictionary(params?.lang)
  const locale = await getLocale()

  let isLoading = true

  try {
    // Check if user has valid session first
    const session = await getValidServerSession()
    if (!session) {
      // No valid session, redirect to login
      await handleServerAuthError(locale)
      return null // This won't be reached due to redirect
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

  return <MyPromotion lang={dict} locale={locale} />
}
