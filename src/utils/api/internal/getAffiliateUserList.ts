import { GetData } from '@/@core/hooks/use-query'
import { serverApiClient } from '@/@core/lib/axios-client'
import { AffiliateListResponse, AffiliateUserListResponse } from '@/types/referralDTO'
import { getApiEndpoint } from '@/utils/api_endpoint'

export interface AffiliateUserListParams {
  page?: number
  pageSize?: number
}

export const getAffiliateUserList = async (
  userId: string,
  params: AffiliateUserListParams = {}
): Promise<AffiliateUserListResponse | null> => {
  const bodyRequest: Record<string, any> = {
    page: params.page,
    pageSize: params.pageSize
  }
  try {
    const res = await serverApiClient.get<AffiliateUserListResponse>(
      getApiEndpoint('affiliates_user') + '/' + userId,
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
export const useAffiliateUserList = (
  userId: string | undefined,
  params: AffiliateUserListParams = {},
  initialData?: AffiliateUserListResponse | null
) => {
  return GetData<AffiliateUserListResponse>(
    '/affiliates/' + userId + '/user',
    ['affiliates_user', params.page, params.pageSize, userId],
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
