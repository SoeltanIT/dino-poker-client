export interface GroupAffiliateParentDTO {
  id: string
  code_name: string
  username: string
}

// Casino

export interface GroupAffiliateHistoryCasinoDTO {
  id: string
  user_id: string
  code_name: string
  username: string
  parent: GroupAffiliateParentDTO
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

export interface GroupAffiliateHistoryDetailCasinoDTO {
  id: string
  user_id: string
  code_name: string
  username: string
  parent: GroupAffiliateParentDTO
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
}

export interface GroupAffiliateSummaryCasinoDTO {
  id: string
  user_id: string
  code_name: string
  username: string
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
}

// Sport

export interface GroupAffiliateHistorySportDTO {
  id: string
  user_id: string
  code_name: string
  username: string
  parent: GroupAffiliateParentDTO
  affiliated_members: number
  period: string
  rake_amount: number
  commission_earned: number
  reason: string
  adjusted_commission: number
  last_commission_paid_at: string
  paid_date: string
  paid_status: string
}

export interface GroupAffiliateHistoryDetailSportDTO {
  user_id: string
  code_name: string
  username: string
  parent: GroupAffiliateParentDTO
  affiliated_members: number
  period: string
  rake_amount: number
  commission_earned: number
  adjusted_commission: number
  last_commission_paid_at: string
  paid_date: string
  paid_status: string
}

export interface GroupAffiliateSummarySportDTO {
  user_id: string
  code_name: string
  username: string
  commission_rate: number
  period: string
  rake_amount: number
  commission_earned: number
  adjusted_commission: number
}
