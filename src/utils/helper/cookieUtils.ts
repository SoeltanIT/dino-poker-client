// Cookie utility functions for client-side cookie management

export const setCookie = (name: string, value: string, days: number = 1) => {
  if (typeof window === 'undefined') return
  
  const maxAge = days * 24 * 60 * 60 // Convert days to seconds
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; samesite=lax`
}

export const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null
  
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null
  }
  return null
}

export const deleteCookie = (name: string) => {
  if (typeof window === 'undefined') return
  
  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`
}

// Specific functions for user roles
export const setUserRoles = (roles: string | number) => {
  setCookie('user_roles', String(roles), 1) // 1 day
}

export const getUserRoles = (): string | null => {
  return getCookie('user_roles')
}

export const clearUserRoles = () => {
  deleteCookie('user_roles')
}
