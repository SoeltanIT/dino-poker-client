import { withAuthErrorHandling } from '@/@core/lib/api-wrapper'
import { moveBalance } from '@/utils/api/internal/moveBalance'
import { readNotification } from '@/utils/api/internal/notificationRead'
import { transferBalance } from '@/utils/api/internal/transferBalance'

// 🔥 FIX: Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  return withAuthErrorHandling(request, async () => {
    const body = await request.json()

    return await transferBalance(body)
  })
}
