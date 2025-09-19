import { Locale } from '@/i18n-config'
import { LangProps } from '@/types/langProps'
import { ListBankDTO } from '@/types/listBankDTO'

export interface BankAccountProps {
  lang?: LangProps
  locale?: Locale
  initialData?: ListBankDTO | null
}
