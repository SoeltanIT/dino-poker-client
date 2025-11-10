export type UserStatus = 'APPROVED' | 'REJECTED' | 'PENDING' | 'UNVERIFIED'

export interface UserMeResponse {
  status: string
  data: {
    user_id: string
    username: string
    nickname: string
    currency: string
    language: string
    balance: string
    phone_number: string
    bank_account_number: string
    bank_name: string
    status: UserStatus
  }
}
