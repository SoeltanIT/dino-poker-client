// @/core/interface/Transaction.ts

export interface TransactionItem {
  id: string
  transaction_id: string
  amount: number
  bank_account_name: string
  bank_account_number: string
  user_id: string
  review_by: string
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
