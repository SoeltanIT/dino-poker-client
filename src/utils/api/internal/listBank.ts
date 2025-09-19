// utils/api/internal/user.ts
import { serverApiClient } from '@/@core/lib/axios-client'
import { ListBankResponse } from '@/@core/interface/ListBank'
import { ListBankDTO } from '@/types/listBankDTO'
import { getApiEndpoint } from '@/utils/api_endpoint'

const mapData = (item: any): ListBankDTO => ({
  name: item.name,
  bank_name: item.bank_name,
  bank_account_number: item.bank_account_number
})

export const getListBank = async () => {
  const res = await serverApiClient.get<ListBankResponse>(getApiEndpoint('myself'))
  const rawData = res?.data?.data ?? {}
  const mappedData = mapData(rawData)

  return mappedData
}
