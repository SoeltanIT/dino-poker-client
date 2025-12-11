export interface BalanceDTO {
  user_id: string
  balance: number
  bonus_balance: number
  provider_balance: number
  is_promotion_used: boolean
  is_promotion_ongoing: boolean
}

export interface PokerBalanceDTO {
  chip_balance: number
  provider_balance: number
  user_id: string
}
