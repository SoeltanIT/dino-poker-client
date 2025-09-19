import { withAuthErrorHandling } from '@/@core/lib/api-wrapper'
import { getListBetTransaction } from '@/utils/api/internal/betHistory'
import { getGameList } from '@/utils/api/internal/getGameList'

// 🔥 FIX: Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  return withAuthErrorHandling(request, async () => {
    const body = await request.json()

    const page = Number(body.page ?? 1)
    const pageSize = Number(body.pageSize ?? 10)

    return await getGameList({ page, pageSize })
  })
}
