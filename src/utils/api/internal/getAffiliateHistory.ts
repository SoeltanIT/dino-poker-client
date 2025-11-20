// utils/api/internal/getAffiliateHistory.ts

import { serverApiClient } from '@/@core/lib/axios-client'
import { AffiliateHistoryPokerDTO } from '@/types/affiliateDTO'
import { PaginatedResponseDTO } from '@/types/baseDTO'
import { ReferralHistoryParams } from '@/types/referralDTO'
import { getApiEndpoint } from '@/utils/api_endpoint'

export type AffiliateHistoryPokerListResponse = PaginatedResponseDTO<AffiliateHistoryPokerDTO> & {
  totalPage: number
}

export const getAffiliateHistoryPoker = async (
  params: ReferralHistoryParams = {}
): Promise<AffiliateHistoryPokerListResponse | null> => {
  const { page = 1, pageSize = 10 } = params

  const bodyRequest: Record<string, any> = {
    page,
    pageSize
  }
  try {
    const res = await serverApiClient.get<AffiliateHistoryPokerListResponse>(
      getApiEndpoint('affiliate_history_poker'),
      {
        params: bodyRequest
      },
      'user'
    )

    const rawData = res?.data?.data ?? []
    const total = res?.data?.pagination?.total ?? 0
    const totalPage = Math.ceil(total / pageSize)

    return {
      ...res?.data,
      totalPage
    }
  } catch (err) {
    return {
      data: [],
      success: false,
      message: '',
      pagination: {
        next: '',
        page: 1,
        prev: '',
        total: 0
      },
      totalPage: 0
    }
  }
}
