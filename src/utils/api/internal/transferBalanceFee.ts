// utils/api/internal/transferBalanceFee.ts
import { serverApiClient } from '@/@core/lib/axios-client'
import { TransferBalanceFeeResponseMapped } from '@/types/transferBalanceFeeDTO'
import { getApiEndpoint } from '@/utils/api_endpoint'

export const getTransferBalanceFee = async () => {
  // Tell TS the shape you expect from backend
  const res = await serverApiClient.get<TransferBalanceFeeResponseMapped>(
    getApiEndpoint('transfer_fee_rate'),
    {},
    'transaction',
    false
  )

  // Just return what backend gives (already in the new shape)
  return res.data
}
