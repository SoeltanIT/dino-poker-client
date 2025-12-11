import { serverApiClient } from '@/@core/lib/axios-client'
import { getApiEndpoint } from '@/utils/api_endpoint'

export const getDetailGames = async (payload: any): Promise<any> => {
  try {
    const res = await serverApiClient.post(`${getApiEndpoint('game_play')}`, { ...payload }, undefined, 'transaction')
    return res?.data?.data
  } catch (err) {
    throw err
  }
}
