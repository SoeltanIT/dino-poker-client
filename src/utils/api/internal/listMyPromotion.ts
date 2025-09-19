// utils/api/internal/user.ts
import { serverApiClient } from '@/@core/lib/axios-client'
import { getApiEndpoint } from '@/utils/api_endpoint'

export const getListMyPromotion = async () => {
  const res = await serverApiClient.get<any>(getApiEndpoint('my_promotion'), undefined, 'promotion')
  const respData = res?.data?.data ?? []

  return respData
}
