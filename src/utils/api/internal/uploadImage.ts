import { serverApiClient } from '@/@core/lib/axios-client'
import { getApiEndpoint } from '@/utils/api_endpoint'

export const uploadImage = async (formData: FormData) => {
  const response = await serverApiClient.post(getApiEndpoint('uploadImage'), formData, undefined, 'user')
  return response.data
}
