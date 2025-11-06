import { handleServerAuthError } from '@/@core/lib/server-auth-utils'
import { AnnouncementListing } from '@/components/organisms/Announcement'
import { getDictionary, getLocal } from '@/dictionaries/dictionaries'
import { getListAnnouncement } from '@/utils/api/internal/listAnnouncement'

export default async function Page({ params, ...props }: any) {
  const locale = await getLocal()
  const dict = await getDictionary(params?.lang)

  let initialData = null
  let isLoading = true

  try {
    // Fetch user data
    initialData = await getListAnnouncement()

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

  return <AnnouncementListing lang={dict} locale={locale} initialData={initialData} />
}
