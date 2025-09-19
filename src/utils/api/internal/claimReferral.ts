// utils/api/internal/claimReferral.ts

import { serverApiClient } from '@/@core/lib/axios-client'
import { getApiEndpoint } from '@/utils/api_endpoint'
import { useMutationQuery } from '@/@core/hooks/use-query'
import { LangProps } from '@/types/langProps'

export interface ClaimReferralResponse {
  status: string
}

export interface ClaimReferralRequest {
  // Add any request parameters if needed
  // For now, based on the API doc, it seems to be a simple POST without body
}

export const claimReferral = async (): Promise<ClaimReferralResponse | null> => {
  try {
    const res = await serverApiClient.post<ClaimReferralResponse>(getApiEndpoint('referral_claim'))
    return res?.data || null
  } catch (error) {
    console.error('[claimReferral] Error:', error)
    throw error
  }
}

// Client-side hook for claiming referral
export const useClaimReferral = (lang?: LangProps) => {
  const { mutateAsync, isPending, error } = useMutationQuery<ClaimReferralRequest, ClaimReferralResponse>(
    ['referral_claim'],
    'post',
    'json',
    true, // show message
    lang?.common?.referralClaimedSuccessfully,
    [['referral_summary'], ['referral_history']], // invalidate related queries
    'user'
  )

  return {
    claimReferral: mutateAsync,
    isLoading: isPending,
    error,
    isSuccess: !error
  }
}
