import { serverApiClient } from '@/@core/lib/axios-client'
import { BetHistoryDTO } from '@/types/betHistoryDTO'
import { getApiEndpoint } from '@/utils/api_endpoint'

export interface GetListTransactionParams {
  page?: number
  pageSize?: number
  status?: 'won, lost, pending'
}

export interface TransactionListResponse {
  status?: string
  page: number
  totalPage: number
  data: BetHistoryDTO[]
}

const mapBetHistory = (item: any): BetHistoryDTO => ({
  id: item.ticket_id,
  amount: item.amount,
  created_at: item.created_at,
  status: item?.status,
  game_name: item?.game_name === '' ? '-' : item?.game_name,
  tournament_name: item?.tournament_name,
  match_id: item?.match_id.split(':').pop() ?? '-',
  teams: item?.match_name,
  bet_type: item?.bet_type,
  selection: `${item?.bet_name} - ${item?.bet_team}`
})

export const getListBetTransaction = async ({
  page = 1,
  pageSize = 10,
  status = 'won, lost, pending'
}: GetListTransactionParams): Promise<TransactionListResponse> => {
  const bodyRequest = {
    page: page,
    pageSize: pageSize,
    status: status
  }

  try {
    const res = await serverApiClient.get(
      `${getApiEndpoint('bet_history')}`,
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
