export interface ListNotificationDTO {
  created_at: string
  id: string
  is_read: boolean
  message: string
  read_at: string
  title: string
  type: string // restrict to defined keys, optional but recommended
  user_id: string
  args?: Record<string, string | number>
}

export interface ListNotifCount {
  count: number
}
