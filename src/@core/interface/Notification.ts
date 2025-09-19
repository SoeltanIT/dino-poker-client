import { ListNotifCount } from './../../types/listNotificationDTO'
import { ListNotificationDTO } from '@/types/listNotificationDTO'

export interface ListNotificationResponse {
  status: string
  data: ListNotificationDTO[]
}

export interface ListNotifCountResponse {
  status: string
  data: ListNotifCount
}
