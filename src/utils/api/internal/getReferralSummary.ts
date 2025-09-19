// utils/api/internal/getReferralSummary.ts

import { ReferralSummaryResponse } from '@/types/referralDTO'
import { serverApiClient } from '@/@core/lib/axios-client'
import { getApiEndpoint } from '@/utils/api_endpoint'
import { GetData } from '@/@core/hooks/use-query'

export interface ReferralSummaryData {
  data: {
    total_commission: number
    total_referral_usage: number
    available_commission: number
  }
}

export const getReferralSummary = async (): Promise<ReferralSummaryData | null> => {
  try {
    const res = await serverApiClient.get<ReferralSummaryResponse>(getApiEndpoint('referral_summary'))
    // The response structure is: { status: "success", data: { total_commission: number, total_referral_usage: number } }
    return res?.data || null
  } catch (error) {
    console.error('[getReferralSummary] Error:', error)
    return null
  }
}

// Client-side hook for fetching referral summary data
export const useReferralSummary = (initialData?: ReferralSummaryData) => {
  return GetData<ReferralSummaryData>(
    '/referral-summary',
    ['referral_summary'],
    false, // requires auth
    initialData,
    true, // enabled
    false, // don't show message
    undefined, // no success message
    undefined, // no additional options
    'GET',
    undefined, // no body
    'user' // api type
  )
} 