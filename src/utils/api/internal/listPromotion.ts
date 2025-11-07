// utils/api/internal/user.ts
import { serverApiClient } from '@/@core/lib/axios-client'
import { getApiEndpoint } from '@/utils/api_endpoint'

export const getListPromotion = async () => {
  const res = await serverApiClient.get<any>(getApiEndpoint('promotion'), undefined, 'promotion')

  const respData = res?.data?.data ?? []

  return respData
}
