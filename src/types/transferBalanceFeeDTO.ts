// types/transferBalanceFeeDTO.ts
export interface TransferInFee {
  base_coin: string // often ''
  is_active: boolean
  value: number // percent for transfer in
}

export interface TransferRate {
  currency: string // e.g., 'KRW'
  rate: string // '11' (string from API)
}

export interface TransferFeePayload {
  transfer_in_fee?: TransferInFee
  rate?: TransferRate
}

// old response had array; now:
export interface TransferBalanceFeeResponseMapped {
  success: boolean
  message: string
  data: TransferFeePayload
}
