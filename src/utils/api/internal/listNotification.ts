// utils/api/internal/user.ts
import { serverApiClient } from '@/@core/lib/axios-client'
import { ListNotificationResponse } from '@/@core/interface/Notification'
import { getApiEndpoint } from '@/utils/api_endpoint'

export const getListNotification = async () => {
  const res = await serverApiClient.get<ListNotificationResponse>(
    getApiEndpoint('notification'),
    undefined,
    'transaction'
  )

  const respData = res?.data?.data ?? []

  return respData
}
