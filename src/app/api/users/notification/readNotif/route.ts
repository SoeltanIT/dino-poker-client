import { withAuthErrorHandling } from '@/@core/lib/api-wrapper'
import { readNotification } from '@/utils/api/internal/notificationRead'

// 🔥 FIX: Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  return withAuthErrorHandling(request, async () => {
    const body = await request.json()
    return await readNotification(body)
  })
}
