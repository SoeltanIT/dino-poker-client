import { serverApiClient } from '@/@core/lib/axios-client'
import { getApiEndpoint } from '@/utils/api_endpoint'
import { NextResponse } from 'next/server'

export const revalidate = 120

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const page = searchParams.get('page') ?? '1'
  const pageSize = searchParams.get('pageSize') ?? '12'

  try {
    // Call your backend using Axios
    const res = await serverApiClient.get(
      getApiEndpoint('game_list'),
      {
        params: { page, pageSize }
      },
      'transaction'
    )

    // Add cache headers so Vercel Edge CDN will cache this response
    return NextResponse.json(res.data, {
      headers: {
        'Cache-Control': 's-maxage=60, stale-while-revalidate=120'
      }
    })
  } catch (error: any) {
    console.error('API /api/games failed:', error)
    return NextResponse.json({ error: 'Failed to fetch game list' }, { status: 500 })
  }
}
