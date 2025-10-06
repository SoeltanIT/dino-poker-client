// 🔥 SERVER COMPONENT WRAPPER - Use this instead of repeating code

import { getValidServerSession, handleServerAuthError } from './server-auth-utils'

// 🎯 WRAPPER FUNCTION - Use this in server components that need auth
export async function withServerAuth<T>(locale: string, handler: () => Promise<T>): Promise<T | null> {
  try {
    // Check session first
    const session = await getValidServerSession()
    if (!session) {
      await handleServerAuthError(locale)
      return null
    }

    // Execute the handler
    return await handler()
  } catch (err: any) {
    // ✅ CRITICAL: Re-throw Next.js navigation errors (redirect/notFound)
    // These errors MUST bubble up to be handled by Next.js framework
    if (err?.digest?.startsWith('NEXT_REDIRECT') || err?.digest?.startsWith('NEXT_NOT_FOUND')) {
      throw err
    }

    //console.error('[Server Component] Error:', err)

    // Handle 401 errors from backend
    if (err.isUnauthorized || err?.response?.status === 401) {
      await handleServerAuthError(locale)
      return null
    }

    // Re-throw other errors for component to handle
    throw err
  }
}
