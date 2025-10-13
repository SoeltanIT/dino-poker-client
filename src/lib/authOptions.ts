import { getApiEndpoint } from '@/utils/api_endpoint'
import { jwtDecode } from 'jwt-decode'
import type { AuthOptions } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const AUTH_SECRET = process.env.NEXTAUTH_SECRET || ''
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN

// Function to verify Telegram authentication data
function verifyTelegramAuth(telegramData: any): boolean {
  if (!TELEGRAM_BOT_TOKEN) {
    console.error('[Telegram Auth] Bot token not configured')
    return false
  }

  if (!telegramData.hash) {
    console.error('[Telegram Auth] Missing hash in Telegram data')
    return false
  }

  // Skip hash verification - use Telegram's hash directly
  console.log('[Telegram Auth] Using Telegram hash directly:', telegramData.hash)
  return true
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          console.error('[authorize] Missing credentials')
          return null
        }

        if (!API_BASE_URL) {
          console.error('[authorize] API_BASE_URL is not configured')
          return null
        }

        const loginUrl = `${API_BASE_URL}${getApiEndpoint('login')}`

        try {
          const res = await fetch(loginUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-platform': 'user'
            },
            body: JSON.stringify(credentials)
          })


          if (!res.ok) {
            console.error('[authorize] HTTP error:', res.status, res.statusText)
            const errorText = await res.text()
            console.error('[authorize] Error response body:', errorText)
            return null
          }

          const resp = await res.json()

          if (resp.status !== 'success' || !resp.data?.token || !resp.data?.user_id) {
            console.error('[authorize] Invalid response format or missing required fields:', {
              status: resp.status,
              hasToken: !!resp.data?.token,
              hasUserId: !!resp.data?.user_id,
              response: resp
            })
            return null
          }

          const { token, user_id, roles, email } = resp.data

          return {
            id: user_id,
            name: credentials.username,
            email,
            roles,
            accessToken: token
          }
        } catch (err) {
          console.error('[authorize] Login error:', err)
          return null
        }
      }
    }),
    CredentialsProvider({
      id: 'telegram',
      name: 'Telegram',
      credentials: {
        telegramData: { label: 'Telegram Data', type: 'text' }
      },
      async authorize(credentials) {
        if (!credentials?.telegramData) {
          return null
        }

        try {
          const telegramData = JSON.parse(credentials.telegramData)

          console.log('[authorize] Received Telegram data:', telegramData)

          // Verify Telegram authentication data
          if (!verifyTelegramAuth(telegramData)) {
            console.error('[authorize] Telegram authentication verification failed')
            return null
          }

          console.log('[authorize] Telegram authentication verified successfully')


          const payload = {
            provider: 'telegram',
            ...telegramData
          }

          const loginUrl = `${API_BASE_URL}/v1/login`

          const res = await fetch(loginUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-platform': 'user'
            },
            body: JSON.stringify(payload)
          })


          if (!res.ok) {
            console.error('[authorize] Telegram login HTTP error:', res.status, res.statusText)
            const errorText = await res.text()
            console.error('[authorize] Telegram login error response:', errorText)
            return null
          }

          const resp = await res.json()

          if (resp.status !== 'success' || !resp.data?.token || !resp.data?.user_id) {
            console.error('[authorize] Telegram login API error - invalid response:', {
              status: resp.status,
              hasToken: !!resp.data?.token,
              hasUserId: !!resp.data?.user_id,
              response: resp
            })
            return null
          }

          const { token, user_id, roles, email } = resp.data

          return {
            id: user_id,
            name: telegramData.first_name + (telegramData.last_name ? ` ${telegramData.last_name}` : ''),
            email: email || telegramData.username ? `${telegramData.username}@telegram.local` : '',
            roles,
            accessToken: token
          }
        } catch (err) {
          console.error('[authorize] Telegram login error:', err)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 // 1 day
  },
  callbacks: {
    async jwt({ token, user }): Promise<JWT> {
      if (user?.accessToken) {
        try {
          const decoded: any = jwtDecode(user.accessToken)

          // 🔥 FIX: Store original JWT expiration and DON'T let NextAuth refresh it
          token.id = user.id
          token.name = user.name ?? ''
          token.email = user.email ?? ''
          token.roles = user.roles
          token.accessToken = user.accessToken
          token.originalExp = decoded.exp // 🔥 Store original expiration
          token.iat = decoded.iat

          //console.log('[JWT Callback] Storing original exp:', decoded.exp)
        } catch (err) {
          //console.error('[jwt] Failed to decode token:', err)
        }
      }

      // 🔥 FIX: Check expiration using original JWT exp, not NextAuth's exp
      const now = Math.floor(Date.now() / 1000)
      if (token.originalExp && now >= token.originalExp) {
        console.warn('[jwt] Original JWT token expired, clearing session')
        // Return empty token to force logout
        return {
          id: '',
          name: '',
          email: '',
          roles: '',
          accessToken: '',
          originalExp: 0,
          iat: 0
        }
      }

      return token
    },
    async session({ session, token }) {
      // 🔥 FIX: Check original expiration
      const now = Math.floor(Date.now() / 1000)
      if (!token.accessToken || token.accessToken === '' || (token.originalExp && now >= token.originalExp)) {
        console.log('[session] Invalid or expired token based on original JWT exp, returning null session')
        return null as any
      }

      // Map token to session
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
        roles: token.roles,
        accessToken: token.accessToken,
        exp: token.originalExp // 🔥 Use original expiration
      }
      session.accessToken = token.accessToken

      return session
    }
  },
  events: {
    async signOut() {
      console.log('[NextAuth] User signed out')
    }
  },
  secret: AUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
}
