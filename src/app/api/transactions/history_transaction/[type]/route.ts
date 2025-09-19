import { withAuthErrorHandling } from '@/@core/lib/api-wrapper'
import { getListTransaction } from '@/utils/api/internal/transactionHistory'

// 🔥 FIX: Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  return withAuthErrorHandling(request, async () => {
    const body = await request.json()

    const page = Number(body.page ?? 1)
    const pageSize = Number(body.pageSize ?? 10)
    const type = (body.type ?? 'all') as any
    const status = (body.status ?? '') as any
    return await getListTransaction({ page, pageSize, type, status })
  })
}
