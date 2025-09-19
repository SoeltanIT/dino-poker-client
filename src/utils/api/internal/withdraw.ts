import { serverApiClient } from '@/@core/lib/axios-client'
import { getApiEndpoint } from '@/utils/api_endpoint'

export const withdrawRequest = async (payload: any) => {
  const response = await serverApiClient.post(getApiEndpoint('withdraw'), payload, undefined, 'transaction')
  return response.data
}
