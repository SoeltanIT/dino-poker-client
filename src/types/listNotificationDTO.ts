export interface ListNotificationDTO {
  created_at: string
  id: number
  is_read: boolean
  message: string
  read_at: string
  title: string
  type: string // restrict to defined keys, optional but recommended
  user_id: number
  args?: Record<string, string | number>
}

export interface ListNotifCount {
  count: number
}
