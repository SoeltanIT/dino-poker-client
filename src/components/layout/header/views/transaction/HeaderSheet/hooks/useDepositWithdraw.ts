import { useMutationQuery } from '@/@core/hooks/use-query'
import { useState } from 'react'
import { DepositDataProps } from '../types'
import { LangProps } from '@/types/langProps'

interface UseDepositWithdrawProps {
  lang: LangProps
}

interface DepositCryptoData {
  coin_network: string
  crypto: string
  promo_id?: string
}

interface DepositFiatData {
  amount: string
  password: string
  promo_id?: string
}

interface WithdrawCryptoData {
  coin_network: string
  crypto: string
  amount_crypto: string
  withdrawalPassword: string
  withdraw_address: string
}

interface WithdrawFiatData {
  amount: string
  withdrawalPassword: string
}

export function useDepositWithdraw({ lang }: UseDepositWithdrawProps) {
  const [isLoadingDeposit, setIsLoadingDeposit] = useState(false)
  const [isLoadingWithdraw, setIsLoadingWithdraw] = useState(false)
  const [isSubmittedDeposit, setIsSubmittedDeposit] = useState(false)
  const [isSubmittedWithdraw, setIsSubmittedWithdraw] = useState(false)
  const [depositData, setDepositData] = useState<DepositDataProps>({
    amount: 0,
    created_at: '',
    deposit_id: 0,
    type: ''
  })
  const [withdrawAmount, setWithdrawAmount] = useState(0)

  const { mutateAsync: depositRequest, isPending: depoPending } = useMutationQuery<any, any>(
    ['deposit'],
    'post',
    'json',
    true,
    lang?.common?.depositReqSuccess,
    [
      ['user', 'me'],
      ['getTransactionHistory'],
      ['getBalance'],
      ['getListNotification'],
      ['getListNotifCount']
    ],
    'transaction'
  )

  const { mutateAsync: depositCryptoRequest, isPending: depoCryptoPending } = useMutationQuery<any, any>(
    ['depositCrypto'],
    'post',
    'json',
    true,
    lang?.common?.depositReqSuccess,
    [
      ['user', 'me'],
      ['getTransactionCrypto'],
      ['getBalance'],
      ['getListNotification'],
      ['getListNotifCount']
    ],
    'transaction'
  )

  const { mutateAsync: withdrawRequest, isPending: withdrawPending } = useMutationQuery<any, any>(
    ['withdraw'],
    'post',
    'json',
    true,
    lang?.common?.withdrawReqSuccess,
    [
      ['user', 'me'],
      ['getTransactionHistory'],
      ['getBalance'],
      ['getListNotification'],
      ['getListNotifCount']
    ],
    'transaction'
  )

  const { mutateAsync: withdrawCryptoRequest, isPending: withdrawCryptoPending } = useMutationQuery<any, any>(
    ['withdrawCrypto'],
    'post',
    'json',
    true,
    lang?.common?.withdrawReqSuccess,
    [
      ['user', 'me'],
      ['getTransactionCrypto'],
      ['getBalance'],
      ['getListNotification'],
      ['getListNotifCount']
    ],
    'transaction'
  )

  const handleDepositSubmit = async (data: DepositCryptoData | DepositFiatData, activeTab: string) => {
    setIsLoadingDeposit(true)
    try {
      if (activeTab === 'crypto') {
        const cryptoData = data as DepositCryptoData
        const resp = await depositCryptoRequest({
          url: '/deposit_crypto',
          body: {
            blockchain_id: parseInt(cryptoData?.coin_network),
            token_symbol: cryptoData?.crypto,
            promotion_id: cryptoData?.promo_id ?? ''
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
        }
      } else {
        const fiatData = data as DepositFiatData
        const resp = await depositRequest({
          url: '/deposit',
          body: {
            amount: parseInt(fiatData?.amount),
            transaction_password: fiatData?.password,
            promotion_id: fiatData?.promo_id ?? ''
          }
        })

        if (resp?.status === 'success') {
          setDepositData({
            amount: parseInt(fiatData?.amount),
            type: 'DEPOSIT FIAT',
            created_at: resp?.data?.created_at || new Date().toISOString(),
            deposit_id: resp?.data?.deposit_id || ''
          })
          setIsSubmittedDeposit(true)
        }
      }
    } catch (error) {
      console.error('Deposit error:', error)
    } finally {
      setIsLoadingDeposit(false)
    }
  }

  const handleWithdrawSubmit = async (data: WithdrawCryptoData | WithdrawFiatData, activeTab: string) => {
    setIsLoadingWithdraw(true)
    setWithdrawAmount((data as any)?.amount || (data as WithdrawCryptoData)?.amount_crypto || 0)
    try {
      if (activeTab === 'crypto') {
        const cryptoData = data as WithdrawCryptoData
        const resp = await withdrawCryptoRequest({
          url: '/withdraw_crypto',
          body: {
            blockchain_id: parseInt(cryptoData?.coin_network),
            token_symbol: cryptoData?.crypto,
            amount: parseInt(cryptoData?.amount_crypto),
            transaction_password: cryptoData?.withdrawalPassword,
            withdrawal_address: cryptoData?.withdraw_address
          }
        })

        if (resp?.status === 'success') {
          setIsSubmittedWithdraw(true)
        }
      } else {
        const fiatData = data as WithdrawFiatData
        const resp = await withdrawRequest({
          url: '/withdraw',
          body: {
            amount: parseInt(fiatData?.amount),
            transaction_password: fiatData?.withdrawalPassword
          }
        })

        if (resp?.status === 'success') {
          setIsSubmittedWithdraw(true)
        }
      }
    } catch (error) {
      console.error('Withdraw error:', error)
    } finally {
      setIsLoadingWithdraw(false)
    }
  }

  const resetDeposit = () => {
    setIsSubmittedDeposit(false)
    setDepositData({
      amount: 0,
      created_at: '',
      deposit_id: 0,
      type: ''
    })
  }

  const resetWithdraw = () => {
    setIsSubmittedWithdraw(false)
    setWithdrawAmount(0)
  }

  const resetAll = () => {
    resetDeposit()
    resetWithdraw()
  }

  return {
    // Deposit
    handleDepositSubmit,
    isLoadingDeposit: isLoadingDeposit || depoPending || depoCryptoPending,
    isSubmittedDeposit,
    depositData,
    resetDeposit,

    // Withdraw
    handleWithdrawSubmit,
    isLoadingWithdraw: isLoadingWithdraw || withdrawPending || withdrawCryptoPending,
    isSubmittedWithdraw,
    withdrawAmount,
    resetWithdraw,

    // Common
    resetAll
  }
}

