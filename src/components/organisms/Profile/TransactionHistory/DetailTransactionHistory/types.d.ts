import { Locale } from '@/i18n-config'
import { BetHistoryDTO } from '@/types/betHistoryDTO'
import { LangProps } from '@/types/langProps'
import { DepositCryptoHistory } from '@/types/transaction'
import { TransactionListResponse } from '@/utils/api/internal/betHistory'

export interface DetailTransactionHistoryProps {
  lang?: LangProps
  locale?: Locale
  detail: DepositCryptoHistory | null
  open: boolean
  setOpen: (value: boolean) => void
}
