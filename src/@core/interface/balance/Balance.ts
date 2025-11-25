import { BalanceDTO, PokerBalanceDTO } from '@/types/balanceDTO'

export interface BalanceResponse {
  status: string
  data: BalanceDTO
}

export interface PokerBalanceResponse {
  status: string
  data: PokerBalanceDTO
}
