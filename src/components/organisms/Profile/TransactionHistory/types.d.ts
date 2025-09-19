import { TransactionItem, TransactionResponse } from '@/@core/interface/transactions/Transactions'
import { Locale } from '@/i18n-config'
import { LangProps } from '@/types/langProps'
import { DepositCryptoHistory, DepositWithdrawHistory } from '@/types/transaction'

export interface TransactionHistoryProps {
  lang?: LangProps
  locale?: Locale
  initialData?: DepositWithdrawHistory[]
  initialDataCrypto?: DepositCryptoHistory[]
  initialPage: number
  initialType: string
  initialStatus: string
  isInitialLoading?: boolean
}
