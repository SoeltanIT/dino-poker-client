import { DepositDataProps, DepositWithdrawSheetProps } from '../types'
import DepositConfirmForm from './DepositConfirmForm'
import DepositForm from './DepositForm'

interface DepositTabProps {
  isSubmitted: boolean
  isLoading: boolean
  depositData: DepositDataProps
  onSubmit: (data: any, activeTab: string) => void
  activeTab: string
  setActiveTab: (tab: string) => void
  onClose: () => void
  openContactUS: () => void
  lang: DepositWithdrawSheetProps['lang']
  locale?: DepositWithdrawSheetProps['locale']
  selectedPromotion?: DepositWithdrawSheetProps['selectedPromotion']
  features?: DepositWithdrawSheetProps['features']
  isStatus?: string
  maxDepositAmount?: string
  isLoadingConfig?: boolean
  cryptoData: any
  cryptoLoading: boolean
  depositInstruction?: string
}

export default function DepositTab({
  isSubmitted,
  isLoading,
  depositData,
  onSubmit,
  activeTab,
  setActiveTab,
  onClose,
  openContactUS,
  lang,
  locale,
  selectedPromotion,
  features,
  isStatus,
  maxDepositAmount,
  isLoadingConfig,
  cryptoData,
  cryptoLoading,
  depositInstruction
}: DepositTabProps) {
  if (!isSubmitted) {
    return (
      <DepositForm
        onSubmit={onSubmit}
        lang={lang}
        isLoading={isLoading}
        selectedPromotion={selectedPromotion}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        configData={maxDepositAmount}
        isLoadingConfig={isLoadingConfig}
        features={features}
        isStatus={isStatus}
        onClose={onClose}
        openContactUS={openContactUS}
        cryptoData={cryptoData}
        cryptoLoading={cryptoLoading}
      />
    )
  }

  return (
    <DepositConfirmForm
      activeTab={activeTab}
      lang={lang}
      data={depositData}
      locale={locale}
      onClose={onClose}
      configData={depositInstruction}
    />
  )
}
