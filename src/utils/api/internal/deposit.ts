import { serverApiClient } from '@/@core/lib/axios-client'
import { getApiEndpoint } from '@/utils/api_endpoint'

export const depositRequest = async (payload: any) => {
  const response = await serverApiClient.post(getApiEndpoint('deposit'), payload, undefined, 'transaction')
  return response.data
}
