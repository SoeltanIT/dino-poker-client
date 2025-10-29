'use client'

import { GetData, useMutationQuery } from '@/@core/hooks/use-query'
import { IconSize, IconVerifyCheck, IconWithdrawConfirm } from '@/components/atoms/Icons'
import KYC from '@/components/layout/header/views/menu/kyc/KYC'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfigItem } from '@/types/config'
import { useLiveChatContext } from '@/utils/context/LiveChatProvider'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import DepositConfirmForm from './DepositConfirmForm'
import DepositForm from './DepositForm'
import WithdrawForm from './WithdrawForm'
import { DepositDataProps, DepositWithdrawSheetProps } from './types'

export default function DepositWithdrawSheet({
  open,
  onClose,
  defaultValue = 'DEPOSIT',
  lang,
  locale,
  data,
  selectedPromotion, // ✅ Add this
  features
}: DepositWithdrawSheetProps & { open: boolean; onClose: () => void }) {
  const { ready } = useLiveChatContext()
  const { data: session } = useSession()

  const [tabValue, setTabValue] = useState(defaultValue)
  const [activeTab, setActiveTab] = useState<string>('fiat')
  const [activeTabWD, setActiveTabWD] = useState<string>('fiat')

  const [isLoadingDeposit, setIsLoadingDeposit] = useState<boolean>(false)
  const [isLoadingWithdraw, setIsLoadingWithdraw] = useState<boolean>(false)
  const [isSubmittedDeposit, setIsSubmittedDeposit] = useState<boolean>(false)
  const [isSubmittedWithdraw, setIsSubmittedWithdraw] = useState<boolean>(false)
  const [depositData, setDepositData] = useState<DepositDataProps>({
    amount: 0,
    created_at: '',
    deposit_id: 0,
    type: ''
  })
  const [withdrawAmount, setWithdrawAmount] = useState(0)

  const isStatus = data?.data?.status

  // Sync tab when open changes
  useEffect(() => {
    if (open) {
      setTabValue(defaultValue)
    }
  }, [defaultValue, open])

  const { mutateAsync: depositRequest, isPending: depoPending } = useMutationQuery<any, any>(
    ['deposit'],
    'post',
    'json',
    true,
    lang?.common?.depositReqSuccess, // pesan sukses deposit
    [['user', 'me'], ['getTransactionHistory'], ['getBalance'], ['getListNotification'], ['getListNotifCount']], // ✅ tambahkan ini
    'transaction'
  )

  const { mutateAsync: depositCryptoRequest, isPending: depoCryptoPending } = useMutationQuery<any, any>(
    ['depositCrypto'],
    'post',
    'json',
    true,
    lang?.common?.depositReqSuccess, // pesan sukses deposit
    [['user', 'me'], ['getTransactionCrypto'], ['getBalance'], ['getListNotification'], ['getListNotifCount']], // ✅ tambahkan ini
    'transaction'
  )

  const { mutateAsync: withdrawRequest, isPending: withdrawPending } = useMutationQuery<any, any>(
    ['withdraw'],
    'post',
    'json',
    true,
    lang?.common?.withdrawReqSuccess, // pesan sukses withdraw
    [['user', 'me'], ['getTransactionHistory'], ['getBalance'], ['getListNotification'], ['getListNotifCount']], // ✅ tambahkan ini
    'transaction'
  )

  const { mutateAsync: withdrawCryptoRequest, isPending: withdrawCryptoPending } = useMutationQuery<any, any>(
    ['withdrawCrypto'],
    'post',
    'json',
    true,
    lang?.common?.withdrawReqSuccess, // pesan sukses withdraw
    [['user', 'me'], ['getTransactionCrypto'], ['getBalance'], ['getListNotification'], ['getListNotifCount']], // ✅ tambahkan ini
    'transaction'
  )

  const {
    data: respListConfig,
    isLoading: isLoadingConfig,
    refetch
  } = GetData<ConfigItem[]>(
    '/config', // hits your Next.js API route, not the real backend
    ['getConfig']
  )

  const { data: respCryptoSupported, isFetching: cryptoLoading } = GetData<any>(
    '/crypto_supported',
    ['getCryptoSupported'],
    false,
    undefined,
    true,
    undefined,
    undefined,
    undefined,
    'GET',
    undefined,
    'transaction'
  )

  useEffect(() => {
    if (open) {
      refetch()
    }
  }, [open, refetch])

  function getValueByKey(config: ConfigItem[], key: string): string | undefined {
    return config.find(item => item.key === key)?.value
  }

  const valueMaxDeposit = getValueByKey(respListConfig ?? [], 'max_deposit_amount')
  const valueMaxWithdraw = getValueByKey(respListConfig ?? [], 'max_withdraw_amount')
  const depoInstruction = getValueByKey(respListConfig ?? [], 'deposit_instruction')

  const handleDepositSubmit = async (data: any, activeTab: string) => {
    setIsLoadingDeposit(true)
    try {
      if (activeTab === 'crypto') {
        const resp = await depositCryptoRequest({
          url: '/deposit_crypto',
          body: {
            blockchain_id: parseInt(data?.coin_network),
            token_symbol: data?.crypto,
            promotion_id: data?.promo_id ?? ''
          }
        })

        if (resp?.status === 'success') {
          setDepositData({
            type: 'DEPOSIT CRYPTO',
            deposit_id: resp?.data?.deposit_id || '',
            expired_at: resp?.data?.expires_at || '',
            wallet_address: resp?.data?.wallet_address || '',
            external_deposit_id: resp?.data?.external_deposit_id || '',
            promotion: resp?.data?.promotion || null
          })
          setIsSubmittedDeposit(true)
          setIsLoadingDeposit(false)
          // onClose()
        }
      } else {
        const resp = await depositRequest({
          url: '/deposit',
          body: {
            amount: parseInt(data?.amount),
            transaction_password: data?.password,
            promotion_id: data?.promo_id ?? ''
          }
        })
        if (resp?.status === 'success') {
          setDepositData({
            amount: parseInt(data?.amount),
            type: 'DEPOSIT FIAT',
            created_at: resp?.data?.created_at || new Date().toISOString(),
            deposit_id: resp?.data?.deposit_id || ''
          })
          setIsSubmittedDeposit(true)
          setIsLoadingDeposit(false)
          // onClose()
        }
      }

      setIsLoadingDeposit(false)
    } catch (error) {
      setIsLoadingDeposit(false)
    }
  }

  const handleWithdrawSubmit = async (data: any, activeTab: string) => {
    setIsLoadingWithdraw(true)
    setWithdrawAmount(data?.amount)
    try {
      if (activeTab === 'crypto') {
        const resp = await withdrawCryptoRequest({
          url: '/withdraw_crypto',
          body: {
            blockchain_id: parseInt(data?.coin_network),
            token_symbol: data?.crypto,
            amount: parseInt(data?.amount_crypto),
            transaction_password: data?.withdrawalPassword,
            withdrawal_address: data?.withdraw_address
          }
        })

        if (resp?.status === 'success') {
          setIsSubmittedWithdraw(true)
          setIsLoadingWithdraw(false)
          // onClose()
        }
      } else {
        const resp = await withdrawRequest({
          url: '/withdraw',
          body: {
            amount: parseInt(data?.amount),
            transaction_password: data?.withdrawalPassword
          }
        })

        if (resp?.status === 'success') {
          setIsSubmittedWithdraw(true)
          setIsLoadingWithdraw(false)
          // onClose()
        }
      }

      setIsLoadingWithdraw(false)
    } catch (error) {
      setIsLoadingWithdraw(false)
    }
  }

  const handleClick = () => {
    if (
      typeof window !== 'undefined' &&
      typeof window.LiveChatWidget !== 'undefined' &&
      typeof window.LiveChatWidget.call === 'function'
    ) {
      if (!ready) {
        console.warn('[LiveChat] Widget is not ready yet. Aborting...')
        return
      }

      const widget = window.LiveChatWidget

      if (!widget || typeof widget.call !== 'function') {
        console.error('[LiveChat] LiveChatWidget is not available or malformed.')
        return
      }

      if (session?.user) {
        widget.call('set_customer_name', session.user.name ?? '')
        widget.call('set_customer_email', session.user.email ?? '')
      } else {
      }
      window.LiveChatWidget.call('maximize')
    } else {
      console.warn('[LiveChat] Widget not ready')
    }
  }

  const openContactUS = () => {
    handleClick()
    setIsSubmittedDeposit(false)
    setIsSubmittedWithdraw(false)
    onClose()
  }

  const onCloseFunction = () => {
    setIsSubmittedDeposit(false)
    setIsSubmittedWithdraw(false)
    onClose()
  }

  return (
    <>
      <Sheet open={open} onOpenChange={isOpen => !isOpen && onCloseFunction()}>
        <SheetContent className='w-full sm:max-w-md overflow-y-auto scrollbar-hide'>
          <ToastContainer position='top-right' />
          <Tabs value={tabValue} onValueChange={setTabValue} className='w-full'>
            <TabsList className='flex items-center justify-between pb-6 mt-6'>
              <div className='flex space-x-4'>
                <TabsTrigger
                  value='DEPOSIT'
                  className={`text-lg font-medium transition-colors uppercase ${
                    tabValue === 'DEPOSIT' ? 'text-app-text-color' : 'text-app-neutral500'
                  }`}
                >
                  {lang?.common?.deposit}
                </TabsTrigger>
                <TabsTrigger
                  value='WITHDRAW'
                  className={`text-lg font-medium transition-colors uppercase ${
                    tabValue === 'WITHDRAW' ? 'text-app-text-color' : 'text-app-neutral500'
                  }`}
                >
                  {lang?.common?.withdraw}
                </TabsTrigger>
              </div>
            </TabsList>

            <TabsContent value='DEPOSIT'>
              {!isSubmittedDeposit ? (
                <DepositForm
                  onSubmit={handleDepositSubmit}
                  lang={lang}
                  isLoading={isLoadingDeposit}
                  selectedPromotion={selectedPromotion}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  configData={valueMaxDeposit}
                  isLoadingConfig={isLoadingConfig}
                  features={features}
                  isStatus={isStatus}
                  onClose={onClose}
                  openContactUS={openContactUS}
                  cryptoData={respCryptoSupported}
                  cryptoLoading={cryptoLoading}
                />
              ) : (
                <DepositConfirmForm
                  activeTab={activeTab}
                  lang={lang}
                  data={depositData}
                  locale={locale}
                  onClose={onCloseFunction}
                  configData={depoInstruction}
                />
              )}
            </TabsContent>

            <TabsContent value='WITHDRAW'>
              {!isSubmittedWithdraw ? (
                <WithdrawForm
                  activeTab={activeTabWD}
                  setActiveTab={setActiveTabWD}
                  onSubmit={handleWithdrawSubmit}
                  lang={lang}
                  isLoading={isLoadingWithdraw}
                  isStatus={isStatus}
                  configData={valueMaxWithdraw}
                  onClose={onClose}
                  openContactUS={openContactUS}
                  cryptoData={respCryptoSupported}
                  cryptoLoading={cryptoLoading}
                />
              ) : (
                <div className='h-[70vh] flex flex-col justify-center items-center mt-10'>
                  <IconWithdrawConfirm size={IconSize['3xl']} />
                  <span className='text-sm font-semibold text-app-text-color'>{lang?.common.withdrawMsg}</span>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
    </>
  )
}
