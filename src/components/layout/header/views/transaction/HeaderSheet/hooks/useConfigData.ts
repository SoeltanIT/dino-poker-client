import { GetData } from '@/@core/hooks/use-query'
import { ConfigItem } from '@/types/config'
import { useEffect } from 'react'

interface UseConfigDataReturn {
  config: ConfigItem[]
  isLoading: boolean
  getValueByKey: (key: string) => string | undefined
  maxDepositAmount: string | undefined
  maxWithdrawAmount: string | undefined
  depositInstruction: string | undefined
  cryptoWithdrawFee: any
}

export function useConfigData(open: boolean): UseConfigDataReturn {
  const {
    data: respListConfig,
    isLoading: isLoadingConfig,
    refetch
  } = GetData<ConfigItem[]>('/config', ['getConfig'])

  useEffect(() => {
    if (open) {
      refetch()
    }
  }, [open, refetch])

  const getValueByKey = (key: string): string | undefined => {
    return respListConfig?.find(item => item.key === key)?.value
  }

  const maxDepositAmount = getValueByKey('max_deposit_amount')
  const maxWithdrawAmount = getValueByKey('max_withdraw_amount')
  const depositInstruction = getValueByKey('deposit_instruction')
  const cryptoWithdrawFeeInfo = getValueByKey('crypto_withdraw_fee')

  // Safely parse if it's a JSON string
  let parsedCryptoWithdrawFeeInfo: any = null
  try {
    parsedCryptoWithdrawFeeInfo =
      typeof cryptoWithdrawFeeInfo === 'string' ? JSON.parse(cryptoWithdrawFeeInfo) : cryptoWithdrawFeeInfo
  } catch {
    parsedCryptoWithdrawFeeInfo = null
  }

  return {
    config: respListConfig ?? [],
    isLoading: isLoadingConfig,
    getValueByKey,
    maxDepositAmount,
    maxWithdrawAmount,
    depositInstruction,
    cryptoWithdrawFee: parsedCryptoWithdrawFeeInfo
  }
}

