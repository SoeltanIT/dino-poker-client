// utils/api/internal/user.ts
import { BalanceResponse } from '@/@core/interface/balance/Balance'
import { serverApiClient } from '@/@core/lib/axios-client'
import { getApiEndpoint } from '@/utils/api_endpoint'

export const getBalanceMe = async () => {
  const res = await serverApiClient.get<BalanceResponse>(getApiEndpoint('balance'))

  return res?.data
}
