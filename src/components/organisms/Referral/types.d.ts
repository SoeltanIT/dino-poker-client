import { TransactionItem, TransactionResponse } from '@/@core/interface/transactions/Transactions'
import { Locale } from '@/i18n-config'
import { LangProps } from '@/types/langProps'
import { PromotionDTO } from '@/types/promotionDTO'
import { ReferralDTO } from '@/types/referralDTO'
import { DepositWithdrawHistory } from '@/types/transaction'

export interface MyReferralProps {
  lang?: LangProps
  locale?: Locale
  initialData?: ReferralDTO
  isLoading?: boolean
}
