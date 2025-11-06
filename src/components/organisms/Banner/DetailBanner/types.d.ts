import { Locale } from '@/i18n-config'
import { LangProps } from '@/types/langProps'
import { PromotionDTO } from '@/types/promotionDTO'

export interface DetailPromotionProps {
  lang: LangProps
  locale?: Locale
  initialData: PromotionDTO
  isLogin?: boolean
}
