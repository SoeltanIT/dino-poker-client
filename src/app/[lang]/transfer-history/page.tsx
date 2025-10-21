import { getValidServerSession, handleServerAuthError } from '@/@core/lib/server-auth-utils'
import TransferHistoryPage from '@/components/organisms/Profile/TransferHistory'
import { getDictionary, getLocale } from '@/dictionaries/dictionaries'
import { getListTransferHistory } from '@/utils/api/internal/transferHistory'

// export const runtime = 'edge'

export default async function Page({ params, ...props }: any) {
  const dict = await getDictionary(params?.lang)
  const locale = await getLocale()

  let isLoading = true // Set to true if you want to show loading state initially

  let initialData = null

  try {
    // Check if user has valid session first
    const session = await getValidServerSession()
    if (!session) {
      // No valid session, redirect to login
      await handleServerAuthError(locale)
      return null // This won't be reached due to redirect
    }

    // Fetch user data
    initialData = await getListTransferHistory({
      page: 1,
      pageSize: 10
    })

    if (initialData?.data) {
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

  return <TransferHistoryPage lang={dict} locale={locale} initialPage={1} isInitialLoading={isLoading} />
}
