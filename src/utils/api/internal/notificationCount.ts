// utils/api/internal/user.ts
import { serverApiClient } from '@/@core/lib/axios-client'
import { ListNotifCountResponse } from '@/@core/interface/Notification'
import { getApiEndpoint } from '@/utils/api_endpoint'

export const getListNotifCount = async () => {
  const res = await serverApiClient.get<ListNotifCountResponse>(
    getApiEndpoint('notification_count'),
    undefined,
    'transaction'
  )

  const respData = res?.data?.data ?? {}

  return respData
}
