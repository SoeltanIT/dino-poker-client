import { Locale } from '@/i18n-config'
import { BetHistoryDTO, BetPokerHistoryDTO } from '@/types/betHistoryDTO'
import { LangProps } from '@/types/langProps'
import { TransactionListResponse } from '@/utils/api/internal/betHistory'

export interface DetailBetHistoryProps {
  lang?: LangProps
  locale?: Locale
  // detail: BetHistoryDTO | null
  detail: DetailUnionDTO | null
  open: boolean
  setOpen: (value: boolean) => void
  loading?: boolean
}
