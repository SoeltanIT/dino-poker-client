import { Locale } from '@/i18n-config'
import { BalanceDTO, PokerBalanceDTO } from '@/types/balanceDTO'
import { LangProps } from '@/types/langProps'
import { ReactNode } from 'react'

export interface MyBalanceSheetProps {
  children?: ReactNode
  lang?: LangProps
  locale?: Locale
  data?: BalanceDTO
  pokerBalance?: PokerBalanceDTO
  onShow?: boolean
  dataFee?: TransferFeePayload
}

export interface MyBalanceProps {
  lang?: LangProps
  locale?: Locale
  onClose?: () => void
  data?: BalanceDTO
  dataFee?: TransferFeePayload
}
