import { Locale } from '@/i18n-config'
import { LangProps } from '@/types/langProps'

export interface KYCFormProps {
  lang?: LangProps
  locale?: Locale
  onClose: () => void
  isStatus?: string
}
