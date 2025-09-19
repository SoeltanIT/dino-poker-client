import { Locale } from '@/i18n-config'

export interface FooterProps {
  children?: ReactNode
  lang: any
  locale?: Locale
  theme: string
  content?: string
  version?: string
}
