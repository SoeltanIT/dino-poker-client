import { serverApiClient } from '@/@core/lib/axios-client'
import { getApiEndpoint } from '@/utils/api_endpoint'

export const registerUser = async (payload: any) => {
  const response = await serverApiClient.post(getApiEndpoint('register'), payload, undefined, 'user', true) // skipAuth = true
  return response.data
}
