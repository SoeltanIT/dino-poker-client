import { Locale } from '@/i18n-config'
import { LangProps } from '@/types/langProps'
import { ReferralDTO } from '@/types/referralDTO'

export interface MyReferralProps {
  lang?: LangProps
  locale?: Locale
  initialData?: ReferralDTO
  isLoading?: boolean
}
