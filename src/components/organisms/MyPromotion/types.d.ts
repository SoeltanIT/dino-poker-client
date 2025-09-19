import { TransactionItem, TransactionResponse } from '@/@core/interface/transactions/Transactions'
import { Locale } from '@/i18n-config'
import { LangProps } from '@/types/langProps'
import { MyPromotionDTO, PromotionDTO } from '@/types/promotionDTO'
import { DepositWithdrawHistory } from '@/types/transaction'

export interface MyPromotionProps {
  lang?: LangProps
  locale?: Locale
  initialDataPromoOngoing?: MyPromotionDTO[]
  initialDataPromoHistory?: MyPromotionDTO[]
}
