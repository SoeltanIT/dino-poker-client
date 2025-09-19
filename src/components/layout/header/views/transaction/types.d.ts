import { UserMeResponse } from '@/@core/interface/User'
import { DepositFormData } from '@/@core/utils/schema/Transaction/DepositCryptoSchema'
import { WithdrawFormData } from '@/@core/utils/schema/Transaction/WithdrawSchema'
import { Locale } from '@/i18n-config'
import { LangProps } from '@/types/langProps'

export interface DepositFormProps {
  onSubmit: (data: DepositFormData, activeTab: string) => void
  lang?: LangProps
  locale?: Locale
  isLoading?: boolean
  selectedPromotion?: {
    id: string
    name: string
  } | null
  activeTab: string
  setActiveTab: (tab: string) => void // ✅ Add this
}

export interface DepositWithdrawSheetProps {
  // children: React.ReactNode
  defaultValue: string
  lang?: LangProps
  locale?: Locale
  data?: UserMeResponse
  selectedPromotion?: any
}

export interface WithdrawFormProps {
  onSubmit: (data: WithdrawFormData) => void
  lang?: LangProps
  locale?: Locale
  isLoading?: boolean
  isStatus?: string
}

export interface DepositDataProps {
  amount?: number
  created_at?: string
  deposit_id?: number
  type?: string
  expired_at?: string
  wallet_address?: string
  external_deposit_id?: string
  promotion?: {
    name: string
    min_deposit: string
  }
}

export interface DepositConfirmFormProps {
  lang?: LangProps
  locale?: Locale
  data: DepositDataProps
  onClose: () => void
  activeTab?: string
}
