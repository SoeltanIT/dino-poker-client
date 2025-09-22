'use client'

import { keepPreviousData, useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query'
import { useSession } from 'next-auth/react' // 👈 This is where status comes from
import { toast } from 'react-toastify'
import type { AxiosRequestConfig, AxiosError } from 'axios'
import { handleError } from '../utils/handleError'
import { getApiClient } from '../lib/axios-client'

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
  apiType: 'user' | 'transaction' | 'promotion' = 'user'
) {
  // 🔍 THIS IS WHERE status COMES FROM
  const { data: session, status } = useSession()
  // useSession() returns: { data: session | null, status: "loading" | "authenticated" | "unauthenticated" }

  // console.log('[GetData] Session status:', status) // 👈 Add this to see the values
  // console.log('[GetData] Session data:', session) // 👈 Add this to see the session

  const isAuthenticated = status === 'authenticated' && !!session

  // If skipAuth is true, don't require authentication. If false, require it.
  const isEnabled = enabled && (skipAuth || isAuthenticated)

  const fetchData = async (): Promise<FetchingT> => {
    try {
      const client = getApiClient(apiType)
      let response

      // Pass skipAuth info to interceptor via metadata
      const config: AxiosRequestConfig = {
        metadata: { skipAuth }
      }

      if (method === 'GET') {
        response = await client.get(url, config)
      } else {
        response = await client.post(url, body, config)
      }

      if (isShowMsg && successMessage) {
        toast.success(successMessage)
      }

      return response.data
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
  apiType: 'user' | 'transaction' = 'user',
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
    onError: async (error: AxiosError<any>) => {
      //console.log('[MutationQuery] ⚠️ Mutation failed. Error handled in mutationFn')
      // const errorMessage = error?.response?.data?.message || error?.message || 'Something went wrong'
      // toast.error(errorMessage)
    }
  })
}

export { GetData, useMutationQuery }
