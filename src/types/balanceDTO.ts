export interface BalanceDTO {
  user_id: string
  balance: number
  bonus_balance: number
  provider_balance: number
}

export interface PokerBalanceDTO extends BalanceDTO {
  chip_balance: number
}
