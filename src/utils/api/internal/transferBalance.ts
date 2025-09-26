import { serverApiClient } from '@/@core/lib/axios-client'
import { getApiEndpoint } from '@/utils/api_endpoint'

export const transferBalance = async (payload: any) => {
  const response = await serverApiClient.post(getApiEndpoint('transfer_IDN_balance'), payload, undefined, 'transaction')
  return response.data
}
