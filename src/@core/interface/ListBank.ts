import { ListMasterBankDTO } from '@/types/listMasterBankDTO'

export interface ListBankResponse {
  status: string
  data: {
    bank_name: string
    bank_account_number: string
    name: string
  }
}

export interface ListMasterBankResponse {
  status: string
  data: ListMasterBankDTO[]
}
