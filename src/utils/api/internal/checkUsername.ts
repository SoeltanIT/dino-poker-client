// utils/api/internal/user.ts
import { CheckUsernameResponse } from '@/@core/interface/User'
import { serverApiClient } from '@/@core/lib/axios-client'
import { getApiEndpoint } from '@/utils/api_endpoint'

export const checkUsername = async (payload: { username: string }) => {
  const res = await serverApiClient.post<CheckUsernameResponse>(getApiEndpoint('check_username'), payload)

  return res?.data
}
