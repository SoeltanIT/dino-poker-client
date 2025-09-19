// utils/api/internal/user.ts

import { UserMeResponse } from '@/@core/interface/User'
import { serverApiClient } from '@/@core/lib/axios-client'
import { getApiEndpoint } from '@/utils/api_endpoint'

export const getMe = async () => {
  const res = await serverApiClient.get<UserMeResponse>(getApiEndpoint('myself'))
  return res?.data
}
