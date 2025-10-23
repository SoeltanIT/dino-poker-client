// types/transaction.ts

export interface BetHistoryDTO {
  id: string
  amount: number
  created_at: string
  status: string
  game_name: string
  tournament_name: string
  match_id: string
  teams: string
  bet_type: string
  selection: string
}
