import { serverApiClient } from '@/@core/lib/axios-client'
import { getApiEndpoint } from '@/utils/api_endpoint'

export const getSEOPage = async (page: string): Promise<any> => {
  try {
    const res = await serverApiClient.get(`${getApiEndpoint('seo')}/${page}`, undefined, 'user')
    return res?.data?.data
  } catch (err) {}
}
