import { serverApiClient } from '@/@core/lib/axios-client'

export const readNotification = async (payload: any) => {
  const response = await serverApiClient.post(`/v1/notifications/${payload}/read`, {}, undefined, 'transaction')
  return response.data
}
