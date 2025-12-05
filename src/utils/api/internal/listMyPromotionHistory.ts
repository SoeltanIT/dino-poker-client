// utils/api/internal/user.ts
import { serverApiClient } from '@/@core/lib/axios-client'
import { getApiEndpoint } from '@/utils/api_endpoint'

export const getListMyPromotionHistory = async () => {
  const res = await serverApiClient.get<any>(getApiEndpoint('my_promotion_history'), undefined, 'promotion')

  const respData = res?.data?.data ?? []

  return respData
}

export const cancelPromotion = async (id: string) => {
  const res = await serverApiClient.patch(`/v1/promotion-usage/${id}/cancel`, undefined, undefined, 'promotion')
  return res?.data?.data
}
