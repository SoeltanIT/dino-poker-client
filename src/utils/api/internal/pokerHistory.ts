import { serverApiClient } from '@/@core/lib/axios-client'
import { BetHistoryDTO } from '@/types/betHistoryDTO'
import { PokerHistoryDTO } from '@/types/pokerHistory'
import { getApiEndpoint } from '@/utils/api_endpoint'

export interface GetListTransactionParams {
  page?: number
  pageSize?: number
  type?: string
}

export interface TransactionListResponse {
  status?: string
  page: number
  totalPage: number
  data: PokerHistoryDTO[]
}

const mapBetHistory = (item: any): PokerHistoryDTO => ({
  id: item?.external_transaction_id,
  amount: item.amount,
  created_at: item.created_at,
  status: item?.type,
  game_name: item?.game_name === '' ? '-' : item?.game_name
})

export const getListPokerTransaction = async ({
  page = 1,
  pageSize = 10,
  type = 'WIN, LOSE'
}: GetListTransactionParams): Promise<TransactionListResponse> => {
  const bodyRequest = {
    page: page,
    pageSize: pageSize,
    type: type
  }

  try {
    const res = await serverApiClient.get(
      `${getApiEndpoint('poker_history')}`,
      {
        params: bodyRequest
      },
      'transaction'
    )

    const rawData = res?.data?.data ?? []
    const mappedData = rawData.map((item: any) => mapBetHistory(item))
    const total = res?.data?.pagination?.total ?? 0
    const totalPage = Math.ceil(total / pageSize)
    const status = res?.data?.status

    return {
      status,
      page,
      totalPage,
      data: mappedData
    }
  } catch (err) {
    return {
      page: 1,
      totalPage: 0,
      data: []
    }
  }
}
