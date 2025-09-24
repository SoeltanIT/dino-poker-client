import { Locale } from '@/i18n-config'
import { LangProps } from '@/types/langProps'
import { GameListResponse } from '@/utils/api/internal/getGameList'

export interface GameListProps {
  lang: LangProps
  locale?: Locale
  initialData?: GameListResponse | null
  initialPage: number
  isInitialLoading?: boolean
  initialTotalPage?: number
}
