// types/transaction.ts

export interface DepositWithdrawHistory {
  id: string
  amount: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  created_at: string
  type: 'deposit' | 'withdraw' | 'all' // <-- kita tambahkan manual berdasarkan endpoint
  bank_account_name?: string
  bank_account_number?: string
  updated_at?: string
  transaction_id?: string
  user_id?: string
  reviewed_at?: string
  review_status?: 'PENDING' | 'APPROVED' | 'REJECTED' | ''
  review_by?: string
  unique_number_id?: number
}

export interface DepositCryptoHistory {
  deposit_id: string
  status: 'PENDING' | 'EXPIRED' | 'APPROVED' | ''
  fiat_amount: string
  crypto_amount: number
  created_at: string
  expires_at: string
  wallet_address: string
  blockchains: string
  token: string
  id?: string
  external_deposit_id?: string
  type: string
}
