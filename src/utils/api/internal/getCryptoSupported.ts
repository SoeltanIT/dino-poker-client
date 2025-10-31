import { serverApiClient } from '@/@core/lib/axios-client'
import { getApiEndpoint } from '@/utils/api_endpoint'

export const getCryptoSupported = async () => {
  const res = await serverApiClient.get(getApiEndpoint('cryptos_supported'), undefined, 'transaction')

  return res?.data?.data ?? []
}
