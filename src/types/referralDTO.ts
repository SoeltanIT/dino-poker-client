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

export interface ReferralSettingsItem {
  user_id: string
  available_share: number
  user_share: number
  affiliate_share: number
  parent_share: number
  is_user: boolean
}

export interface ReferralSettingsResponse {
  status: string
  data: ReferralSettingsItem | null
}

export interface AffiliateListItem {
  id: string
  code_name: string
  username: string
  parent: string
  commission: number
  child: number
  created_at: string
  updated_at: string
}

export interface AffiliateListResponse {
  status: string
  data: AffiliateListItem[]
  pagination?: {
    prev: string
    next: string
    total: number
  }
}

export interface AffiliateUserListItem {
  id: string
  code_name: string
  username: string
  parent: string
  commission: number
  child: number
  created_at: string
  updated_at: string
}

export interface AffiliateUserListResponse {
  status: string
  data: AffiliateUserListItem[]
  pagination?: {
    prev: string
    next: string
    total: number
  }
}

export interface ReferralGroupHistoryItem {
  amount: number
  created_at: string
  commission_percentage: number
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
