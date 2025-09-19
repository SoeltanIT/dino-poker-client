import { Locale } from '@/i18n-config'
import { LangProps } from '@/types/langProps'

export interface NotificationProps {
  lang?: LangProps
  locale?: Locale
  isLogin: boolean
}
