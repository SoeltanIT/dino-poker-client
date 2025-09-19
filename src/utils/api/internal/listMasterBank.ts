import { serverApiClient } from '@/@core/lib/axios-client'
import { ListMasterBankResponse } from '@/@core/interface/ListBank'
import { getApiEndpoint } from '@/utils/api_endpoint'

export const getListMasterBank = async () => {
  const res = await serverApiClient.get<ListMasterBankResponse>(getApiEndpoint('master_bank'))
  const banks = res?.data?.data ?? []

  return banks
}
