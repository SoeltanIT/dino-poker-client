// utils/api/internal/user.ts
import { PokerBalanceResponse } from '@/@core/interface/balance/Balance'
import { serverApiClient } from '@/@core/lib/axios-client'
import { getApiEndpoint } from '@/utils/api_endpoint'

export const getPokerBalanceMe = async () => {
  const res = await serverApiClient.get<PokerBalanceResponse>(getApiEndpoint('poker_balance'))
  return res?.data
}
