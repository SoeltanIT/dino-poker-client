// ✅ FIXED SERVER AUTH UTILS - Keep it simple

import { authOptions } from '@/lib/authOptions'
import { getServerSession } from 'next-auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function getValidServerSession() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.accessToken) {
      //console.log('[Server Auth] No session or access token')
      return null
    }

    // 🔥 FIX: Check original JWT expiration (not NextAuth's refreshed exp)
    if (session.user?.exp && Math.floor(Date.now() / 1000) >= session.user.exp) {
      console.log('[Server Auth] Token expired')
      return null
    }

    return session
  } catch (error) {
    //console.error('[Server Auth] Error getting session:', error)
    return null
  }
}

export async function clearServerSession() {
  const cookieStore = cookies()

  // 🔥 FIX: Add your custom cookies too
  const cookiesToClear = [
    'next-auth.session-token',
    '__Secure-next-auth.session-token',
    '_authorization', // 🔥 Your custom cookie
    'next-auth.csrf-token',
    '__Secure-next-auth.csrf-token',
    'next-auth.callback-url',
    '__Secure-next-auth.callback-url'
  ]

  cookiesToClear.forEach(cookieName => {
    try {
      cookieStore.delete(cookieName)
    } catch (error) {
      //console.warn(`[Server Auth] Could not delete cookie ${cookieName}:`, error)
    }
  })
}

// ✅ This works fine! Keep your approach
export async function handleServerAuthError(locale = 'ko') {
  console.log('[Server Auth] Handling auth error - clearing session and redirecting')

  // Clear server-side cookies
  await clearServerSession()

  // ✅ redirect() works in API routes when called from server functions
  redirect(`/${locale}`)
}
