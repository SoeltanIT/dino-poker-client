import { UserMeResponse } from '@/@core/interface/User'
import { DepositFormData } from '@/@core/utils/schema/Transaction/DepositCryptoSchema'
import { WithdrawFormData } from '@/@core/utils/schema/Transaction/WithdrawSchema'
import { FeatureFlags } from '@/components/templates/App/AppWrapper'
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
  configData?: string
  isLoadingConfig?: boolean
  features?: FeatureFlags
  isStatus?: string
  onClose: () => void
  openContactUS: () => void
  cryptoData: any
  cryptoLoading: boolean
}

export interface DepositWithdrawSheetProps {
  // children: React.ReactNode
  defaultValue: string
  lang: LangProps
  locale?: Locale
  data?: UserMeResponse
  selectedPromotion?: any
  features?: FeatureFlags
}

export interface CryptoWithdrawFeeInfo {
 base_coin: string
 is_active: boolean
 value: number
}

export interface WithdrawFormProps {
  onSubmit: (data: any, activeTab: string) => void
  lang?: LangProps
  locale?: Locale
  isLoading?: boolean
  isStatus?: string
  configData?: string
  isLoadingConfig?: boolean
  onClose: () => void
  openContactUS: () => void
  activeTab: string
  setActiveTab: (tab: string) => void // ✅ Add this
  cryptoData: any
  cryptoLoading: boolean
  cryptoWithdrawFeeInfo?: any
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
  configData?: string
}
