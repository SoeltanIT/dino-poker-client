import { transferBalance } from '@/utils/api/internal/transferBalance'
import { Locale } from '@/i18n-config'
import { BalanceDTO } from '@/types/balanceDTO'
import { ReactNode } from 'react'
import { UserMeResponse } from '../User'
import { TransferFeeDTO } from '@/types/transferBalanceFeeDTO'
import { TransferFeeMapped } from '@/utils/api/internal/transferBalanceFee'

export interface HeaderProps {
  children?: ReactNode
  lang: any
  locale?: Locale
  data?: UserMeResponse
  balance?: BalanceDTO
  transferBalanceFee?: TransferFeeMapped
  theme: string
}
