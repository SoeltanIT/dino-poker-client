import { handleServerAuthError } from '@/@core/lib/server-auth-utils'
import DetailBanner from '@/components/organisms/Banner/DetailBanner'
import { getDictionary, getLocal } from '@/dictionaries/dictionaries'
import { getDetailBanner } from '@/utils/api/internal/detailBanner'

export default async function Page({ params, ...props }: any) {
  const locale = await getLocal()
  const dict = await getDictionary(params?.lang)

  let initialData = null

  let isLoading = true

  try {
    // Fetch user data
    initialData = await getDetailBanner(params?.id)

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

  return <DetailBanner initialData={initialData} lang={dict} locale={locale} />
}
