// utils/api/internal/user.ts

import { serverApiClient } from '@/@core/lib/axios-client'
import { ConfigItem } from '@/types/config'
import { getApiEndpoint } from '@/utils/api_endpoint'

export const getWebConfig = async () => {
  const res = await serverApiClient.get<{
    data: ConfigItem[]
  }>(getApiEndpoint('config'), undefined, 'user', true)
  return res?.data?.data
}
