import { UserMeResponse } from '@/@core/interface/User'
import { FeatureFlags } from '@/components/templates/App/AppWrapper'
import { Locale } from '@/i18n-config'

export interface NavbarProps {
  children?: ReactNode
  lang: any
  locale: Locale
  isLogin: boolean
  data?: UserMeResponse
  features: FeatureFlags
}
