import { Locale } from '@/i18n-config'
import { LangProps } from '@/types/langProps'
import { DepositCryptoHistory, DepositWithdrawHistory } from '@/types/transaction'

export interface TransactionHistoryProps {
  cryptoFeature?: boolean
  lang?: LangProps
  locale?: Locale
  initialData?: DepositWithdrawHistory[]
  initialDataCrypto?: DepositCryptoHistory[]
  initialPage: number
  initialType: string
  initialStatus: string
  isInitialLoading?: boolean
}
