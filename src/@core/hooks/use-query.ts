'use client'

import { keepPreviousData, useMutation, useQuery, useQueryClient, type UseQueryOptions } from '@tanstack/react-query'
import type { AxiosError, AxiosRequestConfig } from 'axios'
import { useSession } from 'next-auth/react' // 👈 This is where status comes from
import { toast } from 'react-toastify'
import { getApiClient } from '../lib/axios-client'
import { handleError } from '../utils/handleError'

type CacheOptions = {
  sMaxage?: number // seconds for CDN
  swr?: number // seconds for stale-while-revalidate
  cacheKey?: string // optional debug
}

// Enhanced GetData - REMOVED requiresAuth, only use skipAuth
function GetData<FetchingT>(
  url: string,
  key: Array<string | number | undefined | unknown>,
  skipAuth = false, // 🔥 Single parameter - if true, skip auth. If false, require auth
  initialData?: FetchingT,
  enabled = true,
  isShowMsg = true,
  successMessage?: string,
  otherQueryOptions?: Omit<UseQueryOptions<FetchingT, unknown, FetchingT, typeof key>, 'queryKey' | 'queryFn'>,
  method: 'GET' | 'POST' = 'GET',
  body?: Record<string, any>,
  apiType: 'user' | 'transaction' | 'promotion' = 'user',
  cache?: CacheOptions // 👈 NEW
) {
  // 🔍 THIS IS WHERE status COMES FROM
  const { data: session, status } = useSession()

  const isAuthenticated = status === 'authenticated' && !!session

  // If skipAuth is true, don't require authentication. If false, require it.
  const isEnabled = enabled && (skipAuth || isAuthenticated)

  const fetchData = async (): Promise<FetchingT> => {
    try {
      const client = getApiClient(apiType)
      const headers: Record<string, string> = {}
      if (cache?.sMaxage != null) headers['x-s-maxage'] = String(cache.sMaxage)
      if (cache?.swr != null) headers['x-swr'] = String(cache.swr)
      if (cache?.cacheKey) headers['x-cache-key'] = cache.cacheKey

      const config: AxiosRequestConfig = {
        metadata: { skipAuth },
        headers,
        params: method === 'GET' ? body : undefined // 👈 body becomes query params for GET
      }

      const res = method === 'GET' ? await client.get(url, config) : await client.post(url, body, config)

      if (isShowMsg && successMessage) toast.success(successMessage)
      return res.data
    } catch (error: any) {
      //console.error('[GetData] ❌ Request failed:', error)
      await handleError(error)
      throw error
    }
  }

  return useQuery({
    queryKey: key,
    queryFn: fetchData,
    initialData,
    placeholderData: keepPreviousData,
    enabled: isEnabled,
    ...otherQueryOptions
  })
}

// Enhanced Mutation - REMOVED requiresAuth, only use skipAuth
function useMutationQuery<BodyT, ResponseData>(
  key: Array<string | number>,
  method: 'post' | 'put' | 'delete' | 'patch',
  headers: 'json' | 'formdata' = 'json',
  isShowMsg = false,
  successMessage?: string,
  additionalInvalidates: Array<Array<string | number>> = [],
  apiType: 'user' | 'transaction' | 'promotion' = 'user',
  skipAuth = false // 🔥 Single parameter - if true, skip auth. If false, require auth
) {
  const queryClient = useQueryClient()

  interface MutationParams {
    url: string
    body?: BodyT
  }

  const mutationFn = async ({ url, body }: MutationParams): Promise<ResponseData> => {
    try {
      const client = getApiClient(apiType)
      let response

      // Handle different content types and pass skipAuth to interceptor
      const config: AxiosRequestConfig = {
        headers: headers === 'formdata' ? {} : { 'Content-Type': 'application/json' },
        metadata: { skipAuth }
      }

      switch (method) {
        case 'post':
          response = await client.post(url, body, config)
          break
        case 'put':
          response = await client.put(url, body, config)
          break
        case 'patch':
          response = await client.patch(url, body, config)
          break
        case 'delete':
          response = await client.delete(url, config)
          break
        default:
          throw new Error(`Unsupported method: ${method}`)
      }

      return response.data
    } catch (error: any) {
      //console.error('[MutationQuery] ❌ Request failed:', error)
      await handleError(error)
      throw error
    }
  }

  return useMutation({
    mutationFn,
    onSuccess: (data: any) => {
      if (isShowMsg) {
        const message = successMessage || data?.message || 'Success'
        toast.success(message)
      }

      additionalInvalidates.forEach(invalidateKey => {
        queryClient.invalidateQueries({ queryKey: invalidateKey })
      })
      return queryClient.invalidateQueries({ queryKey: key })
    },
    onError: async (error: AxiosError<any>) => {}
  })
}

export { GetData, useMutationQuery }
