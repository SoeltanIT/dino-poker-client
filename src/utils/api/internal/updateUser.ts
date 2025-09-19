import { serverApiClient } from '@/@core/lib/axios-client'
import { getApiEndpoint } from '@/utils/api_endpoint'

export const updateUser = async (payload: any) => {
  const response = await serverApiClient.put(getApiEndpoint('user_update'), payload, undefined, 'user')
  return response.data
}
