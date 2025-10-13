import { getValidServerSession, handleServerAuthError } from '@/@core/lib/server-auth-utils'
import TransactionHistoryPage from '@/components/organisms/Profile/TransactionHistory'
import { getDictionary, getLocale } from '@/dictionaries/dictionaries'
import { getTransactionCrypto } from '@/utils/api/internal/getTransactionCrypto'
import { getListTransaction } from '@/utils/api/internal/transactionHistory'

// export const runtime = 'edge'

export default async function Page({ params, ...props }: any) {
  const dict = await getDictionary(params?.lang)
  const locale = await getLocale()

  let isLoading = true // Set to true if you want to show loading state initially

  let initialData = null
  let initialDataCrypto = null

  try {
    // Check if user has valid session first
    const session = await getValidServerSession()
    if (!session) {
      // No valid session, redirect to login
      await handleServerAuthError(locale)
      return null // This won't be reached due to redirect
    }

    // Fetch user data
    initialData = await getListTransaction({
      page: 1,
      pageSize: 10,
      type: 'all', // default awal
      status: '' // semua status
    })

    initialDataCrypto = await getTransactionCrypto({
      page: 1,
      pageSize: 10
    })

    if (initialData?.data || initialDataCrypto?.data) {
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

  return (
    <TransactionHistoryPage
      lang={dict}
      locale={locale}
      initialData={initialData?.data}
      initialDataCrypto={initialDataCrypto?.data}
      initialPage={1}
      initialType='all'
      initialStatus='all'
      isInitialLoading={isLoading}
    />
  )
}
