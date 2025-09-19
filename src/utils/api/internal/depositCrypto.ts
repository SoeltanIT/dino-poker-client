import { serverApiClient } from '@/@core/lib/axios-client'
import { getApiEndpoint } from '@/utils/api_endpoint'

export const depositCryptoRequest = async (payload: any) => {
  const response = await serverApiClient.post(getApiEndpoint('depositCrypto'), payload, undefined, 'transaction')
  return response.data
}
