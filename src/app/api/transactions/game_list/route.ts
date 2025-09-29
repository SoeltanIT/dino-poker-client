import { withAuthErrorHandling } from '@/@core/lib/api-wrapper'
import { getGameList } from '@/utils/api/internal/getGameList'

// 🔥 FIX: Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  return withAuthErrorHandling(request, async () => {
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page') ?? 1)
    const pageSize = Number(searchParams.get('pageSize') ?? 12) // read client-provided hints (optional)
    const sMax = Number(request.headers.get('x-s-maxage') ?? '120')
    const swr = Number(request.headers.get('x-swr') ?? '60')
    const cacheKey = request.headers.get('x-cache-key') ?? `games-page-${page}`

    const data = await getGameList({ page, pageSize })

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        // ✅ CDN cache for sMax seconds; serve stale while revalidating for swr seconds
        'cache-control': `public, s-maxage=${sMax}, stale-while-revalidate=${swr}`,
        'x-cache-key': cacheKey
      }
    })
  })
}
