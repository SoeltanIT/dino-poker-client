export interface ReferralDTO {
  referral_link: string
  referral_code: string
}

export interface ReferralHistoryItem {
  id: string
  referral_usage: string
  amount: number
  created_at: string
  updated_at: string
}

export interface ReferralHistoryResponse {
  status: string
  data: ReferralHistoryItem[]
  pagination: {
    prev: string
    next: string
    total: number
  }
}

export interface ReferralGroupHistoryItem {
  amount: number
  created_at: string
  comission_percent: number
  parent: string
}

export interface ReferralGroupHistoryResponse {
  status: string
  data: ReferralGroupHistoryItem[]
  pagination: {
    prev: string
    next: string
    total: number
  }
}

export interface ReferralHistoryParams {
  page?: number
  pageSize?: number
  // dateFrom?: string
  // dateTo?: string
}

export interface ReferralSummaryResponse {
  status: string
  data: {
    total_commission: number
    total_referral_usage: number
    available_commission: number
  }
}
