import { GetData } from '@/@core/hooks/use-query'
import { serverApiClient } from '@/@core/lib/axios-client'
import { AffiliateListResponse, ReferralSettingsResponse } from '@/types/referralDTO'
import { getApiEndpoint } from '@/utils/api_endpoint'

export interface AffiliateListParams {
  page?: number
  pageSize?: number
}

export const getAffiliateList = async (
  userId: string,
  params: AffiliateListParams = {}
): Promise<ReferralSettingsResponse | null> => {
  const bodyRequest: Record<string, any> = {
    page: params.page,
    pageSize: params.pageSize
  }
  try {
    const res = await serverApiClient.get<ReferralSettingsResponse>(
      getApiEndpoint('affiliates') + '/' + userId,
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
export const useAffiliateList = (
  userId: string,
  params: AffiliateListParams = {},
  initialData?: AffiliateListResponse
) => {
  return GetData<AffiliateListResponse>(
    '/affiliates',
    ['affiliates'],
    false, // requires auth
    initialData,
    true, // enabled
    false, // don't show message
    undefined, // no success message
    undefined, // no additional options
    'GET',
    { page: params.page, pageSize: params.pageSize }, // no body
    'user' // api type
  )
}
