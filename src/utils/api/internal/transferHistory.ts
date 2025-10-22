import { serverApiClient } from '@/@core/lib/axios-client'
import { getApiEndpoint } from '@/utils/api_endpoint'

export interface GetListTransferHistoryParams {
  page?: number
  pageSize?: number
}

export type TransferDirection = 'transfer_in' | 'transfer_out'

export interface TransferHistoryItem {
  createdAt: string
  userId: string
  username: string
  amount: number // deposit/withdraw amount (in currency)
  type: TransferDirection // normalized
  chipAmount: number // calculated by BE
  lastBalance: number // previous user balance (chips/points—per BE)
  balance: number // current user balance
  currency: string // e.g. "IDR"
  rate: number // currency rate (normalized from string)
  point: number // current game points
}

export interface TransferHistoryListResponse {
  success: boolean
  message?: string
  page: number
  totalPage: number
  data: TransferHistoryItem[]
  // Optionals if you want navigation URLs later:
  next?: string
  prev?: string
}

// Raw API contracts
interface RawTransferHistoryItem {
  created_at: string
  user_id: string
  username: string
  amount: number
  type: string // "transfer_in" | "tranfer_out" (typo possible)
  chip_amount: number
  last_balance: number
  balance: number
  currency: string
  rate: string // "1"
  point: number
}

interface RawPagination {
  next?: string
  prev?: string
  page?: number
  total?: number
}

interface RawResponse {
  success: boolean
  message?: string
  data?: RawTransferHistoryItem[]
  pagination?: RawPagination
}

export const getListTransferHistory = async ({
  page = 1,
  pageSize = 10
}: GetListTransferHistoryParams = {}): Promise<TransferHistoryListResponse> => {
  try {
    const res = await serverApiClient.get<RawResponse>(
      `${getApiEndpoint('transfer_history')}`,
      { params: { page, pageSize } },
      'transaction'
    )

    console.log('getListTransferHistory response >>', res.data)

    const raw = res?.data
    const list = raw?.data ?? []
    const pag = raw?.pagination ?? {}
    const total = Number(pag.total ?? 0)
    const totalPage = pageSize > 0 ? Math.ceil(total / pageSize) : 0

    const data: TransferHistoryItem[] = list.map(item => {
      const normalizedType = item.type === 'tranfer_out' ? 'transfer_out' : (item.type as TransferDirection)

      return {
        createdAt: item.created_at ?? '',
        userId: item.user_id ?? '',
        username: item.username ?? '',
        amount: Number(item.amount ?? 0),
        type: normalizedType,
        chipAmount: Number(item.chip_amount ?? 0),
        lastBalance: Number(item.last_balance ?? 0),
        balance: Number(item.balance ?? 0),
        currency: item.currency ?? '',
        rate: Number(item.rate ?? '0'),
        point: Number(item.point ?? 0)
      }
    })

    return {
      success: Boolean(raw?.success),
      message: raw?.message,
      page: Number(pag.page ?? page),
      totalPage,
      data,
      next: pag.next,
      prev: pag.prev
    }
  } catch (err) {
    return {
      success: false,
      message: 'Failed to fetch transfer history.',
      page: 1,
      totalPage: 0,
      data: []
    }
  }
}
