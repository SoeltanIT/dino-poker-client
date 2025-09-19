import { Locale } from '@/i18n-config'
import { LangProps } from '@/types/langProps'
import { PromotionDTO } from '@/types/promotionDTO'

export interface PromotionSelectorProps {
  lang?: LangProps
  locale?: Locale
  initialData?: PromotionDTO[]
  selectedPromotion?: Promotion
  isLoading?: boolean
  onSelect: (promotion: Promotion) => void
}
