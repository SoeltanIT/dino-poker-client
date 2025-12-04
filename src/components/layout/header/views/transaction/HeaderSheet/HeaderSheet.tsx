'use client'

import ConvertBalanceTab from '@/components/layout/header/views/transaction/HeaderSheet/components/ConvertBalanceTab'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import DepositTab from './components/DepositTab'
import TransactionTabs from './components/TransactionTabs'
import WithdrawTab from './components/WithdrawTab'
import { useConfigData } from './hooks/useConfigData'
import { useCryptoData } from './hooks/useCryptoData'
import { useDepositWithdraw } from './hooks/useDepositWithdraw'
import { useLiveChat } from './hooks/useLiveChat'
import { HeaderSheetProps } from './types'

export default function HeaderSheet({
  open,
  onClose,
  defaultValue = 'DEPOSIT',
  lang,
  locale,
  data,
  selectedPromotion,
  features,
  balance,
  dataFee,
  pokerBalance
}: HeaderSheetProps & { open: boolean; onClose: () => void }) {
  const [tabValue, setTabValue] = useState(defaultValue)
  const [activeTab, setActiveTab] = useState<string>('fiat')
  const [activeTabWD, setActiveTabWD] = useState<string>('fiat')
  const isStatus = data?.data?.status

  // Custom hooks
  const {
    maxDepositAmount,
    maxWithdrawAmount,
    depositInstruction,
    cryptoWithdrawFee,
    isLoading: isLoadingConfig
  } = useConfigData(open)

  const { cryptoData, isLoading: cryptoLoading } = useCryptoData()

  const { openLiveChat } = useLiveChat()

  const {
    handleDepositSubmit,
    isLoadingDeposit,
    isSubmittedDeposit,
    depositData,
    resetDeposit,
    handleWithdrawSubmit,
    isLoadingWithdraw,
    isSubmittedWithdraw,
    resetWithdraw,
    resetAll
  } = useDepositWithdraw({ lang })

  // Sync tab when open changes
  useEffect(() => {
    if (open) {
      setTabValue(defaultValue)
    }
  }, [defaultValue, open])

  const openContactUS = () => {
    openLiveChat()
    resetAll()
    onClose()
  }

  const handleClose = () => {
    resetAll()
    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={isOpen => !isOpen && handleClose()}>
      <SheetContent className='w-full sm:max-w-md overflow-y-auto scrollbar-hide'>
        <ToastContainer position='top-right' />
        <TransactionTabs
          tabValue={tabValue}
          onTabChange={setTabValue}
          lang={lang}
          depositTab={
            <DepositTab
              isSubmitted={isSubmittedDeposit}
              isLoading={isLoadingDeposit}
              depositData={depositData}
              onSubmit={handleDepositSubmit}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onClose={handleClose}
              openContactUS={openContactUS}
              lang={lang}
              locale={locale}
              selectedPromotion={selectedPromotion}
              features={features}
              isStatus={isStatus}
              maxDepositAmount={maxDepositAmount}
              isLoadingConfig={isLoadingConfig}
              cryptoData={cryptoData}
              cryptoLoading={cryptoLoading}
              depositInstruction={depositInstruction}
            />
          }
          withdrawTab={
            <WithdrawTab
              isSubmitted={isSubmittedWithdraw}
              isLoading={isLoadingWithdraw}
              onSubmit={handleWithdrawSubmit}
              activeTab={activeTabWD}
              setActiveTab={setActiveTabWD}
              onClose={onClose}
              openContactUS={openContactUS}
              lang={lang}
              isStatus={isStatus}
              maxWithdrawAmount={maxWithdrawAmount}
              isLoadingConfig={isLoadingConfig}
              features={features}
              cryptoData={cryptoData}
              cryptoLoading={cryptoLoading}
              cryptoWithdrawFee={cryptoWithdrawFee}
              locale={locale}
            />
          }
          convertBalanceTab={
            <ConvertBalanceTab
              pokerBalance={pokerBalance}
              lang={lang}
              locale={locale}
              data={balance}
              dataFee={dataFee}
            />
          }
        />
      </SheetContent>
    </Sheet>
  )
}
