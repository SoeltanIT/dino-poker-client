import { Locale } from '@/i18n-config'
import { LangProps } from '@/types/langProps'
import { TransferHistoryItem } from '@/utils/api/internal/transferHistory'

export interface TransactionHistoryProps {
  lang?: LangProps
  locale?: Locale
  initialData?: TransferHistoryItem[]
  initialPage: number
  isInitialLoading?: boolean
}
