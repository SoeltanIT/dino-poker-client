// utils/api/internal/getReferralSettings.ts

import { GetData } from '@/@core/hooks/use-query'
import { serverApiClient } from '@/@core/lib/axios-client'
import { ReferralSettingsResponse } from '@/types/referralDTO'
import { getApiEndpoint } from '@/utils/api_endpoint'

export const getReferralSettings = async (): Promise<ReferralSettingsResponse | null> => {
  const bodyRequest: Record<string, any> = {}
  try {
    const res = await serverApiClient.get<ReferralSettingsResponse>(
      getApiEndpoint('referral_settings'),
      {
        params: bodyRequest
      },
      'user'
    )

    const rawData = res?.data?.data

    const status = res?.data?.status

    return {
      status,
      data: rawData
    }
  } catch (err) {
    return {
      status: '',
      data: null
    }
  }
}

// Client-side hook for fetching referral settings data
export const useReferralSettings = (initialData?: ReferralSettingsResponse) => {
  return GetData<ReferralSettingsResponse>(
    '/referral/shared-settings',
    ['referral_settings'],
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
