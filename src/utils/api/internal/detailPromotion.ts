import { serverApiClient } from '@/@core/lib/axios-client'
import { getApiEndpoint } from '@/utils/api_endpoint'

export const getDetailPromotion = async (id: string): Promise<any> => {
  try {
    const res = await serverApiClient.get(`${getApiEndpoint('promotion')}/${id}`, undefined, 'promotion')
    return res?.data?.data ?? []
  } catch (err) {}
}
