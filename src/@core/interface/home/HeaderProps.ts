import { Locale } from '@/i18n-config'
import { BalanceDTO } from '@/types/balanceDTO'
import { ReactNode } from 'react'
import { UserMeResponse } from '../User'

export interface HeaderProps {
  children?: ReactNode
  lang: any
  locale?: Locale
  data?: UserMeResponse
  balance?: BalanceDTO
  theme: string
}
