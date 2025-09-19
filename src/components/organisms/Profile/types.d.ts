import { UserMeResponse } from '@/@core/interface/User'
import { Locale } from '@/i18n-config'
import { LangProps } from '@/types/langProps'
import { UserDTO, UserFullDTO } from '@/types/userDTO'

export interface MenuProfileProps {
  data: UserFullDTO
  onClose: () => void
  buttonLogoutRef: React.RefObject<HTMLButtonElement>
  // setIsOpenLogout: () => void
  locale?: Locale
  lang: LangProps
}
