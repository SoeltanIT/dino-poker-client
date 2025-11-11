import type { UserDTO } from './userDTO'

declare module 'next-auth' {
  interface Session {
    user: UserDTO
    accessToken: string
  }

  interface User extends UserDTO {
    accessToken: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    name: string
    nickname: string
    roles: string
    accessToken: string
    originalExp?: number // 🔥 Store original JWT expiration
    exp?: number // ✅ tambahkan ini
    iat?: number // optional: issued at, juga sering ada
    is_adjustment?: boolean
    adjusted_at?: string | null
  }
}
