import { Row, RowData } from '@tanstack/react-table'

// Base column interface
export interface DataTableColumnBase {
  key: string
  header: string | React.ReactNode
  width?: string
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  className?: string
}

// Column with accessor as key
export interface DataTableColumnWithAccessor<T extends RowData, K extends keyof T> extends DataTableColumnBase {
  accessor?: K | 'no'
  render?: (value: T[K], row: Row<T>) => React.ReactNode
}

// Column with accessor as function
export interface DataTableColumnWithFunction<T extends RowData> extends DataTableColumnBase {
  accessor?: (row: Row<T>) => React.ReactNode
  render?: never
}

// Union type for all column types
export type DataTableColumn<T extends RowData> =
  | { [K in keyof T]: DataTableColumnWithAccessor<T, K> }[keyof T]
  | DataTableColumnWithFunction<T>

export interface DataTableData {
  [key: string]: unknown
}

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showPageNumbers?: boolean
  maxVisiblePages?: number
  className?: string

  totalItems?: number
  pageSize?: number
}

export interface BaseDataTableProps<T extends RowData> {
  //   title?: string
  columns: DataTableColumn<T>[]
  data: T[]
  pagination?: PaginationProps
  loading?: boolean
  emptyState?: {
    message?: string
    image?: string
  }
  className?: string
  rowClassName?: string | ((row: T, index: number) => string)
  onRowClick?: (row: T, index: number) => void

  //   footer?: {
  //     values: Record<string, React.ReactNode>
  //     renderers?: Record<string, (value: React.ReactNode) => React.ReactNode>
  //     className?: string
  //   }
}

export interface DataTableProps<T extends RowData> extends BaseDataTableProps<T> {
  renderMobileRows?: (row: T, index: number) => React.ReactNode
  mobileHeader?: React.ReactNode
  classNames?: Record<string, string>
  //   footer?: {
  //     values: Record<string, React.ReactNode>
  //     renderers?: Record<string, (value: React.ReactNode) => React.ReactNode>
  //     className?: string
  //   }
}
