// utils/api/internal/getReferral.ts

import { ReferralDTO } from '@/types/referralDTO'
import { serverApiClient } from '@/@core/lib/axios-client'
import { getApiEndpoint } from '@/utils/api_endpoint'
import { GetData } from '@/@core/hooks/use-query'

export interface ReferralResponse {
  status: string
  data: {
    referral_link: string
    referral_code: string
  }
}

export const getReferral = async (): Promise<ReferralDTO | null> => {
  try {
    const res = await serverApiClient.get<ReferralResponse>(getApiEndpoint('referral'))
    return res?.data?.data || null
  } catch (error) {
    console.error('[getReferral] Error:', error)
    return null
  }
}

// Client-side hook for fetching referral data
export const useReferral = (initialData?: ReferralDTO) => {
  return GetData<ReferralDTO>(
    '/referral',
    ['referral'],
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
