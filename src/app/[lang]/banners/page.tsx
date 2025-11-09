import { handleServerAuthError } from '@/@core/lib/server-auth-utils'
import { BannerListing } from '@/components/organisms/Banner'
import { getDictionary, getLocal } from '@/dictionaries/dictionaries'
import { getListBanner } from '@/utils/api/internal/listBanner'

export default async function Page({ params, ...props }: any) {
  const locale = await getLocal()
  const dict = await getDictionary(params?.lang)

  let initialData = null
  let isLoading = true

  try {
    // Fetch user data
    initialData = await getListBanner()

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

  return <BannerListing lang={dict} locale={locale} initialData={initialData} />
}
