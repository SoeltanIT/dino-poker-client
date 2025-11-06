import { Locale } from '@/i18n-config'
import { BalanceDTO } from '@/types/balanceDTO'
import { LangProps } from '@/types/langProps'
import { TransferFeePayload } from '@/types/transferBalanceFeeDTO'
import MyBalance from './MyBalance'

interface ConvertBalanceTabProps {
  lang?: LangProps
  locale?: Locale
  data?: BalanceDTO
  dataFee?: TransferFeePayload
}

export default function ConvertBalanceTab({ lang, locale, data, dataFee }: ConvertBalanceTabProps) {
  return <MyBalance lang={lang} locale={locale} data={data} dataFee={dataFee} />
}
