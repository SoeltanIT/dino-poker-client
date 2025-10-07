import { getApiEndpoint } from '@/utils/api_endpoint'
import { jwtDecode } from 'jwt-decode'
import type { AuthOptions } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const AUTH_SECRET = process.env.NEXTAUTH_SECRET || ''

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
          return null
        }

        try {
          const res = await fetch(`${API_BASE_URL}${getApiEndpoint('login')}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-platform': 'user'
            },
            body: JSON.stringify(credentials)
          })

          const resp = await res.json()


          if (resp.status !== 'success' || !resp.data?.token || !resp.data?.user_id) {
            return null
          }

          const { token, user_id, roles, email } = resp.data
          
          // Set roles to cookies (client-side only)
          if (typeof window !== 'undefined') {
            document.cookie = `user_roles=${roles}; path=/; max-age=${60 * 60 * 24}; samesite=lax`
          }

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
      // Clear roles cookie on logout (client-side only)
      if (typeof window !== 'undefined') {
        document.cookie = 'user_roles=; path=/; max-age=0; samesite=lax'
      }
    }
  },
  secret: AUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
}
