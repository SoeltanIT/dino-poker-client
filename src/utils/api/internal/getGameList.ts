import { gameDTO } from '@/types/gameDTO'

const mapData = (item: any) => ({
  image: item?.image,
  id: item?.id,
  title: item?.game_name,
  provider: item?.provider_name,
})

export interface GameListResponse {
  page: number
  totalPage: number
  data: gameDTO[]
}

export const getGameList = async ({
  page = 1,
  pageSize = 12,
}: any): Promise<GameListResponse> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/games?page=${page}&pageSize=${pageSize}`,
      {
        // ✅ This tells Next.js we want ISR caching
        next: { revalidate: 60 },
      }
    )

    if (!res.ok) throw new Error(`Failed: ${res.status}`)

    const json = await res.json()

    const rawData = json?.data ?? []
    const total = json?.pagination?.total ?? 0
    const totalPage = Math.ceil(total / pageSize)
    const mappedData = rawData.map((item: any) => mapData(item))

    return { page, totalPage, data: mappedData }
  } catch (err) {
    console.error('getGameList error:', err)
    return { page: 1, totalPage: 0, data: [] }
  }
}
