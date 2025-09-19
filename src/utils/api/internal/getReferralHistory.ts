// utils/api/internal/getReferralHistory.ts

import { serverApiClient } from '@/@core/lib/axios-client'
import { ReferralHistoryItem, ReferralHistoryParams, ReferralHistoryResponse } from '@/types/referralDTO'
import { getApiEndpoint } from '@/utils/api_endpoint'

export interface ReferralHistoryListResponse {
  status: string
  page: number
  totalPage: number
  data: ReferralHistoryItem[]
}

export const getReferralHistory = async (
  params: ReferralHistoryParams = {}
): Promise<ReferralHistoryListResponse | null> => {
  const { page = 1, pageSize = 10 } = params

  const bodyRequest: Record<string, any> = {
    page,
    pageSize
  }
  try {
    const res = await serverApiClient.get<ReferralHistoryResponse>(
      getApiEndpoint('referral_history'),
      {
        params: bodyRequest
      },
      'user'
    )

    const rawData = res?.data?.data ?? []
    const total = res?.data?.pagination?.total ?? 0
    const totalPage = Math.ceil(total / pageSize)
    const status = res?.data?.status

    return {
      status,
      page,
      totalPage,
      data: rawData
    }
  } catch (err) {
    return {
      status: '',
      page: 1,
      totalPage: 0,
      data: []
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
