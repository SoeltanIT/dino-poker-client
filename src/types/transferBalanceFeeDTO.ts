export interface TransferFeeDTO {
  id: string
  type: string // crypto_withdraw_fee / crypto_deposit_fee
  base_coin: string
  is_active: boolean
  value: number //fixed amount
}
