import { serverApiClient } from '@/@core/lib/axios-client'
import { DepositCryptoHistory } from '@/types/transaction'
import { getApiEndpoint } from '@/utils/api_endpoint'

export interface GetListTransactionParams {
  page?: number
  pageSize?: number
  type?: 'deposit' | 'withdraw' | 'all'
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | ''
}

export interface TransactionListResponse {
  status?: string
  page: number
  totalPage: number
  data: DepositCryptoHistory[]
}

export const getTransactionCrypto = async ({ page = 1, pageSize = 10, type = 'all', status = '' }) => {
  const bodyRequest = {
    page: page,
    pageSize: pageSize,
    type: type
    // status: status
  }

  try {
    const res = await serverApiClient.get(
      `${getApiEndpoint('transaction_crypto')}`,
      {
        params: bodyRequest
      },
      'transaction'
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
    console.log('error >', err)
    return {
      status: '',
      page: 1,
      totalPage: 0,
      data: []
    }
  }
}
