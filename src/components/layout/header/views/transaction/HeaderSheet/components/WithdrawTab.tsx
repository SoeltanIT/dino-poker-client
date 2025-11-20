import { IconSize, IconWithdrawConfirm } from '@/components/atoms/Icons'
import { DepositWithdrawSheetProps } from '../types'
import WithdrawForm from './WithdrawForm'
import { Locale } from '@/i18n-config'

interface WithdrawTabProps {
  isSubmitted: boolean
  isLoading: boolean
  onSubmit: (data: any, activeTab: string) => void
  activeTab: string
  setActiveTab: (tab: string) => void
  onClose: () => void
  openContactUS: () => void
  lang: DepositWithdrawSheetProps['lang']
  isStatus?: string
  maxWithdrawAmount?: string
  isLoadingConfig?: boolean
  features?: DepositWithdrawSheetProps['features']
  cryptoData: any
  cryptoLoading: boolean
  cryptoWithdrawFee?: any
  locale?: Locale
}

export default function WithdrawTab({
  isSubmitted,
  isLoading,
  onSubmit,
  activeTab,
  setActiveTab,
  onClose,
  openContactUS,
  lang,
  isStatus,
  maxWithdrawAmount,
  isLoadingConfig,
  features,
  cryptoData,
  cryptoLoading,
  cryptoWithdrawFee,
  locale
}: WithdrawTabProps) {
  if (!isSubmitted) {
    return (
      <WithdrawForm
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSubmit={onSubmit}
        lang={lang}
        isLoading={isLoading}
        isStatus={isStatus}
        configData={maxWithdrawAmount}
        onClose={onClose}
        openContactUS={openContactUS}
        features={features}
        cryptoData={cryptoData}
        cryptoLoading={cryptoLoading}
        cryptoWithdrawFeeInfo={cryptoWithdrawFee}
        locale={locale}
      />
    )
  }

  return (
    <div className='h-[70vh] flex flex-col justify-center items-center mt-10'>
      <IconWithdrawConfirm size={IconSize['3xl']} />
      <span className='text-sm font-semibold text-app-text-color'>{lang?.common.withdrawMsg}</span>
    </div>
  )
}
