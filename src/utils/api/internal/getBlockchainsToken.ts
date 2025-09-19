import { serverApiClient } from '@/@core/lib/axios-client'
import { getApiEndpoint } from '@/utils/api_endpoint'

export const getListBlockchainsToken = async (id: string) => {
  const res = await serverApiClient.get(
    `${getApiEndpoint('blockchains_token')}?blockchain_id=${id}`,
    undefined,
    'transaction'
  )

  return res?.data?.data ?? []
}
