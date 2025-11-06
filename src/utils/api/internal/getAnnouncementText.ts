// utils/api/internal/user.ts
import { serverApiClient } from '@/@core/lib/axios-client'
import { getApiEndpoint } from '@/utils/api_endpoint'

export const getAnnouncementText = async () => {
  const res = await serverApiClient.get<any>(getApiEndpoint('announcement'), undefined, 'user', true)

  const respData = res?.data?.data ?? []

  return respData
}
