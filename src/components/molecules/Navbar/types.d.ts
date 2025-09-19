import { UserMeResponse } from '@/@core/interface/User'
import { Locale } from '@/i18n-config'

export interface NavbarProps {
  children?: ReactNode
  lang: any
  locale: Locale
  isLogin: boolean
  data?: UserMeResponse
}
