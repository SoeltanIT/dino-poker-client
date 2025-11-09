// utils/api/internal/user.ts
import { serverApiClient } from '@/@core/lib/axios-client'
import { getApiEndpoint } from '@/utils/api_endpoint'

export const getListBanner = async () => {
  const res = await serverApiClient.get<any>(getApiEndpoint('banner'), undefined, 'user', true)

  const respData = res?.data?.data ?? []

  return respData
}
