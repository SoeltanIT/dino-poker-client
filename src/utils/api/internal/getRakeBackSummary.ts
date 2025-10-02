// utils/api/internal/getRakeBackSummary.ts

import { RakeBackSummaryResponse } from '@/types/rakeBackDTO'
import { serverApiClient } from '@/@core/lib/axios-client'
import { getApiEndpoint } from '@/utils/api_endpoint'
import { GetData } from '@/@core/hooks/use-query'

export interface RakeBackSummaryData {
  status: string
  data: {
    total_unclaimed: number
  }
}

export const getRakeBackSummary = async (): Promise<RakeBackSummaryData | null> => {
  try {
    const res = await serverApiClient.get<RakeBackSummaryResponse>(getApiEndpoint('rakeBackBonus'))
    // The response structure is: { status: "success", data: { total_commission: number, total_referral_usage: number } }
    return res?.data || null
  } catch (error) {
    console.error('[getRakeBackSummary] Error:', error)
    return null
  }
}

// Client-side hook for fetching referral summary data
export const useRakeBackSummary = (initialData?: RakeBackSummaryData) => {
  return GetData<RakeBackSummaryData>(
    '/rakeBackBonus',
    ['getRakeBackBonus'],
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
