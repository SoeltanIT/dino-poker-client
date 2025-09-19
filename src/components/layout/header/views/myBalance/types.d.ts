import { BalanceResponse } from '@/@core/interface/balance/Balance'
import { Locale } from '@/i18n-config'
import { BalanceDTO } from '@/types/balanceDTO'
import { LangProps } from '@/types/langProps'
import { ReactNode } from 'react'

export interface MyBalanceSheetProps {
  children?: ReactNode
  lang?: LangProps
  locale?: Locale
  data?: BalanceDTO
  onShow?: boolean
}

export interface MyBalanceProps {
  lang?: LangProps
  locale?: Locale
  onClose?: () => void
  data?: BalanceDTO
}
