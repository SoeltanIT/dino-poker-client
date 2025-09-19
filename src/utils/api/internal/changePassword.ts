import { serverApiClient } from '@/@core/lib/axios-client'
import { getApiEndpoint } from '@/utils/api_endpoint'

export const changePassword = async (payload: any) => {
  const response = await serverApiClient.post(getApiEndpoint('change_password'), payload, undefined, 'user')
  return response.data
}
