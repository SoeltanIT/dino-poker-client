import { Locale } from '@/i18n-config'
import { BetHistoryDTO } from '@/types/betHistoryDTO'
import { LangProps } from '@/types/langProps'
import { RakeBackSummaryResponse } from '@/types/rakeBackDTO'
import { TransactionListResponse } from '@/utils/api/internal/pokerHistory'
// import { TransactionListResponse } from '@/utils/api/internal/betHistory'

export interface BetHistoryProps {
  lang?: LangProps
  locale?: Locale
  initialData?: TransactionListResponse | null
  initialSummaryData?: RakeBackSummaryResponse | null
  initialPage: number
  isInitialLoading?: boolean
  initialTotalPage?: number
}

export interface PokerHistoryProps {
  lang?: LangProps
  locale?: Locale
  initialSummaryData?: RakeBackSummaryResponse | null
  initialData?: TransactionListResponse | null
  initialPage: number
  isInitialLoading?: boolean
  initialTotalPage?: number
}
