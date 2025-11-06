import { GetData } from '@/@core/hooks/use-query'

interface UseCryptoDataReturn {
  cryptoData: any
  isLoading: boolean
}

export function useCryptoData(): UseCryptoDataReturn {
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

  return {
    cryptoData: respCryptoSupported,
    isLoading: cryptoLoading
  }
}

