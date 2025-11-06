import { serverApiClient } from '@/@core/lib/axios-client'
import { getApiEndpoint } from '@/utils/api_endpoint'

export const getDetailBanner = async (id: string): Promise<any> => {
  try {
    const res = await serverApiClient.get(`${getApiEndpoint('banner')}/${id}`, undefined, 'user', true)
    return res?.data?.data ?? []
  } catch (err) {}
}
