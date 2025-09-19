'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { handleError } from '@/@core/utils/handleError'
import type { AxiosError } from 'axios'
import axios from 'axios'
import { getSession } from 'next-auth/react'
import { toast } from 'react-toastify'
import { getApiEndpoint } from '@/utils/api_endpoint'

interface UseImageUploadParams {
  key: Array<string | number>
  isShowMsg?: boolean
  successMessage?: string
  additionalInvalidates?: Array<Array<string | number>>
}

interface MutationParams {
  formData: FormData
}

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 30000
})

export function useImageUpload({
  key,
  isShowMsg = false,
  successMessage,
  additionalInvalidates = []
}: UseImageUploadParams) {
  const queryClient = useQueryClient()

  const mutationFn = async ({ formData }: MutationParams): Promise<any> => {
    const session = await getSession()

    if (!session?.accessToken) {
      console.warn('[useImageUpload] No access token found in session')
      throw new Error('Unauthorized')
    }

    try {
      const response = await client.post(getApiEndpoint('uploadImage'), formData, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`
        }
      })
      return response.data
    } catch (error: any) {
      console.error('[useImageUpload] Upload failed:', error)
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

      queryClient.invalidateQueries({ queryKey: key })
      additionalInvalidates.forEach(invalidateKey => {
        queryClient.invalidateQueries({ queryKey: invalidateKey })
      })
    },
    onError: async (error: AxiosError<any>) => {
      console.error('[useImageUpload] Mutation error:', error)
      await handleError(error)
    }
  })
}
