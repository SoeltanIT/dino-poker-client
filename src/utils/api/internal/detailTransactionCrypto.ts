import { serverApiClient } from '@/@core/lib/axios-client'
import { getApiEndpoint } from '@/utils/api_endpoint'

export const getDetailTransactionCrypto = async (id: string): Promise<any> => {
  try {
    const res = await serverApiClient.get(`${getApiEndpoint('transaction_crypto')}/${id}`, undefined, 'transaction')
    return res?.data?.data ?? []
  } catch (err) {}
}
