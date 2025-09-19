import { Locale } from '@/i18n-config'
import { LangProps } from '@/types/langProps'
import { ReferralHistoryListResponse } from '@/utils/api/internal/getReferralHistory'
import { ReferralSummaryData } from '@/utils/api/internal/getReferralSummary'

export interface ReferralDetailProps {
  lang?: LangProps
  locale?: Locale
  initialData?: ReferralHistoryListResponse | null
  initialSummaryData?: ReferralSummaryData | null
  isLoading?: boolean
  isLogin?: boolean
}
