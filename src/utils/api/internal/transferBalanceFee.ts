// utils/api/internal/user.ts
import { TransferBalanceFeeResponse } from '@/@core/interface/transactions/TransferBalanceFee'
import { serverApiClient } from '@/@core/lib/axios-client'
import { TransferFeeDTO } from '@/types/transferBalanceFeeDTO'
import { getApiEndpoint } from '@/utils/api_endpoint'

export interface TransferFeeMapped {
  deposit?: TransferFeeDTO
  withdraw?: TransferFeeDTO
}

export const getTransferBalanceFee = async () => {
  const res = await serverApiClient.get<TransferBalanceFeeResponse>(getApiEndpoint('transfer_fee'))
  // ✅ remap dynamically

  const raw = res?.data?.data ?? []

  const mapped = raw.reduce((acc, item) => {
    const key = item.type.replace('crypto_', '').replace('_fee', '') // deposit / withdraw
    acc[key as 'deposit' | 'withdraw'] = item
    return acc
  }, {} as TransferFeeMapped)

  return {
    success: true,
    message: '',
    data: mapped
  }
}
