import axios from 'axios'
import { Cookies } from 'react-cookie'

export const API = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_BASE_URL })
export const TRANS_API = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_TRANS_URL })

// Interceptor for client-side only
const injectToken = (config: any) => {
  if (typeof window !== 'undefined') {
    const token = new Cookies().get('_authorization')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      // console.log('[Axios] Token injected:', token)
    } else {
      //console.log('[Axios] No token found in cookies.')
    }
  }
  return config
}

API.interceptors.request.use(injectToken, err => Promise.reject(err))
TRANS_API.interceptors.request.use(injectToken, err => Promise.reject(err))
