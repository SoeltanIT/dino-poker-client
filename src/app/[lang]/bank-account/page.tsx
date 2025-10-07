import { getValidServerSession, handleServerAuthError } from '@/@core/lib/server-auth-utils'
import BankAccount from '@/components/organisms/Profile/BankAccount'
import { getDictionary, getLocale } from '@/dictionaries/dictionaries'
import { ListBankDTO } from '@/types/listBankDTO'
import { getListBank } from '@/utils/api/internal/listBank'

// export const runtime = 'edge'

export default async function Page({ params, ...props }: any) {
  const dict = await getDictionary(params?.lang)
  const locale = await getLocale()

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
    initialData = await getListBank()
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

  return <BankAccount lang={dict} locale={locale} initialData={initialData} />
}
