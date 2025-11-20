import { authOptions } from '@/lib/authOptions'
import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { getServerSession } from 'next-auth'
import { getSession } from 'next-auth/react'

// 🔥 FRONTEND URLs - Next.js API routes (proxy to real backend)
const FRONTEND_API_BASE = '/api/users' // Next.js API routes
const FRONTEND_API_PROXY_BASE = '/proxy/users' // Next.js API routes
const FRONTEND_TRANS_BASE = '/api/transactions' // Next.js transaction routes
const FRONTEND_PROMOTION_BASE = '/api' // Next.js promotion routes

// 🔒 BACKEND URLs - Real backend (server-side only)
const BACKEND_USER_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const BACKEND_TRANS_URL = process.env.NEXT_PUBLIC_API_TRANS_URL
const BACKEND_PROMOTION_URL = process.env.NEXT_PUBLIC_API_PROMOTION_URL

type ApiType = 'user' | 'transaction' | 'promotion' | 'user_proxy'

// Extend AxiosRequestConfig to include metadata
declare module 'axios' {
  interface AxiosRequestConfig {
    metadata?: {
      skipAuth?: boolean
    }
  }
}

// 🌐 FRONTEND CLIENT - Hits Next.js API routes
const frontendUserClient = axios.create({
  baseURL: FRONTEND_API_BASE,
  timeout: 10000
})

const frontendUserProxyClient = axios.create({
  baseURL: FRONTEND_API_PROXY_BASE,
  timeout: 10000
})

const frontendTransClient = axios.create({
  baseURL: FRONTEND_TRANS_BASE,
  timeout: 10000
})

const frontendPromotionClient = axios.create({
  baseURL: FRONTEND_PROMOTION_BASE,
  timeout: 10000
})

// 🔒 BACKEND CLIENT - Hits real backend (server-side only)
const backendUserClient = axios.create({
  baseURL: BACKEND_USER_URL,
  timeout: 10000
})

const backendTransClient = axios.create({
  baseURL: BACKEND_TRANS_URL,
  timeout: 10000
})

const backendPromotionClient = axios.create({
  baseURL: BACKEND_PROMOTION_URL,
  timeout: 10000
})

// Frontend interceptors (for Next.js API routes)
function setupFrontendInterceptors(instance: AxiosInstance) {
  // Request interceptor - inject token (skip if skipAuth is true)
  instance.interceptors.request.use(
    async config => {
      // Check if this request should skip auth
      const skipAuth = config.metadata?.skipAuth === true

      if (typeof window !== 'undefined' && !skipAuth) {
        const session = await getSession()
        if (session?.accessToken) {
          config.headers.Authorization = `Bearer ${session.accessToken}`
        }
      }

      return config
    },
    error => Promise.reject(error)
  )

  // Response interceptor
  instance.interceptors.response.use(
    response => response,
    async error => {
      if (error?.response?.status === 401 && typeof window !== 'undefined') {
        //console.warn('[Frontend Axios] 401 detected')

        // Import signOut dynamically
        const { signOut } = await import('next-auth/react')

        // Get locale from API response or current URL
        const locale = error?.response?.data?.locale || window.location.pathname.split('/')[1] || 'en'

        //console.log('[Frontend Axios] Triggering signOut with locale:', locale)
        await signOut({
          callbackUrl: `/${locale}`,
          redirect: true
        })
      }

      return Promise.reject(error)
    }
  )
}

// Backend interceptors (for real backend - server-side only)
function setupBackendInterceptors(instance: AxiosInstance) {
  // Request interceptor - inject token from server session (skip if skipAuth is true)
  instance.interceptors.request.use(
    async config => {
      // Check if this request should skip auth
      const skipAuth = config.metadata?.skipAuth === true

      if (typeof window === 'undefined' && !skipAuth) {
        try {
          const session = await getServerSession(authOptions)
          if (session?.accessToken) {
            config.headers.Authorization = `Bearer ${session.accessToken}`
          }
        } catch (error) {
          //console.error('[Backend Interceptor] Failed to get session:', error)
        }
      }

      return config
    },
    error => Promise.reject(error)
  )

  // Response interceptor - handle 401 on server
  instance.interceptors.response.use(
    response => response,
    async error => {
      if (error?.response?.status === 401 && typeof window === 'undefined') {
        //console.warn('[Backend Axios] 401 detected on server')
        error.isUnauthorized = true
        error.shouldClearSession = true
      }
      return Promise.reject(error)
    }
  )
}

// Setup interceptors
setupFrontendInterceptors(frontendUserClient)
setupFrontendInterceptors(frontendUserProxyClient)
setupFrontendInterceptors(frontendTransClient)
setupFrontendInterceptors(frontendPromotionClient)
setupBackendInterceptors(backendUserClient)
setupBackendInterceptors(backendTransClient)
setupBackendInterceptors(backendPromotionClient)

// 🌐 FRONTEND: Get client for frontend calls (Next.js API routes)
export function getApiClient(type: ApiType = 'user'): AxiosInstance {
  return type === 'transaction'
    ? frontendTransClient
    : type === 'promotion'
    ? frontendPromotionClient
    : type === 'user_proxy'
    ? frontendUserProxyClient
    : frontendUserClient
}

// 🔒 BACKEND: Get client for backend calls (real backend - server-side only)
export function getBackendClient(type: ApiType = 'user'): AxiosInstance {
  return type === 'transaction' ? backendTransClient : type === 'promotion' ? backendPromotionClient : backendUserClient
}

// Legacy compatibility - for your existing serverApiClient usage in API routes
export const serverApiClient = {
  get: <T = any>(url: string, config?: AxiosRequestConfig, type: ApiType = 'user', skipAuth = false) => {
    const finalConfig = { ...config, metadata: { ...config?.metadata, skipAuth } }
    return getBackendClient(type).get<T>(url, finalConfig)
  },

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig, type: ApiType = 'user', skipAuth = false) => {
    const finalConfig = { ...config, metadata: { ...config?.metadata, skipAuth } }
    return getBackendClient(type).post<T>(url, data, finalConfig)
  },

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig, type: ApiType = 'user', skipAuth = false) => {
    const finalConfig = { ...config, metadata: { ...config?.metadata, skipAuth } }
    return getBackendClient(type).put<T>(url, data, finalConfig)
  },

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig, type: ApiType = 'user', skipAuth = false) => {
    const finalConfig = { ...config, metadata: { ...config?.metadata, skipAuth } }
    return getBackendClient(type).patch<T>(url, data, finalConfig)
  },

  delete: <T = any>(url: string, config?: AxiosRequestConfig, type: ApiType = 'user', skipAuth = false) => {
    const finalConfig = { ...config, metadata: { ...config?.metadata, skipAuth } }
    return getBackendClient(type).delete<T>(url, finalConfig)
  }
}
