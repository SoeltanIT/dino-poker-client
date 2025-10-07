import { GetData } from '@/@core/hooks/use-query'
import { serverApiClient } from '@/@core/lib/axios-client'
import { AffiliateListResponse } from '@/types/referralDTO'
import { getApiEndpoint } from '@/utils/api_endpoint'

export interface AffiliateListParams {
  page?: number
  pageSize?: number
}

export const getAffiliateList = async (
  userId: string,
  params: AffiliateListParams = {}
): Promise<AffiliateListResponse | null> => {
  const bodyRequest: Record<string, any> = {
    page: params.page,
    pageSize: params.pageSize
  }
  try {
    const res = await serverApiClient.get<AffiliateListResponse>(
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
      data: rawData,
      pagination: res?.data?.pagination
    }
  } catch (err) {
    return {
      status: '',
      data: []
    }
  }
}

// Client-side hook for fetching referral settings data
export const useAffiliateList = (
  userId: string | undefined,
  params: AffiliateListParams = {},
  initialData?: AffiliateListResponse | null
) => {
  return GetData<AffiliateListResponse>(
    '/affiliates/' + userId,
    ['getAffiliateList', params.page, params.pageSize, userId],
    false, // requires auth
    initialData || undefined,
    true, // enabled
    false, // don't show message
    undefined, // no success message
    undefined, // no additional options
    'GET',
    { page: params.page, pageSize: params.pageSize },
    'user' // api type
  )
}
