import { serverApiClient } from '@/@core/lib/axios-client'
import { getApiEndpoint } from '@/utils/api_endpoint'

export const moveBalance = async () => {
  const response = await serverApiClient.post(getApiEndpoint('move_balance'), {}, undefined, 'user')
  return response.data
}
