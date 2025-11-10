export interface UserDTO {
  id: string
  name: string
  nickname: string
  roles: string
  accessToken: string
  originalExp?: number
  exp?: number
  is_adjustment?: boolean
  adjusted_at?: string | null
}

export interface UserFullDTO {
  balance: string
  bank_account_number: string
  bank_name: string
  currency: string
  nickname: string
  id_card: string
  id_number: string
  language: string
  name: string
  phone_number: string
  selfie: string
  status: string
  total_lose: number
  total_win: number
  user_id: string
  username: string
}
