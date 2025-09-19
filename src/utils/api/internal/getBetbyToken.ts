// utils/api/internal/getReferralHistory.ts

import { serverApiClient } from '@/@core/lib/axios-client'
import { getApiEndpoint } from '@/utils/api_endpoint'

export interface BetByTokenResponse {
  status: string
  data: any
}

export interface BetbyTokenParams {
  type?: string
  lang?: string
}

export const getBetbyToken = async (body: BetbyTokenParams): Promise<BetByTokenResponse | null> => {
  try {
    const res = await serverApiClient.post<any>(getApiEndpoint('betby_token'), body, undefined, 'user')

    const status = res?.data?.status

    return {
      status,
      data: res?.data?.data
    }
  } catch (err) {
    return {
      status: '',
      data: ''
    }
  }
}

// Client-side hook for fetching referral history data
// export const useReferralHistory = (params: ReferralHistoryParams = {}, initialData?: ReferralHistoryListResponse) => {
//   const { page = 1, pageSize = 10, dateFrom, dateTo } = params

//   const queryKey = ['referral_history', page, pageSize, dateFrom, dateTo]

//   return GetData<ReferralHistoryListResponse>(
//     `/referral-history?page=${page}&pageSize=${pageSize}${dateFrom ? `&dateFrom=${dateFrom}` : ''}${dateTo ? `&dateTo=${dateTo}` : ''}`,
//     queryKey,
//     false, // requires auth
//     initialData,
//     true, // enabled
//     false, // don't show message
//     undefined, // no success message
//     undefined, // no additional options
//     'GET',
//     undefined, // no body
//     'user' // api type
//   )
// }
