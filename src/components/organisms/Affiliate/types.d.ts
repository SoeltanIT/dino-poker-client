import { Locale } from '@/i18n-config'
import { LangProps } from '@/types/langProps'
import { AffiliateListResponse, ReferralDTO } from '@/types/referralDTO'

export interface MyAffiliateProps {
  lang?: LangProps
  locale?: Locale
  initialAffiliateData?: AffiliateListResponse | null
  initialAffiliateUserData?: AffiliateUserListResponse | null
  myReferralData?: ReferralDTO | null
}
