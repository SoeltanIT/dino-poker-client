import { Locale } from '@/i18n-config'
import { BalanceDTO } from '@/types/balanceDTO'
import { ReactNode } from 'react'
import { UserMeResponse } from '../User'
// HeaderProps
import type { TransferFeePayload } from '@/types/transferBalanceFeeDTO'
import { FeatureFlags } from '@/components/templates/App/AppWrapper'

export interface HeaderProps {
  children?: ReactNode
  lang: any
  locale?: Locale
  data?: UserMeResponse
  balance?: BalanceDTO
  theme: string
  transferBalanceFee?: TransferFeePayload // ← changed
  features?: FeatureFlags
}
