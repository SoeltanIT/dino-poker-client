import { Locale } from '@/i18n-config'
import { DetailUnionDTO } from '@/types/betHistoryDTO'
import { LangProps } from '@/types/langProps'

export interface DetailBetHistoryProps {
  lang?: LangProps
  locale?: Locale
  detail: DetailUnionDTO | null
  open: boolean
  setOpen: (value: boolean) => void
  loading?: boolean
}
