// @/core/interface/Transaction.ts

export interface TransactionItem {
  id: number
  transaction_id: number
  amount: number
  bank_account_name: string
  bank_account_number: string
  user_id: number
  review_by: number
  review_status: 'PENDING' | 'APPROVED' | 'REJECTED' | ''
  reviewed_at: string
  created_at: string
  updated_at: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  unique_number_id: number
}

export interface Pagination {
  prev: string
  next: string
  total: number
}

export interface TransactionResponse {
  status: 'success' | 'error'
  data: TransactionItem[]
  pagination: Pagination
}
