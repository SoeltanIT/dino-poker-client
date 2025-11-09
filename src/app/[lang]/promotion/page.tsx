import { handleServerAuthError } from '@/@core/lib/server-auth-utils'
import PromotionPage from '@/components/organisms/Promotion'
import { getDictionary, getLocale } from '@/dictionaries/dictionaries'
import { getListPromotion } from '@/utils/api/internal/listPromotion'

// export const runtime = 'edge'

export default async function Page({ params, ...props }: any) {
  const dict = await getDictionary(params?.lang)
  const locale = await getLocale()

  let initialData = null

  let isLoading = true

  try {
    // Fetch user data
    initialData = await getListPromotion()

    if (initialData) {
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

  return <PromotionPage initialData={initialData} lang={dict} locale={locale} />
}
