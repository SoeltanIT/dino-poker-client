import { serverApiClient } from '@/@core/lib/axios-client'
import { getApiEndpoint } from '@/utils/api_endpoint'

export const withdrawCryptoRequest = async (payload: any) => {
  const response = await serverApiClient.post(getApiEndpoint('withdraw_crypto'), payload, undefined, 'transaction')
  return response.data
}
