export interface AffiliateParentDTO {
  id: string
  username: string
}

// Others History

export interface AffiliateHistoryOthersDTO {
  id: string
  user_id: string
  username: string
  parent: AffiliateParentDTO
  affiliated_members: number
  period: string
  previous_ngr: number
  total_bet: number
  total_win: number
  total_ggr: number
  total_bonus: number
  total_promotion: number
  total_ngr: number
  reason: string
  commission_earned: number
  adjusted_commission: number
  last_commission_paid_at: string
  paid_date: string
  paid_status: string
}

export interface AffiliateHistoryDetailOthersDTO {
  id: string
  user_id: string
  username: string
  parent: AffiliateParentDTO
  affiliated_members: number
  period: string
  previous_ngr: number
  total_bet: number
  total_win: number
  total_ggr: number
  total_bonus: number
  total_promotion: number
  total_ngr: number
  commission_earned: number
  adjusted_commission: number
  last_commission_paid_at: string
  paid_date: string
  paid_status: string
  active_users: number
}

export interface AffiliateSummaryOthersDTO {
  accumulative_ngr: number
  adjusted_commission: number
  bet_amount: number
  code_name: string
  commission_earned: number
  commission_rate: number
  ggr: number
  ngr: number
  parent_commission: number
  parent_commission_rate: number
  period: string
  promotion_amount: number
  rake_amount: number
  user_id: string
  active_users: number
  username: string
  win_amount: number
}

// Poker History

export interface AffiliateHistoryPokerDTO {
  id: string
  user_id: string
  username: string
  parent: AffiliateParentDTO
  affiliated_members: number
  period: string
  rake_amount: number
  commission_earned: number
  adjusted_commission: number
  reason: string
  last_commission_paid_at: string
  paid_date: string
  paid_status: string
  total_active_users: number
}

export interface AffiliateHistoryDetailPokerDTO {
  user_id: string
  username: string
  parent: AffiliateParentDTO
  affiliated_members: number
  period: string
  rake_amount: number
  commission_earned: number
  total_active_users: number
}

export interface AffiliateSummaryPokerDTO {
  id: string
  user_id: string
  username: string
  period: string
  rake_amount: number
  parent_commission: number
  parent_commission_rate: number
}
