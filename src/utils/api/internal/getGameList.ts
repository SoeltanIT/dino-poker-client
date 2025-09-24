import { serverApiClient } from '@/@core/lib/axios-client'
import { gameDTO } from '@/types/gameDTO'
import { getApiEndpoint } from '@/utils/api_endpoint'

const mapData = (item: any) => ({
  image: item?.image,
  id: item?.id,
  title: item?.game_name,
  provider: item?.provider_name
})

export interface GameListResponse {
  page: number
  totalPage: number
  data: gameDTO[]
}

export const getGameList = async ({ page = 1, pageSize = 12 }: any): Promise<GameListResponse> => {
  const bodyRequest = {
    page: page,
    pageSize: pageSize
  }

  try {
    const res = await serverApiClient.get(
      `${getApiEndpoint('game_list')}`,
      {
        params: bodyRequest
      },
      'transaction'
    )

    const rawData = res?.data?.data ?? []
    const total = res?.data?.pagination?.total ?? 0
    const totalPage = Math.ceil(total / pageSize)
    const mappedData = rawData.map((item: any) => mapData(item))

    return {
      page,
      totalPage,
      data: mappedData
    }
  } catch (err) {
    return {
      page: 1,
      totalPage: 0,
      data: []
    }
  }
}
