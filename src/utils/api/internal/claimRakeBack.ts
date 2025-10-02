// utils/api/internal/claimRakeBack.ts

import { serverApiClient } from '@/@core/lib/axios-client'
import { getApiEndpoint } from '@/utils/api_endpoint'
import { useMutationQuery } from '@/@core/hooks/use-query'
import { LangProps } from '@/types/langProps'

export interface ClaimRakeBackResponse {
  status: string
}

export interface ClaimRakeBackRequest {
  // Add any request parameters if needed
  // For now, based on the API doc, it seems to be a simple POST without body
}

export const claimRakeBack = async (): Promise<ClaimRakeBackResponse | null> => {
  try {
    const res = await serverApiClient.post<ClaimRakeBackResponse>(getApiEndpoint('rakeBackClaim'))
    return res?.data || null
  } catch (error) {
    console.error('[claimRakeBack] Error:', error)
    throw error
  }
}

// Client-side hook for claiming referral
export const useClaimRakeBack = (lang?: LangProps) => {
  const { mutateAsync, isPending, error } = useMutationQuery<ClaimRakeBackRequest, ClaimRakeBackResponse>(
    ['rakeback_claim'],
    'post',
    'json',
    true, // show message
    lang?.common?.rakeBackClaimedSuccessfully,
    [['getRakeBackBonus']], // invalidate related queries
    'user'
  )

  return {
    claimRakeBack: mutateAsync,
    isLoading: isPending,
    error,
    isSuccess: !error
  }
}
