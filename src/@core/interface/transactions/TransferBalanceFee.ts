import { TransferFeeDTO } from '@/types/transferBalanceFeeDTO'

export interface TransferBalanceFeeResponse {
  status: string
  data: TransferFeeDTO[]
}
