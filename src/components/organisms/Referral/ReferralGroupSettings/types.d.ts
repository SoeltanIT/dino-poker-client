import { Locale } from '@/i18n-config'
import { LangProps } from '@/types/langProps'
import { ReferralHistoryResponse, ReferralSettingsResponse } from '@/types/referralDTO'
import { ReferralGroupHistoryListResponse } from '@/utils/api/internal/getReferralHistory'
import { ReferralSummaryData } from '@/utils/api/internal/getReferralSummary'

export interface MyReferralGroupSettingsProps {
  lang?: LangProps
  locale?: Locale
  initialData?: ReferralSettingsResponse | null
  isLogin?: boolean
}
