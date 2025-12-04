import { Locale } from '@/i18n-config'
import { BalanceDTO, PokerBalanceDTO } from '@/types/balanceDTO'
import { LangProps } from '@/types/langProps'
import { TransferFeePayload } from '@/types/transferBalanceFeeDTO'
import MyBalance from './MyBalance'

interface ConvertBalanceTabProps {
  lang?: LangProps
  locale?: Locale
  data?: BalanceDTO
  pokerBalance: PokerBalanceDTO
  dataFee?: TransferFeePayload
}

export default function ConvertBalanceTab({ lang, locale, data, pokerBalance, dataFee }: ConvertBalanceTabProps) {
  return <MyBalance lang={lang} locale={locale} pokerBalance={pokerBalance} data={data} dataFee={dataFee} />
}
