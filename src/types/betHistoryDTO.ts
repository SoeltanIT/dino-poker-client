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

export interface DetailBetHistoryRawResponseDTO {
  id: string
  user_id: string
  amount: number
  win_amount: number
  profit: number
  ticket_id: string
  provider: string
  game_name: string
  match_name: string
  match_id: string
  status: string
  details: {
    amount: number
    betslip: {
      bets: Array<{
        category_id: string
        category_name: string
        competitor_name: string[]
        event_id: string
        id: string
        live: boolean
        market_name: string
        odds: string
        outcome_name: string
        scheduled: number
        sport_id: string
        sport_name: string
        status: string
        tournament_id: string
        tournament_name: string
        updated_event_id: string
        updated_odds: string
      }>
    }
    potential_comboboost_win: number
    potential_win: number
    transaction: {
      amount: number
      betslip_id: string
      bonus_id: string
      cross_rate_euro: string
      currency: string
      ext_player_id: string
      id: string
      operation: string
      operator_brand_id: string
      operator_id: string
      player_id: string
      timestamp: number
    }
  }

  created_at: string
  updated_at: string
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
  profit: number // profit
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
  ticket_id: string
  win_amount: number
  status: string
  created_at: string
  potential_comboboost_win: number
  potential_win: number
  bets_slip: Array<{
    tournament_id: string
    tournament_name: string
    updated_odds: number
    Competitor_name: string
    Odds: number // kalau ada update odds ambil updated odds
    Status: string
    sport_name: string
  }>
}

export type DetailUnionDTO = DetailPokerDTO | DetailBetDTO

// Narrowing helpers
export const isPoker = (d: DetailUnionDTO): d is DetailPokerDTO => d.provider === 'idn_poker'
export const isBet = (d: DetailUnionDTO): d is DetailBetDTO => d.provider === 'betby'
