import { Locale } from '@/i18n-config'
import { gameDTO } from '@/types/gameDTO'
import { LangProps } from '@/types/langProps'
import { GameListResponse } from '@/utils/api/internal/getGameList'

export interface GameListProps {
  lang: LangProps
  locale?: Locale
  initialData?: gameDTO[]
  initialPage: number
  isInitialLoading?: boolean
  initialTotalPage?: number
}
