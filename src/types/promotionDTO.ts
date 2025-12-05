export interface PromotionDTO {
  id: string
  name: string
  sub_title: string
  banner: string
  content: string
  status: string
  start_date: string
  end_date: string
  min_bonus: number
  max_bonus: number
  bonus_amount_percentage: number
  bonus_amount: number
  rolling_condition: number
  min_deposit: number
  activation_type: string
  created_at: string
  updated_at: string
}

export interface MyPromotionDTO {
  id?: string
  usage_id?: string
  name: string
  banner: string
  content: string
  start_date: string
  end_date: string
  status: string
  turnover_target: number
  turnover_achieved: number
}
