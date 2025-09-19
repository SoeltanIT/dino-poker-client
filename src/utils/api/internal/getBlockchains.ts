import { serverApiClient } from '@/@core/lib/axios-client'
import { getApiEndpoint } from '@/utils/api_endpoint'

export const getListBlockchains = async () => {
  const res = await serverApiClient.get(getApiEndpoint('blockchains'), undefined, 'transaction')

  return res?.data?.data?.results ?? []
}
