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

export interface BetPokerHistoryDTO {
  id: string
  userId: string
  provider: string
  gameName: string
  tournamentId?: string
  tournamentName?: string
  betType?: string
  betName?: string
  betTeam?: string
  amount: number
  winAmount: number
  profit: number
  status: string
  createdAt: string
  transactionNo?: string
  table?: string
  periode?: string
  betAmount?: number
  resultAmount?: number
}

export interface DetailBetPokerHistoryDTO {
  id: string
  userId: string
  provider: string
  gameName: string
  matchName: string
  matchId: string
  tournamentName: string
  betType: string
  betName: string
  betTeam: string
  amount: number
  winAmount: number
  profit: number
  status: string
  createdAt: string
}

// dto.ts
export interface DetailBaseDTO {
  id: string
  provider: 'idn_poker' | 'betby'
  status: string
  createdAt: string
  type: 'poker' | 'bet'
}

export interface DetailPokerDTO extends DetailBaseDTO {
  type: 'poker'
  transactionNo: string
  table: string
  periode: string
  betAmount: number // curr_bet
  resultAmount: number // curr_amount
  matchId?: string
  matchName?: string
  gameName?: string
  hand?: string
  card?: string
  room?: string
  tableNo?: string
  currency?: string
}

export interface DetailBetDTO extends DetailBaseDTO {
  type: 'bet'
  tournamentId: string
  tournamentName: string
  betType: string
  betName: string
  betTeam: string
  matchId?: string
  matchName?: string
  gameName?: string
}

export type DetailUnionDTO = DetailPokerDTO | DetailBetDTO

// Narrowing helpers
export const isPoker = (d: DetailUnionDTO): d is DetailPokerDTO => d.provider === 'idn_poker'
export const isBet = (d: DetailUnionDTO): d is DetailBetDTO => d.provider === 'betby'
