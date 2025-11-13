import { Locale } from '@/i18n-config'
import { LangProps } from '@/types/langProps'
import { ReferralGroupHistoryListResponse } from '@/utils/api/internal/getReferralHistory'
import { ReferralSummaryData } from '@/utils/api/internal/getReferralSummary'

export interface AffiliateDetailProps {
  lang?: LangProps
  locale?: Locale
  initialData?: ReferralGroupHistoryListResponse | null
  initialSummaryData?: ReferralSummaryData | null
  isLoading?: boolean
  isLogin?: boolean
  roles?: number
}
