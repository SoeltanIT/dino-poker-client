import type { BaseResponse } from '../../../../apimodels/BaseResponse'

export interface GetDetailPlayerResponse extends BaseResponse {
  data: {
    infoPlayer: getInfoPlayer
    historyPlayer: historyPlayer[]
  }
}

export interface getInfoPlayer {
  playerId: string
  submissionDate: string | Date
  documentType: string
  fullName: string
  dateOfBirth: string | Date
  documentNumber: string
  currentStatus: 'Pending' | 'Approved' | 'Rejected'
  amount: string
}

export interface historyPlayer {
  date: string
  type: string
  ammount: string
  note: string
  status: 'Pending' | 'Approved' | 'Rejected'
}
