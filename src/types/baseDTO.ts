export interface PaginatedResponseDTO<T> {
  success: boolean
  message: string
  data: T[]
  pagination: Pagination
}

interface Pagination {
  next: string
  page: number
  prev: string
  total: number
}
