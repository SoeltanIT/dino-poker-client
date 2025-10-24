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

export const getGameList = async ({ page, pageSize, providerName }: any): Promise<GameListResponse> => {
  // 🔄 Coba beberapa format parameter yang mungkin didukung backend
  const bodyRequest = {
    page: page,
    pageSize: pageSize,
    // Coba beberapa kemungkinan nama parameter
    provider_name: providerName,
    provider: providerName,
    providerName: providerName,
    filter_provider: providerName
  }

  // 🔍 Debug logging
  console.log('🎮 getGameList request:', {
    endpoint: getApiEndpoint('game_list'),
    params: bodyRequest,
    providerName
  })

  try {
    const res = await serverApiClient.get(
      `${getApiEndpoint('game_list')}`,
      {
        params: bodyRequest
      },
      'transaction'
    )

    // 🔍 Debug response
    console.log('🎮 getGameList response:', {
      status: res?.status,
      dataLength: res?.data?.data?.length,
      total: res?.data?.pagination?.total,
      firstGameProvider: res?.data?.data?.[0]?.provider_name
    })

    const rawData = res?.data?.data ?? []
    const total = res?.data?.pagination?.total ?? 0
    const totalPage = Math.ceil(total / pageSize)
    const mappedData = rawData.map((item: any) => mapData(item))

    // 🔄 Client-side filtering sebagai fallback jika backend tidak mendukung
    let filteredData = mappedData
    if (providerName && providerName !== 'all') {
      filteredData = mappedData.filter(
        (game: any) =>
          game.provider?.toLowerCase().includes(providerName.toLowerCase()) ||
          game.provider?.toLowerCase() === providerName.toLowerCase()
      )
      console.log('🎮 Client-side filtering applied:', {
        originalCount: mappedData.length,
        filteredCount: filteredData.length,
        providerName
      })
    }

    return {
      page,
      totalPage,
      data: filteredData
    }
  } catch (err) {
    return {
      page: 1,
      totalPage: 0,
      data: []
    }
  }
}
