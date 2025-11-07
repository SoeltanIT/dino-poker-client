import { serverApiClient } from '@/@core/lib/axios-client'
import { getApiEndpoint } from '@/utils/api_endpoint'

export const getDetailAnnouncement = async (id: string): Promise<any> => {
  try {
    const res = await serverApiClient.get(`${getApiEndpoint('announcement')}/${id}`, undefined, 'user', true)
    return res?.data?.data ?? []
  } catch (err) {}
}
